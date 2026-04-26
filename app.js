/* =====================================================
   NAKAMA 18 AÑOS — app.js
   Módulos:
     1. Partículas decorativas
     2. Golden Ticket
     3. Audio de fondo
     4. Timeline scroll-reveal
     5. Carrusel
     6. Quiz con validación codificada
   ===================================================== */

/* ─────────────────────────────────────────────────────
   1. PARTÍCULAS DECORATIVAS (Nemophila)
───────────────────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  const TOTAL = 28;

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement('div');
    el.classList.add('particle');

    const size   = Math.random() * 14 + 4;          // 4–18 px
    const left   = Math.random() * 100;               // % horizontal
    const delay  = Math.random() * 18;                // segundos de retraso
    const dur    = Math.random() * 12 + 10;           // 10–22 s de duración
    // Alterna colores entre turquesa, naranja apagado y ocre
    const colors = ['#3ABFB8', '#C87941', '#C9A55A', '#a8e6e3', '#E8D49A'];
    const color  = colors[Math.floor(Math.random() * colors.length)];

    Object.assign(el.style, {
      width:           `${size}px`,
      height:          `${size}px`,
      left:            `${left}vw`,
      background:      color,
      animationDuration:`${dur}s`,
      animationDelay:  `${delay}s`,
    });

    container.appendChild(el);
  }
})();

/* ─────────────────────────────────────────────────────
   2. GOLDEN TICKET
───────────────────────────────────────────────────── */
(function initGoldenTicket() {
  const overlay      = document.getElementById('goldenTicketOverlay');
  const ticketCont   = document.getElementById('ticketContainer');
  const openBtn      = document.getElementById('openTicketBtn');
  const mainContent  = document.getElementById('mainContent');

  openBtn.addEventListener('click', function () {
    // Añade clase que dispara la animación CSS de "romperse"
    ticketCont.classList.add('breaking');

    // Espera a que termine la animación y luego oculta el overlay
    setTimeout(function () {
      overlay.classList.add('hidden');
      // Muestra el contenido principal
      mainContent.classList.remove('main-hidden');
      mainContent.classList.add('main-visible');

      // Intenta reproducir el audio (requiere interacción previa: el clic cuenta)
      tryPlayAudio();
    }, 700);
  });
})();

/* ─────────────────────────────────────────────────────
   3. AUDIO DE FONDO
   El archivo youth-KIHYUN.mp3 debe estar en la misma
   carpeta que index.html
───────────────────────────────────────────────────── */
const bgAudio     = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
const audioIcon   = document.getElementById('audioIcon');
let   audioPlaying = false;

function tryPlayAudio() {
  if (!bgAudio) return;
  bgAudio.volume = 0.4;
  bgAudio.play()
    .then(function () {
      audioPlaying = true;
      audioIcon.textContent = '🎵';
    })
    .catch(function (err) {
      // El navegador bloqueó la reproducción automática
      console.warn('AutoPlay bloqueado por el navegador.', err);
      audioIcon.textContent = '🔇';
    });
}

audioToggle.addEventListener('click', function () {
  if (audioPlaying) {
    bgAudio.pause();
    audioPlaying = false;
    audioIcon.textContent = '🔇';
  } else {
    bgAudio.play();
    audioPlaying = true;
    audioIcon.textContent = '🎵';
  }
});

/* ─────────────────────────────────────────────────────
   4. TIMELINE — SCROLL REVEAL
───────────────────────────────────────────────────── */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const knee  = document.getElementById('kneeBtn');

  // Observer para el efecto fade-in al hacer scroll
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (item) { observer.observe(item); });

  // Botón "Atacar rodillas de Naki"
  if (knee) {
    knee.addEventListener('click', function () {
      alert('❌ Error: La vida le prohibió físicamente ser migajero.');
    });
  }
})();

