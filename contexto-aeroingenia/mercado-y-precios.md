# Mercado y precios — aplicación con dron en Chile

> Resumen traído de `analisis-precio/analisis-precio-hectarea.md` y
> `analisis-precio/politica-de-precio.md` del proyecto AeroIngenia. Ahí está el detalle
> completo y las fuentes citadas una por una.

## El hallazgo principal: el mercado chileno no cobra por hectárea, cobra por litro

Los dos referentes de precio verificados usan el mismo modelo:

| Fuente | Modelo | Valor |
|---|---|---|
| Academia de Drones de Chile | Por litro aplicado | $1.200/L base · $1.320/L con ajuste de riesgo 10% |
| Agronexo | Por litro de mojamiento | Sin tarifa publicada; declara rango de 15–90 L/ha |
| Tecmundo (distribuidor XAG en Chile) | Banda por hectárea | **$15.000–$30.000/ha** |

La pregunta relevante no es "¿cuánto cobro por hectárea?" sino **"¿a cuántos litros por
hectárea aplico?"** — el mismo precio por hectárea puede estar caro o barato según el
mojamiento.

## Tabla de conversión (mojamiento → precio de mercado)

| Mojamiento | Precio de mercado equivalente (a $1.200–1.320/L) |
|---|---|
| 10 L/ha | $12.000 – $13.200 |
| 15 L/ha | $18.000 – $19.800 |
| 23–25 L/ha | $27.600 – $33.000 |
| 30 L/ha | $36.000 – $39.600 |

## Fórmula de precio recomendada (no un valor plano)

```
Precio por hectárea = $7.000 + $900 × (litros por hectárea)
```

El fijo de $7.000 cubre lo que cuesta igual sin importar el mojamiento (planificación,
RTK, reporte). El variable de $900/L cubre lo que sí escala (batería, tiempo de vuelo,
desgaste, agua). Con estanque de 16 L, aplicar a más litros por hectárea implica más
recargas y el doble de desgaste de batería entre 15 y 30 L/ha.

| Mojamiento | Precio resultante | Posición de mercado |
|---|---|---|
| 10 L/ha | $16.000 | Dentro de la banda |
| 15 L/ha | $20.500 | Dentro de la banda |
| 20 L/ha | $25.000 | Dentro de la banda |
| 25 L/ha | $29.500 | Techo de la banda |
| 30 L/ha | $34.000 | Dentro del rango ODEPA |

## ⚠️ Tensión sin resolver con el precio publicado en este sitio

El `README.md` de esta landing dice: *"Cotizaciones desde $18.000/ha"* — dato tomado de
`publicidad.jpg`, el aviso original.

El análisis de mercado dice otra cosa: **$18.000/ha solo tiene sentido citado junto al
mojamiento** (equivale a ~15 L/ha). Cotizado "desde $18.000/ha" sin esa aclaración:

- Es un precio válido y defendible **si se aplica a mojamiento bajo** (10–15 L/ha, que es
  además el punto de mayor eficiencia del estanque de 16 L del P30).
- Pero invita a la comparación directa contra un competidor reportado en **$12.000/ha
  aplicando a 30 L/ha** ($400/litro, un tercio de la referencia de mercado) — una
  comparación que AeroIngenia pierde si no se explicita el mojamiento, porque no son el
  mismo servicio.

**No cambié el precio del sitio** — es una decisión comercial, no técnica. La recomendación
del análisis original es cotizar siempre **"por hectárea a X litros"**, nunca por hectárea
a secas, para que el productor pueda comparar cotizaciones en la misma unidad. Si se
adopta, valdría la pena que el sitio muestre el mojamiento de referencia junto al precio.

## Por qué la zona no está desatendida (contexto para "Cobertura")

- Cerca de **50.000 ha** en Chile están incorporando drones, concentradas entre **Los
  Ángeles y Osorno** — exactamente el corredor que cubre este sitio.
- Ya existe competencia establecida con cobertura nacional (O'Higgins a Los Lagos). La
  ventaja no es "somos los únicos"; es el servicio documentado y trazable.

## Por qué los cultivos elegidos están bien apuntados

- Maule + Ñuble + Araucanía + Biobío concentran **~77% del arándano nacional**.
- El cerezo es el frutal de mayor crecimiento del país; fuerte presencia en Maule y Ñuble.
- Ambos son cultivos de alto valor por hectárea — sostienen un precio de aplicación más
  alto que trigo, avena o praderas, donde $30.000/ha probablemente no es competitivo frente
  al método terrestre.

## Riesgo regulatorio a considerar en cualquier pieza comercial

Operar cobrando por aplicación de plaguicidas con dron exige cumplir simultáneamente
marcos sanitario (Decreto 5 MINSAL), agrícola (SAG, Decreto 3.557 MINAGRI) y aeronáutico
(DGAC: DAN 151/91, AOC, credencial de piloto). El detalle operativo y el checklist de
seguimiento ya están en `../tramites/checklist-habilitaciones.md`.
