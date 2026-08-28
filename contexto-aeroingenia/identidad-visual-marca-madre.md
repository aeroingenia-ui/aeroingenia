# Identidad visual del proyecto madre AeroIngenia

> Tokens oficiales definidos en `modelo-de-negocio.html` del proyecto AeroIngenia. Se
> documentan acá tal cual, **sin aplicarlos** a esta landing — ver la nota al final.

## Tipografía

- Display (títulos): `Fraunces`, peso 600–900. En Office (Word/PowerPoint): `Fraunces 9pt`.
- Cuerpo: stack de sistema (`-apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif`).
- Datos/etiquetas/mono: `IBM Plex Mono`, peso 500–600.

## Paleta — modo claro

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#EEF0E6` | fondo de página |
| `--surface` | `#F8F9F1` | tarjetas, celdas |
| `--surface-raised` | `#FFFFFF` | elementos elevados |
| `--ink` | `#23281E` | texto principal |
| `--ink-soft` | `#57604C` | texto secundario |
| `--ink-faint` | `#8A9078` | metadatos, etiquetas |
| `--line` | `#D7DAC7` | bordes, separadores |
| `--accent` | `#C77D2E` | énfasis principal (ámbar/cosecha) |
| `--accent-2` | `#1E6E62` | dato/tecnología (verde precisión) |

## Paleta — modo oscuro

| Token | Hex |
|---|---|
| `--bg` | `#171A14` |
| `--surface` | `#1D2117` |
| `--surface-raised` | `#232719` |
| `--ink` | `#ECE9DA` |
| `--ink-soft` | `#ABAF98` |
| `--ink-faint` | `#6E7460` |
| `--line` | `#343A2A` |
| `--accent` | `#E0A94E` |
| `--accent-2` | `#56C6B4` |

Favicon de artifacts del proyecto madre: 🌾

## ⚠️ Esta landing usa una paleta distinta — no resuelto

`styles.css` de este sitio define su propio sistema, tomado de `publicidad.jpg` (el aviso
publicitario original), no del proyecto madre:

```css
--verde-900: #0d2117;   /* fondo del logo y secciones oscuras */
--oro-500:   #d8a02a;   /* dorado de la marca */
--lima-500:  #7cb342;   /* verde de los checks */
--crema:     #f5f3ed;   /* fondo de secciones claras */
```

Y el favicon de esta landing es un `favicon.svg` propio, distinto del 🌾 del proyecto
madre.

**No unifiqué nada** — el sitio ya está publicado con esta identidad y cambiarla es una
decisión de marca, no un ajuste técnico. Si en algún momento se quiere que todo el
material de AeroIngenia (landing incluida) comparta una sola identidad visual, hay que
decidir explícitamente cuál de las dos paletas queda, y avisar para actualizar
`styles.css` en consecuencia.