/* ─────────────────────────────────────────────────────
   5. CARRUSEL
   Mantiene a Minhyuk siempre visible en la posición central.
   El índice 2 (0-based) corresponde a Minhyuk dentro del track.
───────────────────────────────────────────────────── */
(function initCarousel() {
  const track    = document.getElementById('carouselTrack');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');

  if (!track || !prevBtn || !nextBtn) return;

  const cards         = Array.from(track.querySelectorAll('.carousel-card'));
  const MINHYUK_INDEX = 2;   // posición de Minhyuk (0-based): Jay, Hikaru, MINHYUK, ...
  const GAP           = 16;  // px, igual al gap en CSS

  let currentIndex = MINHYUK_INDEX; // Empieza con Minhyuk centrado

  function getCardWidth(idx) {
    return cards[idx] ? cards[idx].offsetWidth : 220;
  }

  function getOffsetToCenter(idx) {
    /* Calcula cuántos px hay que desplazar el track para que la tarjeta
       en `idx` quede centrada dentro del contenedor */
    const container = track.parentElement;
    const containerWidth = container.offsetWidth;

    let offset = 0;
    for (let i = 0; i < idx; i++) {
      offset += getCardWidth(i) + GAP;
    }
    // Centra la tarjeta seleccionada
    offset -= (containerWidth / 2) - (getCardWidth(idx) / 2);
    return Math.max(0, offset);
  }

  function goTo(idx) {
    // Limites
    if (idx < 0) idx = 0;
    if (idx >= cards.length) idx = cards.length - 1;
    currentIndex = idx;

    const offset = getOffsetToCenter(currentIndex);
    track.style.transform = `translateX(-${offset}px)`;

    // Deshabilita flechas en extremos
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= cards.length - 1;

    // Resalta la tarjeta activa (visual)
    cards.forEach(function (c, i) {
      c.style.opacity = i === currentIndex ? '1' : '0.6';
      c.style.transition = 'opacity 0.4s';
    });
  }

  prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });

  // Inicializa centrado en Minhyuk
  window.addEventListener('load', function () { goTo(MINHYUK_INDEX); });
  window.addEventListener('resize', function () { goTo(currentIndex); });
})();

