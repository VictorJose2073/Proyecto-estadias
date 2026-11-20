module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Dirección pública en producción (p. ej. https://hrl-cms.up.railway.app); vacía en local
  url: env('PUBLIC_URL', ''),
  // Detrás del proxy HTTPS de Railway: confiar en sus cabeceras para las cookies seguras del panel
  proxy: { koa: env.bool('IS_PROXIED', false) },
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
