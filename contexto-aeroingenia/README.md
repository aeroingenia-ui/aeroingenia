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

## Sobre los agentes y `skills/`

Los 7 agentes especializados viven en `.claude/agents/` y **son agentes activos de Claude
Code**: se descubren al iniciar la sesión y se invocan por nombre. Cubren agronomía,
marketing, evaluación comercial, ingeniería comercial, desarrollo web, QA de coherencia
y diseño audiovisual.

La carpeta duplicada `agents/`, que solo servía de documentación, se eliminó: tener dos
copias del mismo archivo garantiza que tarde o temprano se edite la que no corresponde.

`skills/` sigue siendo copia de referencia de las habilidades que usan esos agentes.

## Mantenimiento

Este README y los tres archivos de esta carpeta se van a actualizar cada vez que el
usuario pida sumar información nueva del proyecto AeroIngenia a esta landing.
