$(document).ready(function(){
  $('.slick-carousel').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    dots: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  });
});

// ======= Mobile nav =======
{
  const nav = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  if (nav && hamburger) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
}

// ======= Scrollspy + progress bar =======
const spyLinks = [...document.querySelectorAll('.nav-links a')];
const secs = spyLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const progress = document.getElementById('progress');
function onScroll(){
  const y = window.scrollY + 120;
  let cur=null; secs.forEach(s=>{ if(s.offsetTop<=y) cur = s.id; });
  spyLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href').slice(1)===cur));
  const h = document.body.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = Math.min(100, (window.scrollY / h) * 100) + '%';
}
document.addEventListener('scroll', onScroll); onScroll();

// ======= Reveal on scroll =======
const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ======= Back to top =======
const topBtn=document.getElementById('topBtn');
if (topBtn) {
  const toggleTop=()=>{ if(window.scrollY>600) topBtn.classList.add('show'); else topBtn.classList.remove('show'); };
  document.addEventListener('scroll', toggleTop); toggleTop();
  topBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
}


// ======= Counters =======
(function(){
  const counters = Array.from(document.querySelectorAll('.count'));
  if(!counters.length) return;

  const formatters = {
    br: new Intl.NumberFormat('pt-BR'),
    en: new Intl.NumberFormat('en-US')
  };

  function animate(el){
    const target   = Number(el.dataset.target || 0);
    const duration = Number(el.dataset.duration || 1600);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const fmtKey   = el.dataset.format || '';
    const fmt      = formatters[fmtKey] || null;

    const start = performance.now();
    const from  = 0;

    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(from + (target - from) * eased);
      el.textContent = prefix + (fmt ? fmt.format(val) : String(val)) + suffix;
      if(t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        animate(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .6 });

  counters.forEach(c => obs.observe(c));
})();
// ======= Portfolio carousel (legacy/manual) =======
// The production page uses Slick now. Keep this code guarded so it doesn't break the rest of the JS.
{
  const track=document.getElementById('carTrack');
  const dotsWrap=document.getElementById('carDots');
  const prev=document.querySelector('.prev');
  const next=document.querySelector('.next');
  if (track && dotsWrap && prev && next) {
    const slides=[...track.children];
    let idx=0;
    slides.forEach((_,i)=>{const b=document.createElement('button'); if(i===0)b.classList.add('active'); dotsWrap.appendChild(b);});
    const dots=[...dotsWrap.children];
    function goTo(i){ idx=(i+slides.length)%slides.length; track.style.transform=`translateX(-${idx*100}%)`; dots.forEach((d,di)=>d.classList.toggle('active',di===idx)); }
    prev.addEventListener('click',()=>goTo(idx-1));
    next.addEventListener('click',()=>goTo(idx+1));
    dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
    setInterval(()=>goTo(idx+1),7000);
  }
}

// Lightbox
{
  const lb=document.getElementById('lightbox');
  if (lb) {
    const lbImg=lb.querySelector('img');
    const lbClose=lb.querySelector('.lb-close');
    document.querySelectorAll('.lb').forEach(img=>img.addEventListener('click',()=>{
      if (!lbImg) return;
      lbImg.src=img.dataset.large||img.src;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden','false');
    }));
    function closeLb(){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      if (lbImg) lbImg.src='';
    }
    if (lbClose) lbClose.addEventListener('click',closeLb);
    lb.addEventListener('click',e=>{ if(e.target===lb) closeLb(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLb(); });
  }
}

// ======= Testimonials carousel (legacy/manual) =======
// The production page uses Slick for testimonials. Keep guarded to avoid breaking other features.
{
  const tTrack=document.getElementById('tTrack');
  const tDotsWrap=document.getElementById('tDots');
  if (tTrack && tDotsWrap) {
    const tItems=[...tTrack.children]; let ti=0;
    tItems.forEach((_,i)=>{const d=document.createElement('button');d.className='dot'+(i===0?' active':''); tDotsWrap.appendChild(d);});
    const tDots=[...tDotsWrap.children];
    function tGo(i){ ti=(i+tItems.length)%tItems.length; tTrack.style.transform=`translateX(-${ti*100}%)`; tDots.forEach((d,di)=>d.classList.toggle('active',di===ti)); }
    tDots.forEach((d,i)=>d.addEventListener('click',()=>tGo(i)));
    setInterval(()=>tGo(ti+1),7000);
  }
}

// ======= Form (validação + mailto) =======
const form=document.getElementById('form'), status=document.getElementById('status');
if (form && status) form.addEventListener('submit',e=>{
  e.preventDefault();
  const nome=document.getElementById('nome').value.trim();
  const email=document.getElementById('email').value.trim();
  const msg=document.getElementById('msg').value.trim();
  if(nome.length<3){status.textContent='Informe seu nome completo.';return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){status.textContent='Informe um e-mail válido.';return;}
  if(msg.length<10){status.textContent='Conte melhor sua necessidade.';return;}
  status.textContent='Abrindo seu cliente de e-mail...';
  const subject=encodeURIComponent(`Contato do site - ${nome}`);
  const body=encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\n${msg}`);
  window.location.href=`mailto:contato@bomman.com.br?subject=${subject}&body=${body}`;
  setTimeout(()=>status.textContent='',4000); form.reset();
});

document.addEventListener("DOMContentLoaded", function(){
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if(hamburger && nav){
    hamburger.addEventListener('click', ()=>{
      nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
    });
  }
});

$(document).ready(function(){
  $('.slick-carousel').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    arrows: true,
    dots: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  });
});

$(document).ready(function(){
    $(".ha-slick-carousel").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      pauseOnFocus: true,
      infinite: true,
      arrows: true,
      dots: true,
      prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 }},
        { breakpoint: 600,  settings: { slidesToShow: 1 }}
      ]
    });
  });

document.querySelectorAll('.acc-header').forEach(head=>{
  head.addEventListener('click',()=>{
    const open = head.classList.toggle('active');
    const content = head.nextElementSibling;
    if(open){content.style.maxHeight = content.scrollHeight + 'px'; content.style.paddingTop='10px';}
    else {content.style.maxHeight = null; content.style.paddingTop='0';}
  });
});

$(document).ready(function(){
  $('.portfolio-slick').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,
    infinite: true,
    centerMode: true,
    centerPadding: '40px',
    arrows: true,
    dots: true,
    prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2, centerPadding:'30px' } },
      { breakpoint: 760,  settings: { slidesToShow: 1, centerPadding:'20px' } }
    ]
  });

  // Lightbox para o portfólio (reutilizando o já existente)
  $('.portfolio-slick img.lb').on('click', function(){
    const src = $(this).attr('src');
    const big = $(this).data('large') || src;
    const lb = document.getElementById('lightbox');
    lb.querySelector('img').src = big;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  });
});

// ===== Robust Lightbox Control (open/close) =====
(function(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const img = lb.querySelector('img');
  function openLB(src){
    if(!src) return;
    img.src = src;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLB(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    img.src = '';
    document.body.style.overflow = '';
  }
  // Close by clicking backdrop or any close-like element
  lb.addEventListener('click', function(e){
    const isBackdrop = e.target === lb;
    const wantsClose = !!(e.target.closest('.close, .lb-close, [data-lb-close], [data-action="close"], [aria-label="Fechar"], [aria-label="Close"], .lightbox-close'));
    if(isBackdrop || wantsClose){ closeLB(); }
  });
  // Close by ESC key
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeLB(); }
  });
  // Ensure all portfolio images open LB
  const selectors = '.portfolio-slick img.lb, .slider img.lb, .sa-slider img.lb, .showcase img.lb';
  document.querySelectorAll(selectors).forEach(function(el){
    el.addEventListener('click', function(){
      const big = el.getAttribute('data-large') || el.getAttribute('src');
      openLB(big);
    });
  });
})();

(function(){
  // Safety: only run when DOM is ready
  function initVideoControls(){
    const openBtn = document.getElementById('openVideo');
    const videobox = document.getElementById('videobox');
    const vbVideo = document.getElementById('vbVideo');
    const vbClose = document.querySelector('.vb-close');

    if(!openBtn || !videobox || !vbVideo) return;

    function openVideo(){
      // show modal and play
      videobox.classList.add('open');
      videobox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      // try to play; some browsers require user gesture (we have one)
      vbVideo.currentTime = 0;
      const p = vbVideo.play();
      if(p && typeof p.catch === 'function'){ p.catch(()=>{/* autoplay blocked? user already clicked, ignore */}); }
      vbVideo.focus();
    }

    function closeVideo(){
      videobox.classList.remove('open');
      videobox.setAttribute('aria-hidden','true');
      try{ vbVideo.pause(); vbVideo.currentTime = 0; }catch(e){/* ignore */}
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', function(e){
      e.preventDefault();
      openVideo();
    });

    if(vbClose) vbClose.addEventListener('click', function(e){ e.preventDefault(); closeVideo(); });

    // Close when clicking backdrop
    videobox.addEventListener('click', function(e){
      if(e.target === videobox) closeVideo();
    });

    // Close on ESC
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeVideo();
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVideoControls);
  else initVideoControls();
})();

// CTA scroll-in (hero only)
(function(){
  function init(){
    var hero = document.querySelector('.hero');
    var ctas = document.querySelector('.hero .ctas');
    if(!hero || !ctas) return;
    // Hide only after JS is ready (no-FOUC)
    ctas.classList.add('cta-hide');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          ctas.classList.add('cta-in');
          ctas.classList.remove('cta-hide');
          io.disconnect();
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    io.observe(hero);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// "Por que a Bomman?" — stagger + icon pop + mouse-follow glow
(function(){
  function initPQ(){
    var wrap = document.getElementById('pq-features');
    if(!wrap) return;
    var cards = Array.prototype.slice.call(wrap.querySelectorAll('.feature'));

    // Stagger when container enters viewport
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          cards.forEach(function(c, i){
            c.style.setProperty('--delay', (i*140)+'ms');
            c.classList.add('in');
          });
          io.disconnect();
        }
      });
    }, { threshold:.25 });
    io.observe(wrap);

    // Mouse-follow inner glow per card
    cards.forEach(function(card){
      card.addEventListener('mousemove', function(ev){
        var r = card.getBoundingClientRect();
        var mx = ((ev.clientX - r.left) / r.width) * 100;
        var my = ((ev.clientY - r.top)  / r.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
      });
      card.addEventListener('mouseleave', function(){
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPQ);
  else initPQ();
})();

// Nossos Serviços: alternate slide-in on scroll (scoped)
(function(){
  function initServicos(){
    var grid = document.querySelector('#servicos .grid');
    if(!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card'));
    if(!cards.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          cards.forEach(function(c,i){
            c.style.setProperty('--delay', (i*120)+'ms'); // stagger
            c.classList.add('in');
          });
          io.disconnect();
        }
      });
    }, { threshold: .22 });
    io.observe(grid);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initServicos);
  else initServicos();
})();

// Vídeo institucional: scroll-in from bottom (no blur, scoped)
(function(){
  function initVideoArrival(){
    var wrap = document.querySelector('#video .video-wrap');
    if(!wrap) return;
    // Hide only if JS is running (no FOUC)
    wrap.classList.add('video-hide');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          wrap.classList.add('video-in');
          wrap.classList.remove('video-hide');
          io.disconnect();
        }
      });
    }, { threshold: .22 });
    io.observe(wrap);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVideoArrival);
  else initVideoArrival();
})();

// Nossos diferenciais: scroll-in arrival (scoped)
(function(){
  function initDiffArrival(){
    var sec = document.getElementById('diferenciais');
    if(!sec) return;
    var items = Array.prototype.slice.call(sec.querySelectorAll('.diff-accordion .diff-item'));
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          // Stagger delays for items
          items.forEach(function(it, i){ it.style.setProperty('--delay', (i*110)+'ms'); });
          sec.classList.add('diff-in');
          io.disconnect();
        }
      });
    }, { threshold: .2 });
    io.observe(sec);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDiffArrival);
  else initDiffArrival();
})();

// Líder: scroll-in arrival (scoped)
(function(){
  function initLeaderArrival(){
    var leader = document.querySelector('#lider .leader');
    if(!leader) return;
    // Hide only if JS is running
    leader.classList.add('leader-hide');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          leader.classList.add('leader-in');
          leader.classList.remove('leader-hide');
          io.disconnect();
        }
      });
    }, { threshold: .2 });
    io.observe(leader);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLeaderArrival);
  else initLeaderArrival();
})();

// Fale Conosco: scroll-in arrival (scoped)
(function(){
  function initContatoArrival(){
    var sec = document.getElementById('contato');
    if(!sec) return;
    var header = sec.querySelector('.header-row');
    var grid   = sec.querySelector('.contact');
    if(header) header.classList.add('fc-hide');
    if(grid)   grid.classList.add('fc-hide');

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          if(header){ header.classList.add('fc-in'); header.classList.remove('fc-hide'); }
          if(grid){
            // Stagger for form vs tiles
            var form = grid.querySelector('.form');
            var tiles = Array.prototype.slice.call(grid.querySelectorAll('.aside .tile'));
            if(form) form.style.setProperty('--delay', '80ms');
            tiles.forEach(function(t,i){ t.style.setProperty('--delay', (160 + i*100) + 'ms'); });

            // Stagger inside the form (fields + button)
            var fields = Array.prototype.slice.call(grid.querySelectorAll('.form .field'));
            fields.forEach(function(f,i){ f.style.setProperty('--delay', (120 + i*80) + 'ms'); });
            var btn = grid.querySelector('.form .btn-send');
            if(btn) btn.style.setProperty('--delay', (120 + fields.length*80) + 'ms');

            grid.classList.add('fc-in');
            grid.classList.remove('fc-hide');
          }
          io.disconnect();
        }
      });
    }, { threshold: .18 });
    io.observe(sec);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initContatoArrival);
  else initContatoArrival();
})();

(function(){
  var hamburger = document.querySelector('.hamburger');
  var nav = document.querySelector('.nav-links');
  if(!hamburger || !nav) return;

  // Remove possíveis listeners antigos clonando o botão
  var hb = hamburger.cloneNode(true);
  hamburger.parentNode.replaceChild(hb, hamburger);
  hamburger = hb;

  function isMobile(){
    // cobre os dois breakpoints usados no CSS
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function openNav(){
    nav.classList.add('open');
    if(isMobile()){
      // garante que apareça SEMPRE em mobile
      nav.style.display = 'grid';
    }
  }
  function closeNav(){
    nav.classList.remove('open');
    if(isMobile()){
      nav.style.display = 'none';
    }
  }
  function toggleNav(){
    if(nav.classList.contains('open')) closeNav();
    else openNav();
  }

  // Abre/fecha ao clicar no ícone (sempre funciona)
  hamburger.addEventListener('click', function(e){
    e.stopPropagation();
    toggleNav();
  });

  // Fecha clicando fora do menu
  document.addEventListener('click', function(e){
    if(!nav.classList.contains('open')) return;
    var clickedInsideMenu = nav.contains(e.target);
    var clickedHamburger = hamburger.contains(e.target);
    if(!clickedInsideMenu && !clickedHamburger){
      closeNav();
    }
  });

  // Fecha com ESC
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeNav();
  });

  // Em desktop, limpa estilos inline
  window.addEventListener('resize', function(){
    if(!isMobile()){
      nav.classList.remove('open');
      nav.style.display = '';
    } else {
      // Em mobile, se estiver aberto, garante display correto
      if(nav.classList.contains('open')) nav.style.display = 'grid';
    }
  });
})();

// ===== FINAL PATCH: toggle do menu (abre/fecha no ícone e fecha clicando fora/ESC) =====
(function(){
  var hamburger = document.querySelector('.hamburger');
  var nav = document.querySelector('.nav-links');
  if(!hamburger || !nav) return;

  // Remove possíveis listeners antigos clonando o botão
  var hb = hamburger.cloneNode(true);
  hamburger.parentNode.replaceChild(hb, hamburger);
  hamburger = hb;

  function isMobile(){ return window.matchMedia('(max-width: 900px)').matches; }
  function openNav(){ nav.classList.add('open'); }
  function closeNav(){ nav.classList.remove('open'); }
  function toggleNav(){ nav.classList.contains('open') ? closeNav() : openNav(); }

  hamburger.addEventListener('click', function(e){ e.stopPropagation(); toggleNav(); });
  nav.addEventListener('click', function(e){ e.stopPropagation(); });

  document.addEventListener('click', function(e){
    if(!nav.classList.contains('open')) return;
    var clickedInside = nav.contains(e.target);
    var clickedBtn = hamburger.contains(e.target);
    if(!clickedInside && !clickedBtn) closeNav();
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeNav(); });
  window.addEventListener('resize', function(){ if(!isMobile()) closeNav(); });
})();

// === PREROLL v1s: overlay por 1s e vídeo com fade suave (não altera outras partes) ===
(function(){
  function init(){
    var btn = document.getElementById('openVideo');
    var box = document.getElementById('videobox');
    var video = document.getElementById('vbVideo');
    if(!btn || !box || !video) return;

    // Garante classe de fade no vídeo
    if(!video.classList.contains('vb-fade')) video.classList.add('vb-fade');

    // Cria overlay se não existir
    var inner = box.querySelector('.videobox-inner') || box;
    var pre = inner.querySelector('.vb-pre');
    if(!pre){
      pre = document.createElement('div');
      pre.className = 'vb-pre';
      pre.innerHTML = '<div class="playwrap"><i class="fa-solid fa-play"></i></div>';
      inner.appendChild(pre);
    }

    function openModal(){
      box.classList.add('open');
      box.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal(){
      box.classList.remove('open');
      box.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      try { video.pause(); video.currentTime = 0; } catch(e){}
      pre.classList.remove('show');
      video.classList.remove('show');
    }

    // FECHAR (mantém comportamentos existentes)
    var vbClose = box.querySelector('.vb-close');
    if(vbClose) vbClose.addEventListener('click', function(e){ e.preventDefault(); closeModal(); }, { capture: true });
    box.addEventListener('click', function(e){ if(e.target === box) closeModal(); }, { capture: true });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

    // ABRIR com preroll: captura cedo e cancela handlers que tocariam o vídeo direto
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      if(typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

      openModal();

      try { video.pause(); video.currentTime = 0; } catch(e){}
      pre.classList.add('show');
      video.classList.remove('show'); // garante início em fade

      // Após 1s, some overlay e inicia vídeo com fade
      setTimeout(function(){
        pre.classList.remove('show');
        // Toca o vídeo e aplica fade suave
        var p = video.play();
        video.classList.add('show');
        if(p && typeof p.catch === 'function'){ p.catch(function(){ /* ignore autoplay block */ }); }
      }, 1000);
    }, { capture: true });

  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

