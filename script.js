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
})();
