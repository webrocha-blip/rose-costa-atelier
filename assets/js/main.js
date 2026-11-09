/* Rose Costa Atelier — interações */
(function () {
  var WA = '5521977837000';
  var waLink = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };

  // menu mobile
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });
  }

  // revelar ao rolar
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  } else { els.forEach(function (e) { e.classList.add('in'); }); }

  // popups
  var lastFocus = null;
  function openModal(id) {
    var m = document.getElementById(id); if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open'); document.body.style.overflow = 'hidden';
    var f = m.querySelector('input,select,textarea,button'); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeModal(m) {
    m.classList.remove('open'); document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var pre = b.getAttribute('data-service');
      if (pre) { var s = document.querySelector('#orcamento select[name=servico]'); if (s) s.value = pre; }
      openModal(b.getAttribute('data-open'));
    });
  });
  document.querySelectorAll('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.modal-close')) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) {
    var m = document.querySelector('.modal.open'); if (!m) return;
    if (e.key === 'Escape') closeModal(m);
    if (m.id === 'lightbox') { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }
  });

  // formulário de orçamento -> WhatsApp
  document.querySelectorAll('form[data-wa]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var linhas = ['Olá, Rose! Vim pelo site e gostaria de um orçamento.'];
      if (d.get('nome')) linhas.push('*Nome:* ' + d.get('nome'));
      if (d.get('servico')) linhas.push('*Serviço:* ' + d.get('servico'));
      if (d.get('peca')) linhas.push('*Peça:* ' + d.get('peca'));
      if (d.get('prazo')) linhas.push('*Para quando:* ' + d.get('prazo'));
      if (d.get('detalhes')) linhas.push('*Detalhes:* ' + d.get('detalhes'));
      linhas.push('Vou enviar uma foto da peça aqui na conversa. 📸');
      window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
    });
  });

  // antes / depois
  document.querySelectorAll('.compare').forEach(function (c) {
    var r = c.querySelector('input');
    var set = function (v) { c.style.setProperty('--pos', v + '%'); };
    r.addEventListener('input', function () { set(r.value); });
    set(r.value);
  });

  // galeria + lightbox
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));
  var lb = document.getElementById('lightbox');
  var idx = 0;
  function visibleTiles() { return tiles.filter(function (t) { return t.style.display !== 'none'; }); }
  function show(i) {
    var list = visibleTiles(); if (!list.length) return;
    idx = (i + list.length) % list.length;
    var t = list[idx];
    lb.querySelector('img').src = t.getAttribute('data-full') || t.querySelector('img').src;
    lb.querySelector('img').alt = t.querySelector('img').alt;
    lb.querySelector('.lb-title').textContent = t.getAttribute('data-title');
    lb.querySelector('.lb-desc').textContent = t.getAttribute('data-desc') || '';
    lb.querySelector('.lb-wa').href = waLink('Olá, Rose! Vi no site o trabalho "' + t.getAttribute('data-title') + '" e quero algo parecido. Pode me passar um orçamento?');
  }
  function step(d) { show(idx + d); }
  if (lb) {
    tiles.forEach(function (t) {
      t.addEventListener('click', function () { show(visibleTiles().indexOf(t)); openModal('lightbox'); });
    });
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  }

  // filtros
  document.querySelectorAll('.chip').forEach(function (ch) {
    ch.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
      ch.classList.add('on');
      var f = ch.getAttribute('data-filter');
      tiles.forEach(function (t) { t.style.display = (f === 'todos' || (t.getAttribute('data-cat') || '').indexOf(f) > -1) ? '' : 'none'; });
    });
  });

  // balão do WhatsApp
  var bubble = document.querySelector('.wa-bubble');
  if (bubble) {
    setTimeout(function () { bubble.classList.add('show'); }, 4000);
    setTimeout(function () { bubble.classList.remove('show'); }, 12000);
  }

  // ano no rodapé
  var y = document.getElementById('ano'); if (y) y.textContent = new Date().getFullYear();
})();
