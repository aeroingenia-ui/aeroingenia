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
| `Proceso de operatividad XAG P30.pdf` | Checklist pre y post vuelo. **Ojo: la declaración de instrucción viene en blanco y sin firmar** — no acredita nada como está |
| `aeroingenia_logo_icono.pdf` | Logo original (ver nota más abajo) |
| `.backup/` | Versión anterior de la página, antes del giro a AeroIngenia |

### Carpetas de contexto (no se publican)

| Carpeta | Qué contiene |
|---------|--------------|
| `contexto-aeroingenia/` | Modelo de negocio, mercado/precios e identidad visual del proyecto AeroIngenia, traídos del proyecto madre para que quien edite esta landing no tenga que abrir el otro repo |
| `agents/` | Copia de referencia de los 6 agentes especializados del proyecto AeroIngenia (agronomía, marketing, evaluación comercial, ingeniería comercial, desarrollo web, QA). Documentación, no agentes activos de Claude Code (no están en `.claude/`) |
| `skills/` | Copia de las habilidades (`anthropics/skills`) que usan esos agentes |
| `tramites/` | Investigación de habilitaciones regulatorias (DGAC, SAG, SEREMI de Salud) para operar legalmente lo que este sitio ofrece |

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

- Precisión RTK y tasa variable
- **Las 14 ha/h del manual ya NO se publican como promesa** — ver "Rendimiento real" abajo
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

## Rendimiento real — por qué el sitio ya no promete 14 ha/h

El manual del XAG P30 declara `Operating efficiency: 14ha/h`, y la landing lo publicaba
en seis lugares. **Esa cifra no es alcanzable con este equipo** y se sacó del sitio.

Tres razones, en orden de fuerza:

1. **Geométrica, independiente de la dosis.** `ha/h = ancho(m) × velocidad(m/s) × 0,36`.
   Al ancho máximo del manual (6 m) y 6 m/s, el techo con 100% de tiempo en el aire
   —sin virajes, sin recargas, sin cambio de batería— es **12,96 ha/h**. Ya está
   debajo de 14. Y para superarlo habría que volar 60 min por hora con 4 baterías que
   suman ~40 min nominales.
2. **El propio fabricante lo relativiza.** Las 14 ha/h figuran bajo "Other Features",
   no bajo "Spraying System", y el manual aclara al pie que los datos se midieron
   *"when the UAV is at its best flight status"*.
3. **El distribuidor en Chile publica menos.** Tecmundo, que vende el equipo, declara
   **8–10 ha/h** en la ficha del P30.

### Rango estimado

Calculado con `tramites/rendimiento-real.awk`:

| Mojamiento y terreno | ha/h |
|---|---|
| 10 L/ha, plano | ~8 |
| **15 L/ha, plano** (equivale al precio de $18.000/ha) | **~6** |
| Pradera 25 L/ha, plano | 4,5 |
| Trigo 30 L/ha, plano | 4,0 |
| Viñedo, forestal o lomaje | 2,1 – 2,7 |

**El rango honesto es 2 a 8 ha/h, y lo gobierna el mojamiento, no el cultivo.**
El P30 es rentable en la banda de **10–25 L/ha**; sobre ~30 L/ha pierde estructuralmente
contra equipos de estanque grande (T50/T100), cobre lo que cobre.

⚠️ **Sigue siendo un modelo, no una medición.** Recalibrar con datos reales:

```bash
awk -v T_VUELO=8 -v T_RECARGA=16 -f tramites/rendimiento-real.awk
```

En la primera jornada hay que cronometrar: minutos de vuelo hasta que el dron pide
volver, minutos reales de recarga, y minutos de cambio de batería + recarga de estanque.

## Afirmaciones que se corrigieron y por qué

| Antes | Ahora | Motivo |
|---|---|---|
| "Terminamos en horas lo que tomaba días" | "Aplicamos donde no entra el tractor" | Falso contra un autopropulsado terrestre (20–40 ha/h). La velocidad es el único eje donde el dron pierde |
| "14 hectáreas por hora" (×6) | Atribuido al manual, en un solo párrafo | Ver arriba |
| "Cubre lo que a un equipo terrestre le toma varios días" | Reemplazado por acceso a suelo no transitable | Mismo motivo |
| "Entramos con el potrero mojado" | "No dependés de que el suelo esté firme" | Follaje mojado da escurrimiento; y con 2 días hábiles de aviso previo obligatorio no se puede prometer entrada oportunista |
| "Aplicaciones realizadas conforme a la normativa del SAG" | "Servicio sujeto a la normativa vigente" | Falso por partida doble: no hay aplicaciones hechas ni registro SAG de empresa aplicadora |
| "Operador con instrucción certificada" | "Procedimiento de operatividad del fabricante" | El respaldo es una declaración en blanco sin firmar. Y la instrucción del fabricante no equivale a credencial DGAC ni a capacitación SAG |

## Pendientes de decisión comercial (no aplicados)

- Agregar **arándano** como cultivo destacado — cabe en la banda de 10–25 L/ha del P30
- Bajar **trigo y avena** a mención de una línea — compiten contra el tractor con premium de 2–4×
- **No publicar cerezo**: su programa es de 50–100 L/ha, más de 3 recargas por hectárea con estanque de 16 L
- Publicar el mínimo como **"equivalente a 5 hectáreas por salida"**, en hectáreas y no en pesos
- Usar el vencimiento del descuento (30/09/2026) para resetear el ancla a **"desde $22.000/ha a 15 L/ha"**