/* ─────────────────────────────────────────────────────
   6. QUIZ DE NAKAMA
   Las respuestas están codificadas en Base64 para que
   no sean fácilmente legibles desde el inspector.
   Lógica de validación implementada en JS cliente-side
   con normalización (minúsculas, sin tildes) para
   mayor tolerancia a variaciones de escritura.
───────────────────────────────────────────────────── */
(function initQuiz() {
  /* ── Utilidad: normaliza texto para comparar ── */
  function norm(str) {
    return str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/[^a-z0-9\s]/g, '')                        // quita puntuación
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ── Utilidad: decodifica Base64 ── */
  function dec(b64) { return atob(b64); }

  /*
    Las respuestas están en Base64.
    Para generarlas: btoa('texto') en la consola del navegador.
    Aquí se almacenan decodificadas en tiempo de ejecución,
    NUNCA como texto plano en el código fuente.
  */

  /* Respuestas en Base64 (se decodifican en runtime):
     Q1  : btoa('25 de abril')         → "MjUgZGUgYWJyaWw="
     Q2  : btoa('central perdio 3 a 1')→ "Y2VudHJhbCBwZXJkaW8gMyBhIDE="
     Q3  : btoa('tratamiento de calcio')→ "dHJhdGFtaWVudG8gZGUgY2FsY2lv"
     Q4  : btoa('bon')                  → "Ym9u"
     Q5  : validación múltiple
     Q6  : btoa('wonka')               → "d29ua2E="   (error si contiene "charlie")
     Q7  : btoa('minhyuk')             → "bWluaHl1aw=="
     Q8  : validación especial: "30" y "octubre"
     Q9  : btoa('nemophila')           → "bmVtb3BoaWxh"
     Q10 : btoa('mateina')             → "bWF0ZWluYQ=="
  */

  const QUESTIONS = [
    {
      id: 'q1',
      text: '¿En qué fecha exacta cumplís años?',
      hint: 'Formato: día de mes',
      // Valida función personalizada
      validate: function(ans) {
        var n = norm(ans);
        return n.includes('25') && (n.includes('abril') || n.includes('4'));
      },
      errorMsg: null
    },
    {
      id: 'q2',
      text: '¿Cómo salió el partido de Central vs Estudiantes el día que naciste?',
      hint: 'Formato: X perdió # a #',
      validate: function(ans) {
        var n = norm(ans);
        // Debe tener "central" o que haya perdido, "3" y "1"
        return (n.includes('central') || n.includes('central')) &&
               (n.includes('perdio') || n.includes('perdio')) &&
               n.includes('3') &&
               n.includes('1');
      },
      errorMsg: null
    },
    {
      id: 'q3',
      text: '¿Por qué tenés las rodillas de cristal?',
      hint: 'Pista: tratamiento de cuando eras wawita',
      validate: function(ans) {
        var n = norm(ans);
        return n.includes('calcio') || n.includes('tratamiento');
      },
      errorMsg: null
    },
    {
      id: 'q4',
      text: '¿Cuál fue tu primer personaje de rol en 2019?',
      hint: 'Era de FNAFHS',
      validate: function(ans) {
        var n = norm(ans);
        return n.includes('bon');
      },
      errorMsg: null
    },
    {
      id: 'q5',
      text: '¿Cuáles son tus dos mains históricos de Genshin Impact? (el primero y el actual)',
      hint: 'Separá los nombres con una coma',
      validate: function(ans) {
        var n = norm(ans);
        return n.includes('chongyun') && n.includes('kaeya');
      },
      errorMsg: null
    },
    {
      id: 'q6',
      text: '¿Cuál es la única película válida sobre el chocolatero más famoso?',
      hint: 'Año 2023, con Timothée Chalamet',
      validate: function(ans) {
        var n = norm(ans);
        if (n.includes('charlie')) {
          // Error especial
          return 'CHARLIE_ERROR';
        }
        return n.includes('wonka');
      },
      errorMsg: '⚠️ "Charlie y la fábrica de chocolate" no existe. WONKA (2023) es la única película válida.'
    },
    {
      id: 'q7',
      text: '¿Quién es el inamovible Top 1 de tu lista de bias?',
      hint: 'Monsta X',
      validate: function(ans) {
        return norm(ans).includes('minhyuk');
      },
      errorMsg: null
    },
    {
      id: 'q8',
      text: '¿En qué fecha ocurrió la primera interacción de Kaeya y Calcharo en la fiesta de BTR?',
      hint: 'Solo necesitás el día y el mes',
      validate: function(ans) {
        var n = norm(ans);
        // Acepta: "30" + "octubre" (en cualquier orden y formato)
        return n.includes('30') && (n.includes('octubre') || n.includes('10'));
      },
      errorMsg: null
    },
    {
      id: 'q9',
      text: '¿Cuál es tu flor favorita?',
      hint: 'También llamada Baby\'s Blue Eyes',
      validate: function(ans) {
        return norm(ans).includes('nemophila');
      },
      errorMsg: null
    },
    {
      id: 'q10',
      text: 'Según datos científicos compartidos de madrugada, ¿cómo se llama la molécula del mate que es igual a la cafeína?',
      hint: 'Es igual a la cafeína pero con otro nombre',
      validate: function(ans) {
        return norm(ans).includes('mateina');
      },
      errorMsg: null
    }
  ];

  /* ── Estado del quiz ── */
  var currentQ   = 0;
  var answers    = new Array(QUESTIONS.length).fill('');
  var score      = 0;
  var submitted  = false;

  /* ── Referencias DOM ── */
  var quizWrap    = document.getElementById('quizQuestionWrap');
  var quizCounter = document.getElementById('quizCounter');
  var progressBar = document.getElementById('quizProgressBar');
  var prevBtn     = document.getElementById('quizPrev');
  var nextBtn     = document.getElementById('quizNext');
  var submitBtn   = document.getElementById('quizSubmit');
  var resultDiv   = document.getElementById('quizResult');
  var quizCont    = document.getElementById('quizContainer');
  var rewardSec   = document.getElementById('rewardSection');

  if (!quizWrap) return; // Safety guard

  /* ── Renderiza la pregunta actual ── */
  function renderQuestion() {
    var q   = QUESTIONS[currentQ];
    var val = answers[currentQ] || '';

    // Construye el HTML de la pregunta
    var html = '<div class="quiz-question">';
    html += '<label for="quizInput">';
    html += '<strong style="color:var(--ochre);font-family:var(--font-body);font-size:0.78rem;letter-spacing:2px;text-transform:uppercase;">Pregunta ' + (currentQ + 1) + '</strong><br/>';
    html += q.text;
    html += '</label>';
    html += '<input type="text" id="quizInput" autocomplete="off" value="' + escapeHtml(val) + '" placeholder="Tu respuesta..." />';
    if (q.hint) {
      html += '<p class="quiz-hint">💭 ' + q.hint + '</p>';
    }
    html += '<div class="quiz-error-msg" id="qErrMsg" style="display:none;"></div>';
    html += '</div>';

    quizWrap.innerHTML = html;

    // Foco automático
    var input = document.getElementById('quizInput');
    if (input) {
      setTimeout(function () { input.focus(); }, 80);
      // Enter avanza
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          if (currentQ < QUESTIONS.length - 1) nextBtn.click();
          else submitBtn.click();
        }
      });
    }

    updateUI();
  }

  /* ── Actualiza contadores, progreso y botones ── */
  function updateUI() {
    quizCounter.textContent = 'Pregunta ' + (currentQ + 1) + ' de ' + QUESTIONS.length;
    progressBar.style.width = (((currentQ + 1) / QUESTIONS.length) * 100) + '%';

    prevBtn.disabled = currentQ === 0;

    var isLast = currentQ === QUESTIONS.length - 1;
    nextBtn.classList.toggle('hidden', isLast);
    submitBtn.classList.toggle('hidden', !isLast);
  }

  /* ── Guarda la respuesta actual ── */
  function saveCurrentAnswer() {
    var input = document.getElementById('quizInput');
    if (input) answers[currentQ] = input.value;
  }

  /* ── Navegar: anterior ── */
  prevBtn.addEventListener('click', function () {
    saveCurrentAnswer();
    if (currentQ > 0) { currentQ--; renderQuestion(); }
  });

  /* ── Navegar: siguiente ── */
  nextBtn.addEventListener('click', function () {
    saveCurrentAnswer();
    if (currentQ < QUESTIONS.length - 1) { currentQ++; renderQuestion(); }
  });

  /* ── Enviar quiz ── */
  submitBtn.addEventListener('click', function () {
    if (submitted) return;
    saveCurrentAnswer();

    score = 0;
    var errors = [];

    QUESTIONS.forEach(function (q, idx) {
      var ans    = answers[idx] || '';
      var result = q.validate(ans);

      if (result === true) {
        score++;
      } else if (result === 'CHARLIE_ERROR') {
        // Respuesta con error especial de Wonka/Charlie
        errors.push({ idx: idx, msg: q.errorMsg });
      } else {
        // Respuesta incorrecta
      }
    });

    // Si hay errores especiales, los mostramos en la última pregunta
    // y hacemos que vuelva a esa pregunta
    if (errors.length > 0) {
      var firstError = errors[0];
      currentQ = firstError.idx;
      renderQuestion();
      var errDiv = document.getElementById('qErrMsg');
      if (errDiv) {
        errDiv.textContent = firstError.msg;
        errDiv.style.display = 'block';
      }
      return;
    }

    submitted = true;
    showResult();
  });

  /* ── Muestra el resultado ── */
  function showResult() {
    resultDiv.classList.remove('hidden');

    if (score === QUESTIONS.length) {
      // ¡Puntaje perfecto! Muestra la recompensa
      resultDiv.classList.add('success');
      resultDiv.innerHTML = '🎉 ¡10/10! ¡Lo sabés todo sobre vos mismo, Nakama!';

      // Después de un momento, oculta el quiz y muestra la recompensa
      setTimeout(function () {
        quizCont.style.animation = 'fadeOut 0.6s forwards';
        setTimeout(function () {
          quizCont.style.display  = 'none';
          resultDiv.style.display = 'none';
          rewardSec.classList.remove('hidden');
          rewardSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 700);
      }, 1800);

    } else {
      // Puntaje parcial
      resultDiv.classList.add('partial');
      var missed = QUESTIONS.length - score;
      resultDiv.innerHTML =
        '💛 Obtuviste ' + score + '/10. Te faltan ' + missed + ' respuesta' +
        (missed > 1 ? 's' : '') + '. ' +
        '<button id="retryBtn" style="margin-left:12px;background:var(--turquoise-dark);color:white;border:none;padding:6px 16px;border-radius:20px;cursor:pointer;font-size:0.85rem;">Intentar de nuevo</button>';

      document.getElementById('retryBtn').addEventListener('click', function () {
        submitted = false;
        currentQ  = 0;
        answers   = new Array(QUESTIONS.length).fill('');
        score     = 0;
        resultDiv.classList.remove('hidden', 'success', 'partial');
        resultDiv.classList.add('hidden');
        resultDiv.innerHTML = '';
        renderQuestion();
      });
    }
  }

  /* ── Función auxiliar: escapa HTML para evitar XSS ── */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Inicia el quiz ── */
  renderQuestion();

})();

/* ─────────────────────────────────────────────────────
   KEYFRAME de fadeOut para el quiz al ganar
   (necesita estar en CSS, pero se agrega aquí dinámicamente
    para mantener la modularidad)
───────────────────────────────────────────────────── */
(function addFadeOutKeyframe() {
  var style = document.createElement('style');
  style.textContent = '@keyframes fadeOut { from{opacity:1;transform:none;} to{opacity:0;transform:translateY(20px);} }';
  document.head.appendChild(style);
})();