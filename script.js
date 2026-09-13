/* ============================================
   AeroIngenia — Interacciones de la landing
   ============================================ */
(function () {
  'use strict';

  /* Datos de contacto en un solo lugar */
  var WSP = '56974240110';

  /* Plantilla para quien entra directo al chat sin pasar por el formulario.
     Lleva las mismas preguntas que el formulario, para que la persona las
     complete en WhatsApp y no haya que pedirle los datos de a uno.
     Los asteriscos los renderiza WhatsApp como negrita. */
  var MENSAJE_BASE = [
    'Hola AeroIngenia 👋 Quiero cotizar una aplicación con dron.',
    '',
    '*Nombre:*',
    '*Comuna del predio:*',
    '*Servicio:* (fumigación / siembra aérea / ambos)',
    '*Superficie aproximada:*',
    '*Cultivo:*',
    '*Producto a aplicar:* (si ya lo tienes definido)'
  ].join('\n');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function linkWsp(texto) {
    return 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);
  }

  /* ------------------------------------------
     1. Barra de lanzamiento (se puede cerrar)
  ------------------------------------------ */
  var promo = document.getElementById('promo');
  var promoClose = document.getElementById('promoClose');

  try {
    if (localStorage.getItem('aeroingenia:promo') === 'cerrada') promo.classList.add('is-hidden');
  } catch (e) { /* navegación privada: se muestra igual */ }

  promoClose.addEventListener('click', function () {
    promo.classList.add('is-hidden');
    try { localStorage.setItem('aeroingenia:promo', 'cerrada'); } catch (e) {}
  });

  /* ------------------------------------------
     2. Navegación
  ------------------------------------------ */
  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');

  function cerrarMenu() {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }

  navToggle.addEventListener('click', function () {
    var abierto = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', abierto);
    navToggle.setAttribute('aria-expanded', String(abierto));
    navToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) cerrarMenu();
  });

  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-stuck', window.scrollY > 12);
  }, { passive: true });

  // Resaltar la sección visible
  var enlacesInternos = Array.prototype.slice.call(navLinks.querySelectorAll('a[href^="#"]:not(.btn)'));
  var secciones = enlacesInternos
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && secciones.length) {
    var spy = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlacesInternos.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entrada.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------
     3. Botones que abren WhatsApp directo
        (el href a #contacto queda como respaldo
         si el navegador no ejecuta JS)
  ------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-wsp]'), function (a) {
    a.href = linkWsp(MENSAJE_BASE);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ------------------------------------------
     3b. Video de fondo del hero
         Se descarga solo si vale la pena: no en
         conexiones lentas, no con ahorro de datos
         activado, no si pidieron menos animación.
         En esos casos queda el poster, que ya se
         ve sin descargar nada extra.
  ------------------------------------------ */
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    // Solo miramos saveData: es una preferencia explícita y estable.
    // effectiveType NO sirve acá — durante la carga inicial Chrome todavía
    // no tiene muestras y devuelve "2g" aunque la conexión sea buena, así
    // que descartaba el video en conexiones perfectamente capaces.
    var ahorroDatos = (navigator.connection || {}).saveData === true;

    if (!reduceMotion && !ahorroDatos) {
      heroVideo.src = heroVideo.dataset.src;
      // La promesa se rechaza si la pestaña está en segundo plano o si el
      // navegador pausa el video de fondo para ahorrar batería. En esos
      // casos queda el poster, que es exactamente lo que corresponde.
      var intento = heroVideo.play();
      if (intento && intento.catch) intento.catch(function () {});
    }
  }

  /* ------------------------------------------
     4. Aparición de bloques al entrar en pantalla
  ------------------------------------------ */
  var bloques = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(bloques, function (el) { el.classList.add('is-visible'); });
  } else {
    var aparicion = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var hermanos = Array.prototype.slice.call(entrada.target.parentElement.children);
        var indice = hermanos.indexOf(entrada.target);
        entrada.target.style.transitionDelay = Math.min(indice, 6) * 80 + 'ms';
        entrada.target.classList.add('is-visible');
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    Array.prototype.forEach.call(bloques, function (el) { aparicion.observe(el); });
  }

  /* ------------------------------------------
     5. Contadores animados
  ------------------------------------------ */
  function animarContador(el) {
    var destino = parseFloat(el.dataset.count);
    var sufijo = el.dataset.suffix || '';
    var duracion = 1400;

    if (reduceMotion) { el.textContent = destino + sufijo; return; }

    var inicio = null;
    function paso(t) {
      if (inicio === null) inicio = t;
      var avance = Math.min((t - inicio) / duracion, 1);
      var suave = 1 - Math.pow(1 - avance, 3);
      el.textContent = Math.round(destino * suave) + sufijo;
      if (avance < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  var contadores = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var obsContadores = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        animarContador(entrada.target);
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(contadores, function (el) { obsContadores.observe(el); });
  } else {
    Array.prototype.forEach.call(contadores, animarContador);
  }

  /* ------------------------------------------
     6. Grilla de vuelo del hero
        Pasadas paralelas alternadas, como las
        que genera la app XAG sobre el potrero.
  ------------------------------------------ */
  var swath = document.getElementById('swath');
  if (swath) {
    var PASADAS = 11;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < PASADAS; i++) {
      var linea = document.createElement('span');
      linea.className = 'swath__line';
      linea.style.setProperty('--i', i);
      frag.appendChild(linea);
    }
    swath.appendChild(frag);
  }

  /* ------------------------------------------
     7. Formulario: valida y arma el mensaje
        de WhatsApp ya redactado
  ------------------------------------------ */
  var form = document.getElementById('contactForm');
  var exito = document.getElementById('formSuccess');

  var MENSAJES = {
    nombre: 'Cuéntanos tu nombre.',
    comuna: 'Indícanos la comuna del predio.',
    servicio: 'Elige el servicio que necesitas.',
    superficie: 'Elige un rango de superficie.'
  };

  function contenedorDe(campo) { return campo.closest('.field'); }

  function validarCampo(campo) {
    var caja = contenedorDe(campo);
    if (!caja) return true;
    var salida = caja.querySelector('.field__error');
    var valido = campo.checkValidity();
    caja.classList.toggle('is-invalid', !valido);
    if (salida) salida.textContent = valido ? '' : (MENSAJES[campo.name] || 'Revisa este dato.');
    return valido;
  }

  function armarMensaje(d) {
    var lineas = [
      'Hola AeroIngenia 👋',
      '',
      'Soy ' + d.nombre + ', de ' + d.comuna + '.',
      'Servicio: ' + d.servicio,
      'Superficie aproximada: ' + d.superficie
    ];
    if (d.mensaje && d.mensaje.trim()) lineas.push('', d.mensaje.trim());
    lineas.push('', 'Quedo atento a la cotización. ¡Gracias!');
    return lineas.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var campos = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    var primerError = null;
    campos.forEach(function (campo) {
      if (!validarCampo(campo) && !primerError) primerError = campo;
    });

    if (primerError) { primerError.focus(); exito.hidden = true; return; }

    var datos = {};
    new FormData(form).forEach(function (valor, clave) { datos[clave] = valor; });

    var ventana = window.open(linkWsp(armarMensaje(datos)), '_blank', 'noopener');
    exito.hidden = false;

    // Si el navegador bloqueó la pestaña, el mensaje de respaldo
    // ya trae el número para escribir a mano.
    if (!ventana) exito.textContent =
      'Tu navegador bloqueó la ventana de WhatsApp. Escríbenos directo al +56 9 7424 0110.';
  });

  form.addEventListener('input', function (e) {
    var caja = contenedorDe(e.target);
    if (caja && caja.classList.contains('is-invalid')) validarCampo(e.target);
  });
  form.addEventListener('change', function (e) {
    var caja = contenedorDe(e.target);
    if (caja && caja.classList.contains('is-invalid')) validarCampo(e.target);
  });

  /* ------------------------------------------
     8. Año dinámico en el pie
  ------------------------------------------ */
  var copy = document.querySelector('.footer__bottom p');
  if (copy) copy.textContent = '© ' + new Date().getFullYear() + ' AeroIngenia. Todos los derechos reservados.';

  /* ------------------------------------------
     9. Compartir (nav)
  ------------------------------------------ */
  var shareRoot = document.getElementById('navShare');
  if (shareRoot) {
    var shareBtn = document.getElementById('navShareBtn');
    var shareMenu = document.getElementById('navShareMenu');
    var shareText = 'AeroIngenia — fumigación y siembra de precisión con drones en Ñuble y Biobío. Cotizaciones desde $18.000/ha.';

    var shareUrl = function () { return window.location.href; };
    var shareOpenPopup = function (url) { window.open(url, '_blank', 'noopener,noreferrer,width=640,height=640'); };
    var shareCloseMenu = function () { shareMenu.hidden = true; shareBtn.setAttribute('aria-expanded', 'false'); };
    var shareOpenMenu = function () { shareMenu.hidden = false; shareBtn.setAttribute('aria-expanded', 'true'); };

    shareBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (shareMenu.hidden) shareOpenMenu(); else shareCloseMenu();
    });
    document.addEventListener('click', function (e) { if (!shareRoot.contains(e.target)) shareCloseMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shareCloseMenu(); });

    // Copia texto al portapapeles y muestra feedback inline en el propio item.
    // Instagram no tiene una URL de "compartir" pública como las demás redes
    // (no acepta un link con texto precargado), así que la forma honesta de
    // resolverlo es copiar el enlace y llevar a la persona a la app para que
    // lo pegue ella misma en su historia o publicación.
    var shareCopyText = function (texto, item, opts) {
      opts = opts || {};
      var label = item.querySelector('.nav__share-copy-label');
      var revert = opts.revert || 'Copiar enlace';
      var listo = function (ok) {
        if (label) label.textContent = ok ? (opts.done || '¡Enlace copiado!') : 'No se pudo copiar';
        setTimeout(function () { if (label) label.textContent = revert; shareCloseMenu(); }, opts.holdMs || 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(function () { listo(true); }, function () { listo(false); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = texto;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        listo(ok);
      }
    };

    // Instagram no acepta un link precargado: lo único que puede recibir
    // desde afuera es un archivo (imagen o video) que el celular entrega
    // a la app para publicar en Historia, Reel o Feed. Armamos ese video
    // al vuelo: se dibuja cada cuadro del propio video del hero en un
    // <canvas> vertical 1080×1920, con el logo, el titular y el precio
    // superpuestos, y se graba con MediaRecorder. Si el navegador no
    // soporta compartir archivos (la mayoría de los de escritorio) o algo
    // falla en el camino, cae al respaldo: copia el texto y abre el perfil.
    //
    // OJO con navigator.share(): los navegadores solo lo permiten dentro
    // del mismo gesto del usuario (un clic), y grabar el video tarda varios
    // segundos — para cuando el video está listo, ese gesto ya expiró y
    // share() sería rechazado en silencio. Por eso son dos toques: el
    // primero prepara el archivo, el segundo (ya con el archivo listo)
    // dispara el share() de forma síncrona dentro de ese nuevo clic.
    var instagramListo = null; // File ya grabado, esperando el segundo toque
    var instagramPreparando = false;

    var shareInstagramFallback = function (item) {
      instagramListo = null;
      instagramPreparando = false;
      shareOpenPopup('https://instagram.com/aeroingenia');
      shareCopyText(shareText + ' ' + shareUrl(), item, { revert: 'Instagram', done: '¡Copiado! Pégalo en tu historia', holdMs: 2400 });
    };

    var puedeCompartirArchivos = function () {
      if (!(navigator.canShare && navigator.share && window.MediaRecorder && window.File)) return false;
      if (typeof HTMLCanvasElement.prototype.captureStream !== 'function') return false;
      try { return navigator.canShare({ files: [new File(['x'], 'x.txt', { type: 'text/plain' })] }); }
      catch (e) { return false; }
    };

    function envolverTexto(ctx, texto, x, y, anchoMax, alto) {
      var palabras = texto.split(' ');
      var linea = '';
      var lineas = [];
      for (var n = 0; n < palabras.length; n++) {
        var prueba = linea + palabras[n] + ' ';
        if (ctx.measureText(prueba).width > anchoMax && n > 0) { lineas.push(linea.trim()); linea = palabras[n] + ' '; }
        else linea = prueba;
      }
      lineas.push(linea.trim());
      lineas.forEach(function (l, i) { ctx.fillText(l, x, y + i * alto); });
      return lineas.length;
    }

    // Las siguientes funciones recrean a mano, sobre el <canvas>, la
    // portada real del sitio (pastilla, titular, botón, tarjeta del
    // equipo con su grilla animada) para el video que se comparte a
    // Instagram — no es una captura de pantalla (ver comentario más
    // arriba sobre por qué eso no es viable en celular), sino el mismo
    // diseño y las mismas animaciones, redibujadas cuadro a cuadro.
    function trazarRectRedondeado(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    // Pastilla superior con el punto que titila — misma cadencia que
    // @keyframes latido en styles.css (2.4 s, con un aro que crece y
    // se desvanece en el primer 70% del ciclo).
    function dibujarPill(ctx, x, y, texto, t) {
      ctx.font = '500 30px Inter, sans-serif';
      var padX = 28, dotR = 7, gap = 16, h = 62;
      var w = padX * 2 + dotR * 2 + gap + ctx.measureText(texto).width;

      ctx.fillStyle = 'rgba(216,160,42,.14)';
      trazarRectRedondeado(ctx, x, y, w, h, h / 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(216,160,42,.4)';
      ctx.lineWidth = 2;
      trazarRectRedondeado(ctx, x, y, w, h, h / 2);
      ctx.stroke();

      var cx = x + padX + dotR, cy = y + h / 2;
      var ciclo = (t % 2400) / 2400;
      var anillo = Math.min(ciclo / 0.7, 1);
      ctx.beginPath();
      ctx.arc(cx, cy, dotR + anillo * 11, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(216,160,42,' + (0.55 * (1 - anillo)).toFixed(3) + ')';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = '#d8a02a';
      ctx.fill();

      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#e8b74a';
      ctx.fillText(texto, x + padX * 2 + dotR * 2, cy + 1);
      ctx.textBaseline = 'alphabetic';
      return h;
    }

    function dibujarBotonWsp(ctx, x, y, texto) {
      ctx.font = '600 34px "Space Grotesk", sans-serif';
      var padX = 40, h = 92;
      var w = padX * 2 + ctx.measureText(texto).width;

      ctx.fillStyle = '#25d366';
      trazarRectRedondeado(ctx, x, y, w, h, h / 2);
      ctx.fill();

      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#04331a';
      ctx.fillText(texto, x + padX, y + h / 2 + 1);
      ctx.textBaseline = 'alphabetic';
      return h;
    }

    // La grilla de vuelo: 11 pasadas paralelas que aparecen una tras
    // otra y se desvanecen, igual que @keyframes pasada en styles.css
    // (5,4 s por línea, retraso escalonado de .26 s, alternando el
    // lado desde el que "crecen" — la misma sensación de tejido).
    function dibujarSwath(ctx, x, y, w, h, t) {
      var n = 11, gap = 6;
      var altoLinea = (h - gap * (n - 1)) / n;
      var duracion = 5400, retraso = 260;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      var fondo = ctx.createRadialGradient(x + w * 0.3, y + h * 0.2, 0, x + w * 0.3, y + h * 0.2, w);
      fondo.addColorStop(0, '#1e4a2e');
      fondo.addColorStop(1, '#12301f');
      ctx.fillStyle = fondo;
      ctx.fillRect(x, y, w, h);

      for (var i = 0; i < n; i++) {
        var local = t - i * retraso;
        if (local < 0) continue;
        var ciclo = (local % duracion) / duracion;
        var progreso, opacidad;
        if (ciclo < 0.04) { progreso = 0; opacidad = 0.9; }
        else if (ciclo < 0.42) { progreso = (ciclo - 0.04) / 0.38; opacidad = 0.9; }
        else if (ciclo < 0.82) { progreso = 1; opacidad = 0.9 - (ciclo - 0.42) * 0.25; }
        else { progreso = 1; opacidad = Math.max(0, 0.8 * (1 - (ciclo - 0.82) / 0.18)); }

        var ly = y + i * (altoLinea + gap);
        var anchoBarra = w * progreso;
        var lx = (i % 2 === 1) ? x + w - anchoBarra : x;
        if (anchoBarra < 1) continue;

        var g = ctx.createLinearGradient(lx, 0, lx + anchoBarra, 0);
        g.addColorStop(0, 'rgba(139,195,74,' + opacidad.toFixed(3) + ')');
        g.addColorStop(1, 'rgba(216,160,42,' + (opacidad * 0.7).toFixed(3) + ')');
        ctx.fillStyle = g;
        ctx.fillRect(lx, ly, anchoBarra, altoLinea);
      }
      ctx.restore();
    }

    var shareInstagramVideo = function (item) {
      instagramPreparando = true;
      var label = item.querySelector('.nav__share-copy-label');
      if (label) label.textContent = 'Preparando video…';

      var ANCHO = 1080, ALTO = 1920;
      var origen = document.createElement('video');
      origen.src = 'hero-dron.mp4';
      origen.muted = true;
      origen.playsInline = true;
      origen.crossOrigin = 'anonymous';

      var seCanceloTodo = false;
      var cancelar = function () { seCanceloTodo = true; shareInstagramFallback(item); };
      origen.addEventListener('error', cancelar);

      origen.addEventListener('loadedmetadata', function () {
        if (seCanceloTodo) return;
        var duracionMs = Math.min(origen.duration || 8, 12) * 1000;

        var canvas = document.createElement('canvas');
        canvas.width = ANCHO; canvas.height = ALTO;
        var ctx = canvas.getContext('2d');

        var stream = canvas.captureStream(30);
        var mime = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm';
        var grabadora;
        try { grabadora = new MediaRecorder(stream, { mimeType: mime }); }
        catch (e) { cancelar(); return; }

        var partes = [];
        grabadora.ondataavailable = function (e) { if (e.data && e.data.size) partes.push(e.data); };

        grabadora.onstop = function () {
          instagramPreparando = false;
          if (seCanceloTodo || !partes.length) { if (!seCanceloTodo) cancelar(); return; }
          var blob = new Blob(partes, { type: mime.split(';')[0] });
          var archivo = new File([blob], 'aeroingenia.webm', { type: blob.type });
          if (!navigator.canShare({ files: [archivo] })) { cancelar(); return; }
          // No llamamos a share() acá: ya no estamos dentro del clic del
          // usuario. Dejamos el archivo listo y esperamos que toque de nuevo.
          instagramListo = archivo;
          if (label) label.textContent = 'Toca para compartir';
        };

        var raf = null;
        var tInicio = null;
        var MX = 64;
        var CW = ANCHO - MX * 2;

        function dibujar(marca) {
          if (tInicio === null) tInicio = marca || performance.now();
          var t = (marca || performance.now()) - tInicio;

          var ev = origen.videoWidth, eh = origen.videoHeight;
          var escala = Math.max(ANCHO / ev, ALTO / eh);
          var dw = ev * escala, dh = eh * escala;
          ctx.drawImage(origen, (ANCHO - dw) / 2, (ALTO - dh) / 2, dw, dh);

          var velo = ctx.createLinearGradient(0, 0, 0, ALTO);
          velo.addColorStop(0, 'rgba(13,33,23,.55)');
          velo.addColorStop(0.45, 'rgba(13,33,23,.74)');
          velo.addColorStop(1, 'rgba(8,20,16,.96)');
          ctx.fillStyle = velo;
          ctx.fillRect(0, 0, ANCHO, ALTO);

          ctx.textBaseline = 'alphabetic';
          var y = 160;

          ctx.font = '600 44px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#e8b74a';
          ctx.fillText('AeroIngenia', MX, y);
          y += 96;

          y += dibujarPill(ctx, MX, y, 'Fumigación y siembra con drones', t) + 56;

          ctx.font = '700 72px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Aplicamos donde', MX, y);
          y += 86;
          var texto2 = 'no entra el tractor.';
          var gradTitular = ctx.createLinearGradient(MX, 0, MX + ctx.measureText(texto2).width, 0);
          gradTitular.addColorStop(0, '#d8a02a');
          gradTitular.addColorStop(1, '#8bc34a');
          ctx.fillStyle = gradTitular;
          ctx.fillText(texto2, MX, y);
          y += 68;

          ctx.font = '400 34px Inter, sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,.82)';
          var nLineas = envolverTexto(ctx, 'Fumigación y siembra de precisión con dron XAG P30, sin pisar una sola planta.', MX, y, CW, 46);
          y += nLineas * 46 + 48;

          y += dibujarBotonWsp(ctx, MX, y, 'Cotizar por WhatsApp') + 64;

          // Tarjeta del equipo, igual que .spec-card en el hero real.
          // El alto del panel se calcula a partir de su propio contenido
          // (no se estira hasta el borde inferior) para no dejar una
          // franja vacía dentro del recuadro.
          var panelY = y, padPanel = 40;
          var py = panelY + padPanel;
          var yTitulo = py + 66;
          var yGrilla = yTitulo + 30, altoGrilla = 220;
          var yStats = yGrilla + altoGrilla + 60;
          var panelBottom = yStats + 34 + padPanel;
          var panelH = panelBottom - panelY;

          ctx.fillStyle = 'rgba(255,255,255,.07)';
          trazarRectRedondeado(ctx, MX, panelY, CW, panelH, 28);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,.16)';
          ctx.lineWidth = 2;
          trazarRectRedondeado(ctx, MX, panelY, CW, panelH, 28);
          ctx.stroke();

          ctx.font = '400 24px Inter, sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,.5)';
          ctx.fillText('EQUIPO OPERATIVO', MX + padPanel, py + 22);

          ctx.font = '600 36px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Dron agrícola XAG P30', MX + padPanel, yTitulo);

          dibujarSwath(ctx, MX + padPanel, yGrilla, CW - padPanel * 2, altoGrilla, t);

          var colW = (CW - padPanel * 2) / 3;
          [['6 m', 'ancho de pasada'], ['±10 cm', 'precisión RTK'], ['16 L', 'estanque']].forEach(function (s, i) {
            var sx = MX + padPanel + i * colW;
            ctx.font = '700 40px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#e8b74a';
            ctx.fillText(s[0], sx, yStats);
            ctx.font = '400 24px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,.55)';
            ctx.fillText(s[1], sx, yStats + 34);
          });

          ctx.font = '500 30px Inter, sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,.85)';
          ctx.fillText('WhatsApp +56 9 7424 0110 · @aeroingenia', MX, Math.min(panelBottom + 76, ALTO - 48));

          if (!origen.paused && !origen.ended) raf = requestAnimationFrame(dibujar);
        }

        origen.addEventListener('play', function () {
          try { grabadora.start(); } catch (e) { cancelar(); return; }
          dibujar();
        }, { once: true });

        var terminar = function () {
          if (raf) cancelAnimationFrame(raf);
          if (grabadora.state === 'recording') grabadora.stop();
        };
        origen.addEventListener('ended', terminar, { once: true });
        setTimeout(function () { origen.pause(); terminar(); }, duracionMs + 300);

        // Cargar las tipografías antes de dibujar el primer cuadro, si no
        // el canvas usa la fuente de sistema en vez de la marca.
        var fuentes = [
          document.fonts.load('700 72px "Space Grotesk"'),
          document.fonts.load('600 44px "Space Grotesk"'),
          document.fonts.load('400 34px "Inter"'),
          document.fonts.load('500 30px "Inter"')
        ];
        Promise.all(fuentes).catch(function () {}).then(function () {
          if (seCanceloTodo) return;
          origen.play().catch(cancelar);
        });
      }, { once: true });
    };

    shareMenu.addEventListener('click', function (e) {
      var item = e.target.closest('[data-share]');
      if (!item) return;
      var url = shareUrl();
      switch (item.getAttribute('data-share')) {
        case 'whatsapp': shareOpenPopup('https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + url)); shareCloseMenu(); break;
        case 'linkedin': shareOpenPopup('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url)); shareCloseMenu(); break;
        case 'facebook': shareOpenPopup('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)); shareCloseMenu(); break;
        case 'x': shareOpenPopup('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(url)); shareCloseMenu(); break;
        case 'telegram': shareOpenPopup('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(shareText)); shareCloseMenu(); break;
        case 'instagram':
          if (instagramListo) {
            // Segundo toque: recién acá hay gesto fresco del usuario, es
            // el único momento en que el navegador deja llamar a share().
            var archivoListo = instagramListo;
            instagramListo = null;
            shareCloseMenu();
            navigator.share({ files: [archivoListo], title: 'AeroIngenia', text: shareText }).catch(function () {});
          } else if (instagramPreparando) {
            break; // ya está grabando, un segundo clic mientras tanto no hace nada
          } else if (puedeCompartirArchivos()) {
            shareInstagramVideo(item);
          } else {
            shareInstagramFallback(item);
          }
          break;
        case 'copy': shareCopyText(url, item, { revert: 'Copiar enlace' }); break;
      }
    });

    if (navigator.share) {
      var sysItem = document.createElement('button');
      sysItem.type = 'button';
      sysItem.className = 'nav__share-item';
      sysItem.setAttribute('role', 'menuitem');
      sysItem.innerHTML = '<span class="nav__share-badge">›</span> Más opciones del sistema';
      sysItem.addEventListener('click', function () {
        shareCloseMenu();
        navigator.share({ title: document.title || 'AeroIngenia', text: shareText, url: shareUrl() }).catch(function () {});
      });
      shareMenu.insertBefore(sysItem, shareMenu.firstChild);
    }
  }
})();
