'use strict';

const PUBLIC_READ = ['api::work.work', 'api::article.article', 'api::category.category'];

module.exports = {
  register() {},

  // El público solo puede leer (find/findOne); escribir requiere sesión de administrador
  async bootstrap({ strapi }) {
    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!role) return;

    for (const uid of PUBLIC_READ) {
      for (const action of ['find', 'findOne']) {
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
  },
};
