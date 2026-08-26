# AeroIngenia — Landing de fumigación y siembra con drones

Landing page estática para AeroIngenia, servicio de fumigación y siembra aérea con dron
XAG P30 en las regiones de Ñuble y Biobío, Chile.

Sin dependencias, sin build: se abre directo en el navegador con doble clic en `index.html`.

## Archivos

| Archivo      | Qué contiene                                                          |
|--------------|-----------------------------------------------------------------------|
| `index.html` | Estructura y todo el contenido de texto                               |
| `styles.css` | Estilos, paleta de marca (variables CSS) y responsive                 |
| `script.js`  | Menú móvil, animaciones, grilla de vuelo y formulario → WhatsApp      |

### Material de referencia (no se publica)

| Archivo | Para qué se usó |
|---------|-----------------|
| `publicidad.jpg` | Fuente de la propuesta de valor, precios, comunas y datos de contacto |
| `guia p30 dron.pdf` | Especificaciones técnicas reales del equipo XAG P30 |
| `Proceso de operatividad XAG P30.pdf` | Checklist pre y post vuelo, instrucción certificada |
| `aeroingenia_logo_icono.pdf` | Logo original (ver nota más abajo) |
| `.backup/` | Versión anterior de la página, antes del giro a AeroIngenia |

## Secciones

1. **Barra de lanzamiento** — descuento vigente hasta el 30/09/2026, se puede cerrar
2. **Hero** — propuesta de valor + tarjeta del equipo con grilla de vuelo animada
3. **Beneficios** — seis razones para aplicar con dron
4. **Servicios** — fumigación/pulverización y siembra aérea, con parámetros reales
5. **Equipo** — nueve especificaciones del XAG P30
6. **Cultivos** — viñedos, trigo y avena, praderas, plantaciones forestales
7. **Cómo funciona** — los tres pasos del aviso
8. **Cobertura** — comunas atendidas + tarjeta de precio
9. **Contacto** — vías directas + formulario que arma el mensaje de WhatsApp
10. **Footer** + botón flotante de WhatsApp

## Datos que salen del aviso publicitario

Todo lo verificable de la página viene de `publicidad.jpg` o del manual del P30:

- 14 hectáreas por hora, precisión RTK, tasa variable
- Cotizaciones desde $18.000/ha (CLP), visita técnica sin costo
- Comunas: Los Ángeles, Chillán, San Carlos, Bulnes, Yungay, Coihueco
- WhatsApp +56 9 7424 0110 · aeroingenia@gmail.com · @aeroingenia
- Specs del equipo: ±10 cm RTK, estanque 16 L, 4 boquillas, gota 90–300 μm,
  ancho 2–6 m, caudal 5,6 L/min, IP67, detección de obstáculos 1,5–20 m

**No hay testimonios, cantidad de clientes ni hectáreas acumuladas**, porque la empresa
recién está lanzando. Cuando tengas clientes reales y hayas pedido su autorización,
ese es el momento de agregar esa sección.

## Personalización

### Colores

Todo el sistema visual está en variables CSS al inicio de `styles.css`:

```css
:root {
  --verde-900: #0d2117;   /* fondo del logo y secciones oscuras */
  --oro-500:   #d8a02a;   /* dorado de la marca */
  --lima-500:  #7cb342;   /* verde de los checks */
  --crema:     #f5f3ed;   /* fondo de secciones claras */
  --ancho:     1240px;    /* ancho máximo del contenido */
}
```

### Cambiar el número de WhatsApp

Está en una sola constante, arriba de `script.js`:

```js
var WSP = '56974240110';
```

Ojo: los enlaces `href="https://wa.me/..."` que están escritos directo en `index.html`
(botón flotante, sección de contacto, footer) hay que cambiarlos también.

### El logo

El logo de la barra superior está dibujado en SVG dentro de `index.html`, reproduciendo
el ícono del aviso. Si quieres usar el archivo original, convertí `aeroingenia_logo_icono.pdf`
a SVG o PNG con fondo transparente y reemplazá el bloque `<svg class="logo__mark">` por
`<img src="logo.svg" class="logo__mark" alt="AeroIngenia">`.

## Pendientes antes de publicar

- [ ] Convertir el logo del PDF a SVG/PNG y reemplazar la versión dibujada a mano
- [ ] Reemplazar `publicidad.jpg` por una imagen `og:image` de 1200×630 px
- [ ] Agregar fotos reales del dron operando en terreno
- [ ] Confirmar que el precio de $18.000/ha sigue vigente
- [ ] Revisar la mención al SAG con quien corresponda antes de publicarla
- [ ] Contratar dominio y hosting

## Notas técnicas

- Responsive en tres cortes: 1080 px, 900 px y 620 px
- Respeta `prefers-reduced-motion`: desactiva animaciones y contadores
- Navegación por teclado con foco visible; menú móvil con `aria-expanded`
- La barra de lanzamiento recuerda que la cerraste vía `localStorage`
- El formulario no necesita backend: valida en el navegador y abre WhatsApp
  con el mensaje ya redactado. El usuario decide si lo envía.
- La grilla de vuelo del hero se genera en `script.js` con pasadas alternadas,
  igual que la ruta que arma la app XAG sobre el potrero
