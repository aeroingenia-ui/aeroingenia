# Contexto AeroIngenia — para quien trabaje en esta landing

Esta carpeta resume lo que se sabe del proyecto AeroIngenia como empresa (no solo como
sitio web), reunido en un proyecto de trabajo aparte. Se agrega acá para que quien edite
esta landing no tenga que abrir el otro proyecto para entender de dónde salen los datos,
el precio o el tono de marca.

**No reemplaza al proyecto original.** Si algo cambia allá (modelo de negocio, precios,
identidad visual, agentes), hay que volver a traer la actualización acá — no se edita al
revés.

## Archivos

| Archivo | Contiene |
|---|---|
| `modelo-de-negocio.md` | Qué es AeroIngenia, estado real de la empresa, modelo de 3 capas y roadmap |
| `mercado-y-precios.md` | Cómo se forma el precio en el mercado chileno de aplicación con dron, y una tensión sin resolver con el precio publicado en este sitio |
| `identidad-visual-marca-madre.md` | Paleta/tipografía oficial del proyecto madre — **distinta** de la que usa `styles.css` hoy. No se tocó el sitio; queda como nota |

## Sobre `agents/` y `skills/`

Son copias de referencia de los agentes especializados y las habilidades que usa el
proyecto AeroIngenia (agronomía, marketing, evaluación comercial, ingeniería comercial,
desarrollo web, QA de coherencia). Documentan **cómo se construyó** el contenido de esta
landing y sirven de referencia si hay que revisar o ampliar algo con el mismo criterio.

Ojo: están en `agents/` y `skills/`, no en `.claude/agents/` y `.claude/skills/` — por eso
son solo documentación, no agentes activos de Claude Code dentro de este repositorio. Si
en algún momento se quiere poder invocarlos directamente trabajando en esta carpeta, hay
que moverlos a `.claude/`. No lo hice porque no fue lo pedido, pero queda como opción.

## Mantenimiento

Este README y los tres archivos de esta carpeta se van a actualizar cada vez que el
usuario pida sumar información nueva del proyecto AeroIngenia a esta landing.
