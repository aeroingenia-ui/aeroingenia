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
    '*Cultivo:*'
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
        function dibujar() {
          var ev = origen.videoWidth, eh = origen.videoHeight;
          var escala = Math.max(ANCHO / ev, ALTO / eh);
          var dw = ev * escala, dh = eh * escala;
          ctx.drawImage(origen, (ANCHO - dw) / 2, (ALTO - dh) / 2, dw, dh);

          var velo = ctx.createLinearGradient(0, ALTO * 0.5, 0, ALTO);
          velo.addColorStop(0, 'rgba(8,20,16,0)');
          velo.addColorStop(1, 'rgba(8,20,16,.93)');
          ctx.fillStyle = velo;
          ctx.fillRect(0, 0, ANCHO, ALTO);

          ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = '#e8b74a';
          ctx.font = '600 44px "Space Grotesk", sans-serif';
          ctx.fillText('AeroIngenia', 60, 110);

          ctx.fillStyle = '#ffffff';
          ctx.font = '700 62px "Space Grotesk", sans-serif';
          var lineasTitular = envolverTexto(ctx, 'Aplicamos donde no entra el tractor.', 60, ALTO - 430, ANCHO - 120, 72);

          ctx.fillStyle = '#d8a02a';
          ctx.font = '600 38px "Space Grotesk", sans-serif';
          ctx.fillText('Desde $18.000/ha · visita técnica sin costo', 60, ALTO - 430 + lineasTitular * 72 + 56);

          ctx.fillStyle = 'rgba(255,255,255,.85)';
          ctx.font = '500 32px Inter, sans-serif';
          ctx.fillText('WhatsApp +56 9 7424 0110 · @aeroingenia', 60, ALTO - 90);

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
          document.fonts.load('700 62px "Space Grotesk"'),
          document.fonts.load('600 44px "Space Grotesk"'),
          document.fonts.load('500 32px "Inter"')
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
