(function () {
  'use strict';
  var P = 'assets/img/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var two = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var enc = function (f) { return P + encodeURIComponent(f).replace(/%2F/g, '/'); };

  /* ---------- header / voltar ao topo ---------- */
  var hdr = $('#hdr'), burger = $('#burger'), toTop = $('#toTop');
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('scrolled', y > 40);
    toTop.hidden = !(y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    hdr.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', function () { setMenu(!hdr.classList.contains('menu-open')); });
  $('#mnav').addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 980) setMenu(false); });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- contadores ---------- */
  var nf = new Intl.NumberFormat('pt-BR');
  var counters = document.querySelectorAll('[data-count]');
  function runCount() {
    var t0 = performance.now(), d = 1800;
    (function step(t) {
      var p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3);
      counters.forEach(function (el) {
        el.innerHTML = (el.dataset.pre || '') + nf.format(Math.round(+el.dataset.count * e)) + (el.dataset.suf ? '<small>' + el.dataset.suf + '</small>' : '');
      });
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(function (el) { el.innerHTML = (el.dataset.pre || '') + nf.format(+el.dataset.count) + (el.dataset.suf ? '<small>' + el.dataset.suf + '</small>' : ''); });
  } else { setTimeout(runCount, 300); }

  /* ---------- lightbox / vídeo ---------- */
  var lb = $('#lbModal'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  function openLb(src, alt) { lbImg.src = src; lbImg.alt = alt; lbCap.textContent = alt; lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; }
  lb.addEventListener('click', closeLb);

  var vm = $('#vModal'), vp = $('#vPlayer');
  function openVideo(src) { vp.src = src; vm.hidden = false; document.body.style.overflow = 'hidden'; var pr = vp.play(); if (pr && pr.catch) pr.catch(function () {}); }
  function closeVideo() { vp.pause(); vp.removeAttribute('src'); vp.load(); vm.hidden = true; document.body.style.overflow = ''; }
  vm.addEventListener('click', function (e) { if (e.target === vm || e.target.closest('.x')) closeVideo(); });
  document.querySelectorAll('[data-video]').forEach(function (b) {
    b.addEventListener('click', function () { openVideo(b.dataset.video); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!lb.hidden) closeLb();
    if (!vm.hidden) closeVideo();
  });

  /* ---------- diferenciais ---------- */
  var diffs = [
    { title: 'Sistema de gestão completo', icon: 'Sistema de gestao completo todo branco.png', fa: 'fa-chart-line', cols: 2, fit: 'contain', ratio: '4/3',
      imgs: [['Gesta.jpg', 'Cronograma de obra — Sistema de gestão'], ['Gesta2.jpg', 'Relatório financeiro da obra — Sistema de gestão'], ['Gesta3.jpg', 'Relatório complementar — Sistema de gestão'], ['Gesta4.jpg', 'Centro de custos e gráficos — Sistema de gestão']] },
    { title: 'Diário de obras (fotos e relatórios)', icon: 'Diario de obra todo branco.png', fa: 'fa-book-open', cols: 2, fit: 'contain', ratio: '3/4',
      imgs: [['diario1.jpg', 'Registros de obra - conversas e fotos'], ['diario2.png', 'Registros de obra - diário fotográfico']] },
    { title: 'Equipe presente em campo', icon: 'Equipe presente em campo engenharia  todo branco.png', fa: 'fa-helmet-safety', cols: 3, fit: 'cover', ratio: '1/1',
      imgs: [1, 2, 3, 4, 5, 6].map(function (i) { return ['equipe' + i + '.jpg', 'Equipe Bomman em obra - registro ' + i]; }) },
    { title: 'Qualidade na entrega', icon: 'Qualidade e controle por etapa todo branco.png', fa: 'fa-award', cols: 2, fit: 'cover', ratio: '4/3',
      imgs: [1, 2, 3, 4, 5, 6].map(function (i) { return ['qualidade' + i + '.jpg', 'Trabalho entregue - registro ' + i]; }) }
  ];
  var L = ['A', 'B', 'C', 'D'], cur = 0;
  var list = $('#difList'), grid = $('#difGrid');
  list.innerHTML = diffs.map(function (d, i) {
    return '<button class="dif-btn" role="tab" data-i="' + i + '"><span class="l">' + L[i] + '</span>' +
      '<span class="ic"><i class="fa-solid ' + d.fa + '"></i><img src="' + enc(d.icon) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></span>' +
      '<span class="t">' + esc(d.title) + '</span><i class="fa-solid fa-arrow-right ar"></i></button>';
  }).join('');
  function renderDiff() {
    var d = diffs[cur], narrow = window.innerWidth < 980;
    list.querySelectorAll('.dif-btn').forEach(function (b, i) { b.classList.toggle('on', i === cur); b.setAttribute('aria-selected', i === cur); });
    $('#difTitle').textContent = L[cur] + ' — ' + d.title;
    $('#difCount').textContent = two(d.imgs.length) + ' registros';
    grid.style.gridTemplateColumns = 'repeat(' + (narrow ? Math.min(2, d.cols) : d.cols) + ',minmax(0,1fr))';
    grid.innerHTML = d.imgs.map(function (m, i) {
      return '<figure><div class="dif-ph" style="aspect-ratio:' + d.ratio + '" data-src="' + enc(m[0]) + '" data-alt="' + esc(m[1]) + '">' +
        '<img src="' + enc(m[0]) + '" alt="' + esc(m[1]) + '" loading="lazy" style="object-fit:' + d.fit + '" onerror="this.style.display=\'none\'"></div>' +
        '<figcaption><b>FIG. ' + two(i + 1) + '</b><span>' + esc(m[1]) + '</span></figcaption></figure>';
    }).join('');
  }
  list.addEventListener('click', function (e) { var b = e.target.closest('.dif-btn'); if (b) { cur = +b.dataset.i; renderDiff(); } });
  grid.addEventListener('click', function (e) { var f = e.target.closest('.dif-ph'); if (f) openLb(f.dataset.src, f.dataset.alt); });
  var lastNarrow = window.innerWidth < 980;
  window.addEventListener('resize', function () { var n = window.innerWidth < 980; if (n !== lastNarrow) { lastNarrow = n; renderDiff(); } });
  renderDiff();

  /* ---------- projetos ---------- */
  var pf = $('#pfTrack'), N = 10;
  pf.innerHTML = Array.from({ length: N }, function (_, i) {
    var f = 'projeto' + (i + 1) + '.jpg', alt = 'Projeto ' + two(i + 1);
    return '<figure class="proj"><div class="proj-img" data-src="' + P + f + '" data-alt="' + alt + '">' +
      '<div class="ph lt"><img src="' + P + f + '" alt="' + alt + '" loading="lazy" onerror="this.style.display=\'none\'"></div><span class="brk on-light" style="--i:8px"></span></div>' +
      '<figcaption><span>' + alt + '</span><span>FIG. ' + two(i + 1) + '</span></figcaption></figure>';
  }).join('');
  pf.addEventListener('click', function (e) { var f = e.target.closest('.proj-img'); if (f) openLb(f.dataset.src, f.dataset.alt); });

  var scale = $('#pfScale');
  scale.innerHTML = Array.from({ length: N }, function (_, i) { return '<button aria-label="Projeto ' + two(i + 1) + '" data-i="' + i + '"></button>'; }).join('');
  var pfCur = 0;
  function pfUpdate() {
    var max = pf.scrollWidth - pf.clientWidth, i = max > 0 ? Math.round(pf.scrollLeft / max * (N - 1)) : 0;
    pfCur = i;
    $('#pfCount').textContent = two(i + 1) + ' / ' + N;
    scale.querySelectorAll('button').forEach(function (b, k) { b.classList.toggle('on', k <= i); });
  }
  pf.addEventListener('scroll', pfUpdate, { passive: true });
  scale.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    pf.scrollTo({ left: (pf.scrollWidth - pf.clientWidth) * (+b.dataset.i) / (N - 1), behavior: 'smooth' });
  });
  function slide(el, dir) { el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' }); }
  $('#pfPrev').addEventListener('click', function () { slide(pf, -1); });
  $('#pfNext').addEventListener('click', function () { slide(pf, 1); });
  window.addEventListener('resize', pfUpdate);
  pfUpdate();

  /* ---------- depoimentos ---------- */
  var clients = [['cliente1.png', 1], ['cliente2.jpeg', 2], ['cliente4.png', 4], ['cliente5.png', 5], ['cliente3.jpeg', 3]];
  $('#clTrack').innerHTML = clients.map(function (c, i) {
    return '<figure class="cli"><div class="phone"><div class="phone-s"><div class="ph lt"><img src="' + P + c[0] + '" alt="Depoimento Cliente ' + c[1] + '" loading="lazy" onerror="this.style.display=\'none\'"></div><span class="notch"></span></div></div>' +
      '<div class="ruler"><i></i><b></b><i></i></div>' +
      '<figcaption><span>Depoimento Cliente ' + c[1] + '</span><span>FIG. ' + two(i + 1) + '</span></figcaption></figure>';
  }).join('');
  /* prints "largos" (texto de depoimento) não podem ser cortados pelo celular: mostra inteiros e centralizados */
  document.querySelectorAll('#clTrack .ph img').forEach(function (img) {
    function fit() { if (img.naturalWidth && img.naturalWidth / img.naturalHeight > 0.6) img.parentNode.classList.add('fit'); }
    if (img.complete) fit(); else img.addEventListener('load', fit);
  });

  /* ---------- entrada animada: Por que / Serviços ---------- */
  (function () {
    var els = document.querySelectorAll('.pq-card, .sv-card');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    document.querySelectorAll('.pq-grid, .sv-grid').forEach(function (g) {
      g.querySelectorAll('.pq-card, .sv-card').forEach(function (e, i) { e.style.setProperty('--delay', (i * 90) + 'ms'); });
    });
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    els.forEach(function (e) { io.observe(e); });
  })();
})();
