'use strict';

const { factories } = require('@strapi/strapi');

const UID = 'api::work.work';

module.exports = factories.createCoreController(UID, ({ strapi }) => ({
  // Aunque se publique por error, el público nunca ve trabajos sin consentimiento del cliente
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      filters: { ...(ctx.query.filters || {}), consentimientoCliente: true },
    };
    return super.find(ctx);
  },

  async findOne(ctx) {
    const entry = await strapi.documents(UID).findOne({
      documentId: ctx.params.id,
      fields: ['consentimientoCliente'],
    });
    if (!entry || !entry.consentimientoCliente) {
      return ctx.notFound();
    }
    return super.findOne(ctx);
  },
}));
