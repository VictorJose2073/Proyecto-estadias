export default {
  config: {
    // Idiomas extra del panel; cada usuario elige el suyo en Perfil
    locales: ['es'],
  },
  register(app) {
    // Marca sobre la foto qué parte se verá en el encabezado; se guarda como { x, y } en porcentaje
    app.customFields.register({
      name: 'focal-point',
      type: 'json',
      intlLabel: { id: 'focal-point.label', defaultMessage: 'Encuadre de imagen' },
      intlDescription: {
        id: 'focal-point.description',
        defaultMessage: 'Elige qué parte de la imagen se ve cuando se recorta',
      },
      components: {
        Input: async () => import('./components/FocalPointInput.jsx'),
      },
    })
  },
  bootstrap() {},
};
