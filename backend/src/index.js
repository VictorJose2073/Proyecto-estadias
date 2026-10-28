'use strict';

// Los tipos únicos (contacto, quiénes somos) solo tienen find
const PUBLIC_READ = {
  'api::work.work': ['find', 'findOne'],
  'api::category.category': ['find', 'findOne'],
  'api::service.service': ['find', 'findOne'],
  'api::home-hero.home-hero': ['find'],
  'api::home-process.home-process': ['find'],
  'api::contact-info.contact-info': ['find'],
  'api::about-page.about-page': ['find'],
};

// El sitio no tiene cuentas de usuario; Strapi deja el registro público abierto por defecto
const PUBLIC_DENIED = ['plugin::users-permissions.auth.register'];

module.exports = {
  // El campo de encuadre guarda { x, y }; su editor visual vive en src/admin
  register({ strapi }) {
    strapi.customFields.register({ name: 'focal-point', type: 'json' });
  },

  // El público solo puede leer (find/findOne); escribir requiere sesión de administrador
  async bootstrap({ strapi }) {
    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!role) return;

    for (const [uid, actions] of Object.entries(PUBLIC_READ)) {
      for (const action of actions) {
        const name = `${uid}.${action}`;
        const exists = await strapi.db
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: name, role: role.id } });
        if (!exists) {
          await strapi.db
            .query('plugin::users-permissions.permission')
            .create({ data: { action: name, role: role.id } });
        }
      }
    }

    await strapi.db
      .query('plugin::users-permissions.permission')
      .deleteMany({ where: { action: { $in: PUBLIC_DENIED }, role: role.id } });
  },
};
