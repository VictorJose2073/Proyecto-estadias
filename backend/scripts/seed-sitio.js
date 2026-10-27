'use strict';

// Carga en Strapi los textos que antes estaban fijos en el frontend.
// Solo crea lo que está vacío, así que correrlo de nuevo no pisa lo editado en el panel.
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const SERVICES = [
  { title: 'Reparación de bisagras', description: 'Revisión y reparación de bisagras dañadas en laptops.' },
  { title: 'Reemplazo de batería', description: 'Evaluación de batería y sustitución según el modelo del equipo.' },
  { title: 'Reparación de pantalla', description: 'Evaluación de daños en pantalla y opciones de reemplazo disponibles.' },
  { title: 'Mantenimiento preventivo', description: 'Limpieza interna y revisión del sistema de enfriamiento.' },
  { title: 'Reparación de teclado', description: 'Revisión de teclas, teclado y conexiones relacionadas.' },
  { title: 'Diagnóstico técnico', description: 'Evaluación inicial para identificar posibles fallas de hardware o software.' },
];

const HOME_HERO = {
  title: 'Reparación de laptops y equipos',
  text: 'Mantenimiento y reparación de bisagras, pantallas, baterías y otros componentes. Consulta el estado de una orden con tu número de referencia.',
};

// Una línea en blanco en el texto separa los párrafos en el sitio
const HOME_PROCESS = {
  title: 'Un proceso claro para cada reparación',
  body: 'Revisamos el equipo, explicamos el diagnóstico y compartimos el trabajo realizado al entregar la orden. Las condiciones y el alcance de cada servicio se confirman antes de comenzar.\n\nEl portal muestra la información registrada para cada referencia. La disponibilidad y vigencia de esos datos dependen de la actualización del sistema.',
  noteTitle: 'Antes de autorizar',
  noteText: 'Solicita el diagnóstico, el costo y las condiciones de garantía de tu reparación.',
};

const ABOUT_PAGE = {
  title: 'Quiénes somos',
  intro: 'Conoce el proceso de atención y reparación de HRL Hector Refacciones Laptop.',
  sections: [
    {
      title: 'Cómo trabajamos',
      body: 'Cada equipo requiere una evaluación. Antes de realizar una reparación, se debe confirmar el diagnóstico, el costo y el plazo estimado con el taller.',
    },
    {
      title: 'Transparencia y cuidado',
      body: 'La información de cada orden debe corresponder al equipo recibido y mantenerse actualizada en el sistema de seguimiento.',
    },
  ],
};

async function seed(strapi) {
  const services = strapi.documents('api::service.service');
  if ((await services.count()) === 0) {
    for (const [index, service] of SERVICES.entries()) {
      await services.create({ data: { ...service, order: index + 1 } });
    }
    console.log(`Servicios creados: ${SERVICES.length}`);
  } else {
    console.log('Servicios: ya hay contenido, no se tocan');
  }

  const hero = strapi.documents('api::home-hero.home-hero');
  if (!(await hero.findFirst())) {
    await hero.create({ data: HOME_HERO });
    console.log('Portada de Inicio: creada');
  } else {
    console.log('Portada de Inicio: ya hay contenido, no se toca');
  }

  const homeProcess = strapi.documents('api::home-process.home-process');
  if (!(await homeProcess.findFirst())) {
    await homeProcess.create({ data: HOME_PROCESS });
    console.log('Proceso de Inicio: creado');
  } else {
    console.log('Proceso de Inicio: ya hay contenido, no se toca');
  }

  const about = strapi.documents('api::about-page.about-page');
  if (!(await about.findFirst())) {
    await about.create({ data: ABOUT_PAGE });
    console.log('Quiénes somos: creado');
  } else {
    console.log('Quiénes somos: ya hay contenido, no se toca');
  }
}

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';
  try {
    await seed(app);
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
