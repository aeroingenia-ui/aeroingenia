# Operación del XAG P30 — paso a paso de campo

> **Fuente:** `Proceso de operatividad XAG P30.pdf` (Tecmundo Tech), reordenado como
> secuencia ejecutable. Las specs cruzadas salen de `guia p30 dron.pdf` (manual oficial).
>
> Los bloques marcados **[NO ESTÁ EN EL DOCUMENTO]** los agregué yo: son vacíos del
> checklist original que en terreno te pueden costar caro. Están separados a propósito
> para que sepas qué es de Tecmundo y qué es agregado.

---

# FASE 0 — Antes del día **[NO ESTÁ EN EL DOCUMENTO]**

El checklist de Tecmundo arranca el día del vuelo. En Chile hay pasos previos obligatorios:

- [ ] **Aviso a la autoridad sanitaria con 2 días hábiles de anticipación** (D.S. 5/2010, Art. 8). No es un servicio de urgencia.
- [ ] **Aviso a apicultores** de la zona (Ley 21.489)
- [ ] **Verificar la etiqueta del producto**: ¿autoriza aplicación aérea? ¿Cuál es el volumen mínimo de agua? Si la etiqueta pide 100 L/ha, no podés aplicar a 15
- [ ] **Recomendación técnica escrita** del asesor del cliente: producto, dosis y volumen
- [ ] **Revisar franja de resguardo de 200 m** respecto de casas, escuelas, esteros y fuentes de agua (Art. 2)
- [ ] **Pronóstico de viento**: el límite **legal** es 15 km/h = **4,17 m/s**, no los 10 m/s que aguanta el equipo
- [ ] Baterías cargadas: dron, ACS2 y bastón de antena RTK

---

# FASE 1 — Montaje de equipos

1. Confirmar baterías cargadas: **dron**, **ACS2** y **bastón de antena RTK**
2. Posicionar el **trípode topográfico a nivel**, con su bastón y antena
3. **Encender el bastón**
4. **Encender el ACS2**
5. Conectar el smartphone al ACS2 por Wi-Fi

> La clave del Wi-Fi del ACS2 está en la página 1 del PDF de operatividad.
> No la escribo acá porque este repositorio es público.

---

# FASE 2 — Inspección visual

Seis puntos, de arriba hacia abajo:

- [ ] **Hélices** sin daños
- [ ] **Tornillos de hélices** ajustados, sin juego
- [ ] **Brazos de fibra de carbono** sin fracturas ni irregularidades
- [ ] **Ajuste de brazos**: nada suelto ni con movimiento
- [ ] **Cabina/capot** ajustada y sin movimiento
- [ ] **Tren de aterrizaje** ajustado y sin movimiento

### Agregado **[NO ESTÁ EN EL DOCUMENTO]**

- [ ] **Boquillas**: las 4 limpias y sin obstrucción. Son rotativas de atomización; una tapada te desbalancea la aplicación y no te vas a dar cuenta en vuelo
- [ ] **Mangueras peristálticas** sin fisuras ni aplastamiento
- [ ] **Estanque y tapa** sin fugas

---

# FASE 3 — Puesta en marcha: enlace RTK

1. Activar el **Wi-Fi del smartphone**
2. Conectar al **ACS2** con su clave
3. Abrir la app **XAG AGRI**
4. **Enlazar la antena RTK** al Wi-Fi del smartphone
   - Primer enlace: en el menú **DEVICES**, abajo dice **ADD DEVICES**
   - Mantener apretado el botón **F2** hasta el **BIP**
   - Si no enlaza, repetir el procedimiento
5. Abrir **DEVICES** y revisar dispositivos conectados
   - **Íconos con color = conectados**
6. Tocar el ícono de la antena → **Setting**
7. **Setting datum → Low precision**
8. Esperar a que **Mode** cambie de **Single** a **Fix**
   - **Hasta 2 minutos.** No sigas hasta ver **Fix**: sin eso perdés la precisión de ±10 cm que es la razón de usar este equipo

---

# FASE 4 — Mapeo del campo

1. Abrir **FIELD**
2. Tocar el símbolo **+**
3. Seleccionar **SURVEY**
4. Escribir el **nombre del mapa** y el **tipo** (standard / spot / custom) → **OK**
   - Se abre automáticamente la imagen del lugar
5. **Verificar que los 3 íconos superiores izquierdos estén en verde**
6. **Marcar los puntos del perímetro** del área a mapear
7. Si hace falta, agregar **puntos de apoyo** para despegue o aterrizaje
8. Usar **"Punto marker"** para definir distintos lugares de aterrizaje
9. ⚠️ **Marcar todo obstáculo dentro del plan de vuelo como OBSTACLE**
   - Árbol, poste, tendido eléctrico, silo, antena
   - El documento lo dice en mayúsculas: es para no arriesgar el dron y asegurar vuelo seguro
10. Tocar **un lado del perímetro** (líneas blancas)
    - Se generan automáticamente las **rutas de vuelo / grilla**
11. Subir el mapa a la nube: **3 puntos → UPLOAD**

---

# FASE 5 — Crear y vincular la tarea

