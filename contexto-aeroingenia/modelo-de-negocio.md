# Modelo de negocio de AeroIngenia

> Resumen traído del proyecto madre (`CLAUDE.md` del proyecto AeroIngenia). Fuente de
> mercado allá: `investigacion-propuestas-valor.md`.

## Qué es

Empresa de agricultura de precisión enfocada en **fumigación** y **siembra variable** con
drones. Provincia de Concepción, Región del Biobío, Chile. Regulador aeronáutico: DGAC.
Moneda: CLP.

## Estado real (confirmado por el usuario, 2026-08)

- Opera **informalmente, con ventas**: vende servicio de aplicación de fitosanitarios y
  agroquímicos. Ingresos aprox. CLP $500.000–1.500.000 por mes.
- **Sin inicio de actividades en primera categoría ante el SII.**
- Equipo propio: **un dron XAG P30** de fumigación (tanque 16 L, ancho 10 m, caudal
  0,3–6 L/min, gota 60–400 micrones). No tiene cámara multiespectral.
- Cultivos objetivo: berries (arándano, frambuesa), cereales y praderas, forestal (pino,
  eucalipto), viñedos y frutales.
- Licencia de piloto / habilitación fitosanitaria: tema que el proyecto madre excluye de
  sus piezas por pedido del usuario. Esta landing, en cambio, ya tiene su propio trabajo
  de registro regulatorio en `../tramites/` — son dos proyectos con alcance distinto, no
  se está siendo inconsistente a propósito.

## Modelo híbrido en 3 capas

Cada capa depende de que la anterior ya funcione:

1. **Servicio** (pay-per-acre) — cobro por hectárea aplicada/sembrada, sin que el
   productor invierta en flota propia. Es la puerta de entrada, y la única capa que hoy
   factura. Es lo que vende esta landing.
2. **Plataforma** (SaaS de datos) — mapas de prescripción y monitoreo online sobre las
   hectáreas ya tratadas; suscripción opcional que fideliza al cliente. Requiere cámara
   multiespectral, que todavía no se tiene.
3. **Datos a terceros** (B2B2Farmer) — exportadoras y aseguradoras pagan por certificar la
   trazabilidad/sostenibilidad de esos datos. Ingreso adicional sin costo extra al
   productor.

## Propuesta de valor (usar siempre en este orden de prioridad)

1. Ahorro cuantificable de insumos (agroquímicos, agua, semilla) — comunicar en % concreto.
2. Reducción de costo operativo vs. método tradicional (referencia: -30/50%).
3. Sin inversión de capital para el productor.
4. Menor impacto ambiental, vendible a compradores con exigencias de sostenibilidad.
5. Datos y trazabilidad como subproducto certificable.

## Roadmap

| Fase | Estado | Foco | Hitos clave |
|---|---|---|---|
| 1 — Servicio | En curso, informal | Formalizar lo que ya funciona | Aplicación por hectárea con el XAG P30; inicio de actividades en SII; regularización DGAC |
| 2 — Plataforma | Próximo paso | Dosis variable | Cámara multiespectral y mapas de prescripción; reporte por aplicación |
| 3 — Datos | Futuro | Multiplicar ingreso | Reportes de trazabilidad para exportadoras de berries y aseguradoras |

No se avanza una fase sin tener la anterior operativa y facturando. La capa 1 ya factura:
el salto pendiente es la capa 2, y el equipo de fumigación **ya está comprado** — lo que
falta es la capacidad de mapeo.

## Por qué importa para esta landing

Todo lo que este sitio comunica hoy (fumigación, siembra, cobertura por comuna) es capa 1.
Cualquier mención futura a "mapas", "reportes" o "monitoreo online" en el sitio pertenece a
la capa 2 y **no está disponible todavía** — no prometerlo como si ya existiera.
