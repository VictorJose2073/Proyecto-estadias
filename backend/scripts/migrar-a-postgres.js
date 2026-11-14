'use strict';

// Copia todos los datos del SQLite de desarrollo a PostgreSQL.
// Strapi crea las tablas en PostgreSQL al arrancar; este script solo pasa las filas.
// Requiere DATABASE_CLIENT=postgres en .env. El SQLite se abre en solo lectura y no se modifica.
//
// Uso: npm run migrar:postgres            (se niega si PostgreSQL ya tiene un administrador)
//      npm run migrar:postgres -- --forzar (vacía PostgreSQL y vuelve a copiar)
const path = require('path');
const Database = require('better-sqlite3');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

// Estas dos las genera Strapi para el esquema de PostgreSQL; copiar las de SQLite las dejaría mal
const SKIP_TABLES = new Set(['strapi_database_schema', 'strapi_migrations_internal']);
const CHUNK = 500;

function convert(value, dataType) {
  if (value === null || value === undefined) return null;
  if (dataType === 'boolean') return Boolean(value);
  // SQLite guarda las fechas con hora como milisegundos
  if (dataType.startsWith('timestamp')) return new Date(value);
  // El JSON va como texto: pg convertiría un arreglo de JS en un arreglo de PostgreSQL
  if (dataType === 'json' || dataType === 'jsonb') {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }
  return value;
}

// Ordena las tablas para insertar primero las que son referenciadas por otras
function sortByDependencies(tables, foreignKeys) {
  const pending = new Map(tables.map((t) => [t, new Set()]));
  for (const { child, parent } of foreignKeys) {
    if (child !== parent && pending.has(child) && pending.has(parent)) {
      pending.get(child).add(parent);
    }
  }
  const sorted = [];
  while (pending.size > 0) {
    const ready = [...pending.keys()].filter((t) => pending.get(t).size === 0);
    if (ready.length === 0) {
      throw new Error(`Llaves foráneas en ciclo entre: ${[...pending.keys()].join(', ')}`);
    }
    for (const table of ready) {
      pending.delete(table);
      sorted.push(table);
    }
    for (const deps of pending.values()) ready.forEach((t) => deps.delete(t));
  }
  return sorted;
}

async function migrate(strapi, sqlite, force) {
  const pg = strapi.db.connection;
  const schema = strapi.config.get('database.connection.connection.schema', 'public');

  const { rows: columnRows } = await pg.raw(
    'select table_name, column_name, data_type from information_schema.columns where table_schema = ?',
    [schema]
  );
  const pgColumns = new Map();
  for (const { table_name, column_name, data_type } of columnRows) {
    if (!pgColumns.has(table_name)) pgColumns.set(table_name, new Map());
    pgColumns.get(table_name).set(column_name, data_type);
  }

  const { rows: fkRows } = await pg.raw(
    `select c.conrelid::regclass::text as child, c.confrelid::regclass::text as parent, a.attname as "column"
       from pg_constraint c
       join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
      where c.contype = 'f' and c.connamespace = ?::regnamespace`,
    [schema]
  );
  const foreignKeys = fkRows.map((fk) => ({ ...fk, child: fk.child.replace(/"/g, ''), parent: fk.parent.replace(/"/g, '') }));

  const sqliteTables = sqlite
    .prepare("select name from sqlite_master where type = 'table' and name not like 'sqlite_%'")
    .all()
    .map((row) => row.name);

  const tables = [];
  for (const table of sqliteTables) {
    if (SKIP_TABLES.has(table)) continue;
    if (!pgColumns.has(table)) {
      console.warn(`Aviso: "${table}" no existe en PostgreSQL (tabla sobrante en SQLite), se omite`);
      continue;
    }
    tables.push(table);
  }

  const { rows: admins } = await pg.raw('select count(*)::int as n from admin_users');
  if (admins[0].n > 0 && !force) {
    throw new Error('PostgreSQL ya tiene datos. Usa "-- --forzar" para vaciarlo y volver a copiar.');
  }

  const order = sortByDependencies(tables, foreignKeys);
  const counts = [];

  await pg.transaction(async (trx) => {
    await trx.raw(`truncate table ${tables.map((t) => `"${t}"`).join(', ')} restart identity cascade`);

    for (const table of order) {
      const types = pgColumns.get(table);
      const rows = sqlite.prepare(`select * from "${table}"`).all();
      if (rows.length === 0) continue;

      const columns = Object.keys(rows[0]).filter((column) => {
        if (types.has(column)) return true;
        console.warn(`Aviso: la columna "${table}.${column}" no existe en PostgreSQL, se omite`);
        return false;
      });
      // Una tabla que se referencia a sí misma se inserta sin esa columna y se completa después
      const selfColumns = foreignKeys
        .filter((fk) => fk.child === table && fk.parent === table)
        .map((fk) => fk.column);

      const converted = rows.map((row) =>
        Object.fromEntries(columns.map((c) => [c, convert(row[c], types.get(c))]))
      );
      const firstPass = converted.map((row) => {
        const copy = { ...row };
        for (const column of selfColumns) copy[column] = null;
        return copy;
      });
      for (let i = 0; i < firstPass.length; i += CHUNK) {
        await trx(table).insert(firstPass.slice(i, i + CHUNK));
      }
      for (const row of converted) {
        const selfValues = Object.fromEntries(
          selfColumns.filter((c) => row[c] !== null).map((c) => [c, row[c]])
        );
        if (Object.keys(selfValues).length > 0) {
          await trx(table).where({ id: row.id }).update(selfValues);
        }
      }

      // El siguiente id que genere PostgreSQL debe continuar después del último copiado
      if (types.has('id')) {
        await trx.raw(
          `select setval(pg_get_serial_sequence(?, 'id'), (select max(id) from "${table}"))`,
          [`"${table}"`]
        );
      }
    }

    for (const table of order) {
      const expected = sqlite.prepare(`select count(*) as n from "${table}"`).get().n;
      const { rows: actual } = await trx.raw(`select count(*)::int as n from "${table}"`);
      if (actual[0].n !== expected) {
        throw new Error(`"${table}": SQLite tiene ${expected} filas y PostgreSQL ${actual[0].n}`);
      }
      if (expected > 0) counts.push([table, expected]);
    }
  });

  return counts;
}

async function main() {
  if (process.env.DATABASE_CLIENT !== 'postgres') {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
  }
  if (process.env.DATABASE_CLIENT !== 'postgres') {
    throw new Error('Pon DATABASE_CLIENT=postgres (y los datos de conexión) en .env antes de migrar.');
  }
  const sqliteFile = path.join(__dirname, '..', process.env.DATABASE_FILENAME || '.tmp/data.db');
  const sqlite = new Database(sqliteFile, { readonly: true, fileMustExist: true });

  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';
  try {
    const counts = await migrate(app, sqlite, process.argv.includes('--forzar'));
    for (const [table, n] of counts) console.log(`${table}: ${n}`);
    console.log(`Listo: ${counts.length} tablas con datos copiadas desde ${sqliteFile}`);
  } finally {
    sqlite.close();
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
