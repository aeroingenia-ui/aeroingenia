# Calculadora de rendimiento real — XAG P30
#
# Uso:  awk -f rendimiento-real.awk
#
# Recalibrá los parámetros de abajo con tus datos reales apenas tengas
# la primera jornada cronometrada. Los valores actuales son ESTIMACIONES.

BEGIN {
    # ---- Specs del equipo (manual XAG P30, verificadas) ----
    ESTANQUE  = 16.0    # L
    Q_MAX     = 5.6     # L/min, las 4 bombas juntas

    # ---- Parámetros a medir en terreno (HOY SON ESTIMACIONES) ----
    if (!T_VUELO) T_VUELO = 6.0; #    # min de vuelo útiles por batería degradada
                        # (nuevo a 38 kg = 10 min; menos 25% de reserva
                        #  y menos degradación → ~6)
    if (!T_RECARGA) T_RECARGA = 35.0; #   # min para cargar una batería en terreno
    if (!N_BAT) N_BAT = 4; #      # baterías en rotación
    T_CAMBIO  = 4.0     # min: aterrizar, cambiar batería, recargar estanque
    T_FERRY   = 1.0     # min de ida y vuelta al sector tratado

    printf "\n"
    printf "RENDIMIENTO REAL ESTIMADO — XAG P30 (estanque %.0f L, %d baterías)\n", ESTANQUE, N_BAT
    printf "Vuelo útil por batería: %.1f min | Recarga: %.0f min | Cambio: %.1f min\n", T_VUELO, T_RECARGA, T_CAMBIO
    printf "%s\n", sep(96)
    printf "%-26s %6s %5s %5s %7s %7s %8s %8s\n", \
           "Escenario", "L/ha", "w(m)", "v(m/s)", "ha/ciclo", "min/ciclo", "TECHO", "ha/h"
    printf "%s\n", sep(96)

    # nombre, L/ha, ancho m, velocidad m/s, cambio min, ferry min
    calc("Pradera, plano",        25, 5, 6, T_CAMBIO,     T_FERRY)
    calc("Trigo/avena, plano",    30, 5, 6, T_CAMBIO,     T_FERRY)
    calc("Trigo/avena, lomaje",   35, 4, 5, T_CAMBIO+1,   T_FERRY+0.5)
    calc("Vinedo espaldera",      20, 3, 4, T_CAMBIO+1,   T_FERRY)
    calc("Vinedo, volumen medio", 40, 3, 4, T_CAMBIO+1,   T_FERRY)
    calc("Forestal, pendiente",   40, 4, 5, T_CAMBIO+1.5, T_FERRY+0.5)

    printf "%s\n", sep(96)
    printf "TECHO = qué limita el ciclo: ESTANQUE (se vacía primero) o BATERIA (se acaba antes)\n"
    printf "        CARGA = el ritmo lo frena esperar baterías cargadas\n\n"
}

function sep(n,   s, i) { s = ""; for (i = 0; i < n; i++) s = s "-"; return s }

function calc(nombre, V, w, v, t_cambio, t_ferry,
              Q, v_real, t_estanque, t_spray, litros, ha_ciclo, t_ciclo,
              ciclos_dron, ciclos_bat, ciclos, techo, rate) {

    # Caudal necesario para lograr V L/ha a esa velocidad y ancho
    Q = V * w * v * 60 / 10000

    # Si excede la bomba, hay que volar más lento
    v_real = v
    if (Q > Q_MAX) {
        v_real = Q_MAX * 10000 / (V * w * 60)
        Q = Q_MAX
    }

    t_estanque = ESTANQUE / Q              # min hasta vaciar el estanque
    t_spray    = T_VUELO - t_ferry         # min de pulverización disponibles

    if (t_estanque <= t_spray) {
        t_spray = t_estanque
        techo = "ESTANQUE"
    } else {
        techo = "BATERIA"
    }

    litros   = t_spray * Q
    ha_ciclo = litros / V
    t_ciclo  = t_spray + t_ferry + t_cambio

    # Techo del dron: un ciclo tras otro sin esperar
    ciclos_dron = 60 / t_ciclo

    # Techo del pool de baterías: cada una vuelve tras volar + cargar
    ciclos_bat = N_BAT * 60 / (t_spray + t_ferry + T_RECARGA)

    if (ciclos_bat < ciclos_dron) { ciclos = ciclos_bat; techo = "CARGA" }
    else                          { ciclos = ciclos_dron }

    rate = ha_ciclo * ciclos

    printf "%-26s %6.0f %5.1f %5.1f %7.2f %7.1f %10s %7.1f\n", \
           nombre, V, w, v_real, ha_ciclo, t_ciclo, techo, rate
}
