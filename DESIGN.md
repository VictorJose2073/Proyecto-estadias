# Dirección visual

## Objetivo

Presentar un taller de reparación de laptops con una interfaz clara, práctica y
confiable. La información comercial debe ser verificable; los datos pendientes
se identifican como `[DATO REAL: ...]` y no se convierten en enlaces funcionales.

## Sistema visual

Los colores viven como variables: la paleta clara en
`frontend/src/styles/global.css` y la oscura en `frontend/src/styles/theme-dark.css`,
con las mismas variables y en el mismo orden. El botón de la luna en el menú
alterna entre ambas y recuerda la elección; la primera visita sigue el modo del
sistema.

### Modo claro

| Uso | Variable | HEX |
|---|---|---|
| Barra superior y paneles destacados | `--color-featured` | `#17384A` |
| Botones y acciones principales | `--color-accent` | `#1B72AD` |
| Botones al pasar el cursor | `--color-accent-hover` | `#155C8C` |
| Enlaces y cifras resaltadas | `--color-link` | `#155C8C` |
| Selecciones y avisos informativos | `--color-info-bg` | `#DCEBF7` |
| Texto sobre azul claro | `--color-info-text` | `#0F4C78` |
| Texto principal | `--color-text` | `#12222D` |
| Texto secundario | `--color-muted` | `#435664` |
| Fondo general | `--color-page` | `#E7ECF0` |
| Paneles secundarios | `--color-panel` | `#F3F6F8` |
| Tarjetas y formularios | `--color-surface` | `#FFFFFF` |
| Separadores | `--color-border` | `#D5DDE4` |
| Bordes de controles | `--color-control-border` | `#81939F` |

| Estado | Color principal | Fondo suave |
|---|---|---|
| Pendiente / advertencia | `#D99A1E` | `#FCEFD0` |
| Listo / completado | `#1B9C8E` | `#D6EFE8` |
| Neutral | `#7B8A96` | `#E3E8EC` |
| Error | `#85251E` | `#FFF2F0` |

### Modo oscuro

| Uso | Variable | HEX |
|---|---|---|
| Barra superior y paneles destacados | `--color-featured` | `#17384A` |
| Botones y acciones principales | `--color-accent` | `#1B72AD` |
| Botones al pasar el cursor | `--color-accent-hover` | `#155C8C` |
| Enlaces y cifras resaltadas | `--color-link` | `#7CC0EE` |
| Selecciones y avisos informativos | `--color-info-bg` | `#16344A` |
| Texto sobre azul (avisos) | `--color-info-text` | `#B9DCF5` |
| Texto principal | `--color-text` | `#E7ECF0` |
| Texto secundario | `--color-muted` | `#A9B8C3` |
| Fondo general | `--color-page` | `#0E171D` |
| Paneles secundarios | `--color-panel` | `#142129` |
| Tarjetas y formularios | `--color-surface` | `#1A2A34` |
| Separadores | `--color-border` | `#2B3D49` |
| Bordes de controles | `--color-control-border` | `#6B7F8C` |

| Estado | Color principal | Fondo suave |
|---|---|---|
| Pendiente / advertencia | `#D99A1E` | `#3A2E12` |
| Listo / completado | `#1B9C8E` | `#12332F` |
| Neutral | `#7B8A96` | `#26323A` |
| Error | `#F2A59D` | `#3A1A17` |

Reglas de contraste:

- Los colores principales de pendiente, listo y neutral no llegan a 4.5:1 como
  texto. Se usan en bordes e indicadores; el texto va en `--color-text`.
- `#1B72AD` como texto sobre el fondo general da 4.35:1; los enlaces usan
  `--color-link` (`#155C8C` en claro, `#7CC0EE` en oscuro).
- En modo oscuro todos los pares de texto pasan 4.5:1 (de 7.2:1 a 15.2:1).
- En paneles destacados el texto va en blanco y el secundario en `#DCEBF7`.
- Bordes discretos, esquinas moderadas y sombras solo cuando ayudan a separar
  superficies.
- Tipografía del sistema, títulos en estilo de oración y texto de interfaz de al
  menos `0.75rem`.

## Componentes y contenido

- Priorizar títulos descriptivos, controles accesibles y estados visibles.
- Evitar cifras, precios, certificaciones, fotos, direcciones y promesas que no
  estén confirmadas por el taller.
- El seguimiento debe describirse según la información realmente disponible;
  no prometer actualización en tiempo real.
- Diseñar primero para móvil; usar rejillas que se reduzcan a una columna en
  pantallas pequeñas.