1. Abrir **OPERATION**
2. Tocar arriba el **nombre del campo mapeado** → se abre el menú de **tasks**
3. Abajo: **New task**
4. Se abre **CREATE TASK** → escribir la información y **confirmar**
5. Tocar la tarea recién creada → se sube a la nube (**loading**)
6. Abajo aparece el campo recién mapeado
7. Tocar los **3 puntos** → **+ ADD**
8. Seleccionar el campo a vincular → **CONFIRM** (queda subido a la nube)
9. Se abre el menú del campo con la tarea vinculada → **CONFIRM**
10. Seleccionar el mapa con la tarea vinculada

---

# FASE 6 — Chequeo pre-vuelo en la app

1. **Prender el dron**
2. Ir a **DEVICES** y confirmar que el dron esté conectado
3. Volver a **OPERATION** y tocar la **libreta verde de check-list**
4. Se abre el menú de sistemas del dron
5. **Revisar uno a uno los sistemas**, verificando los parámetros establecidos
6. Tocar la **flecha hacia abajo** arriba a la derecha
7. **Mantener presionado el nombre de usuario** hasta poder moverlo dentro del perímetro verde del campo

> El documento numera 4 y salta a 6 — no existe un paso 5. No falta contenido:
> es un error de numeración del original.

---

# FASE 7 — Parámetros de vuelo y aplicación

Seis parámetros a definir:

| # | Parámetro |
|---|---|
| 1 | Velocidad y **altura del START** |
| 2 | **Líneas de trabajo** |
| 3 | Velocidad y altura del **RETURN HOME** |
| 4 | **Velocidad de aplicación** |
| 5 | **Altura de aplicación** |
| 6 | **Dosis de aplicación y tamaño de gota** |

### Referencias del manual oficial **[NO ESTÁ EN EL DOCUMENTO]**

- **Tamaño de gota:** 90–300 μm. Bajo ~150 μm la gota es altamente derivable — cuidado si hay viñedo o huerto vecino
- **Ancho efectivo:** 2–6 m, según altura y litros por hectárea
- **Caudal máximo:** 5,6 L/min con las 4 bombas
- **Estanque:** 16 L → a 30 L/ha rinde **media hectárea por carga**
- **Velocidad máxima:** 12 m/s (no es velocidad de trabajo)

---

# FASE 8 — Inspección final y despegue

1. Abajo: **UPLOAD**
2. Se abre la ventana de inspección final (**inspect pass**)
3. **Marcar las dos casillas**, después de verificarlas de verdad:
   - [ ] Ninguna persona, animal u obstáculo **dentro de un radio de 10 metros**
   - [ ] Ninguna persona o animal **dentro del área de trabajo del dron**
4. **Deslizar la barra inferior**
5. Se carga el plan y el dron despega ejecutando la ruta y los parámetros definidos

---

# FASE 9 — Post vuelo

1. **Vaciar todo el líquido** del sistema de pulverización (**auto-check**)
2. **Revisión visual**: tornillos sueltos, estado de los brazos
3. **Revisar el tren de aterrizaje**
4. **Limpiar con agua limpia** toda parte sucia, con químico o polvo
   - Un dron limpio y seco en todos sus sistemas **aumenta su vida útil**
5. **Guardar baterías entre 40% y 50% de carga, a 20 °C**

### Agregado **[NO ESTÁ EN EL DOCUMENTO]**

- [ ] **Registrar la aplicación**: producto, N° de lote, fecha y hora, superficie, dosis, volumen, período de reingreso, quién decidió y quién ejecutó
  - Lo exige la Resolución SAG 243/2025 y es tu respaldo ante cualquier reclamo
- [ ] **Cronometrar**: minutos de vuelo por batería, minutos de recarga, minutos de cambio
  - Con eso recalibrás `tramites/rendimiento-real.awk` y dejás de estimar

---

# Vacíos del documento que tenés que cubrir aparte

El checklist de Tecmundo cubre bien **el equipo**. No cubre nada de esto:

| Vacío | Por qué importa |
|---|---|
| **Viento** | Ni lo menciona. El límite legal es 4,17 m/s; el equipo aguanta 10 m/s. Operar al límite del manual es ilegal en Chile |
| **Preparación de la mezcla** | Salta del montaje al vuelo. No dice orden de mezcla, calidad de agua ni agitación |
| **EPP** | Nada. Y el llenado del estanque es el momento de mayor exposición al producto de toda la jornada |
| **Emergencias** | No dice qué hacer ante pérdida de enlace, batería baja o ráfaga repentina |
| **Franja de resguardo** | No menciona los 200 m respecto de áreas sensibles |
| **Radar omnidireccional** | El manual dice que es **opcional** (estándar 0, opcional 4). Si tu unidad no lo trae, tenés evasión solo frontal — crítico en pendiente |

---

## Advertencia sobre la declaración de instrucción

La última página del PDF es una **declaración en blanco y sin firmar**:

> *"Declara que el Sr………… De Rut………… Con fecha…………"*

Como está, **no acredita nada**. Y aunque estuviera firmada, la instrucción del fabricante
**no equivale** a credencial de piloto RPAS de la DGAC ni a capacitación de aplicador ante
el SAG. Son tres cosas distintas, y las tres siguen pendientes en
`tramites/checklist-habilitaciones.md`.
