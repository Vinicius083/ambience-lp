/* ═══════════════════════════════════════════════════════
   AMBIANCE — Scroll Animations & Interactions
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Cached DOM elements ───
  const header       = document.getElementById('header');
  const menuToggle   = document.getElementById('menu-toggle');
  const mobileNav    = document.getElementById('mobile-nav');
  const heroImg      = document.getElementById('hero-bg-img');
  const fadeElements = document.querySelectorAll('.fade-in');
  const mobileLinks  = document.querySelectorAll('.mobile-nav__link');

  // ─── State ───
  let lastScrollY  = 0;
  let ticking      = false;

  // ═══════════════════════════════════════════════════
  // HEADER — Scroll Detection & Logo Swap
  // ═══════════════════════════════════════════════════

  function updateHeader() {
    const scrollY = window.scrollY;
    const headerLogo = document.getElementById('header-logo-img');

    if (scrollY > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  // ═══════════════════════════════════════════════════
  // HERO — Slider Logic
  // ═══════════════════════════════════════════════════

  const heroSlides = [
    { img: 'images/hero.png', title1: 'Residência', title2: 'Quinta do Lago' },
    { img: 'images/project1.png', title1: 'Cobertura', title2: 'Jardins' },
    { img: 'images/project2.png', title1: 'Casa', title2: 'Serra' }
  ];
  let currentSlide = 0;

  const btnPrev = document.getElementById('hero-prev');
  const btnNext = document.getElementById('hero-next');
  const title1 = document.getElementById('hero-title-1');
  const title2 = document.getElementById('hero-title-2');
  const currentCounter = document.getElementById('hero-counter-current');

  function updateHeroSlide() {
    if (!heroImg || !title1 || !title2 || !currentCounter) return;

    // Fade out
    heroImg.style.opacity = 0;
    
    setTimeout(() => {
      heroImg.src = heroSlides[currentSlide].img;
      title1.textContent = heroSlides[currentSlide].title1;
      title2.textContent = heroSlides[currentSlide].title2;
      currentCounter.textContent = '0' + (currentSlide + 1);
      
      // Fade in
      heroImg.style.opacity = 1;
    }, 300); // Wait for transition
  }

  function goToSlide(delta) {
    currentSlide = (currentSlide + delta + heroSlides.length) % heroSlides.length;
    updateHeroSlide();
  }

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => goToSlide(-1));
    btnNext.addEventListener('click', () => goToSlide(1));
  }

  // Swipe horizontal no hero (celular). Ignora gestos majoritariamente verticais,
  // para não atrapalhar a rolagem da página.
  const heroSection = document.getElementById('hero');
  let touchStartX = 0;
  let touchStartY = 0;

  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        goToSlide(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════
  // SCROLL — Fade-in Observer
  // ═══════════════════════════════════════════════════

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger delay for cards in grids
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('.fade-in'));
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.15}s`;
        }

        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ═══════════════════════════════════════════════════
  // VÍDEO INSTITUCIONAL — só carrega quando a pessoa pede
  // ═══════════════════════════════════════════════════

  const videoPlayer = document.getElementById('about-video');
  if (videoPlayer) {
    const video = videoPlayer.querySelector('video');
    const playBtn = videoPlayer.querySelector('.video-player__play');

    playBtn.addEventListener('click', () => {
      videoPlayer.classList.add('is-playing');
      video.controls = true;
      video.play().catch(() => {
        // reprodução bloqueada: devolve o botão para uma nova tentativa
        videoPlayer.classList.remove('is-playing');
        video.controls = false;
      });
      video.focus();
    });
  }

  // ═══════════════════════════════════════════════════
  // MOBILE MENU — Toggle
  // ═══════════════════════════════════════════════════

  function setMobileMenu(open) {
    menuToggle.classList.toggle('active', open);
    mobileNav.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  menuToggle.addEventListener('click', () => {
    setMobileMenu(!mobileNav.classList.contains('active'));
  });

  // Close mobile nav on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => setMobileMenu(false));
  });

  // Escape fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      setMobileMenu(false);
      menuToggle.focus();
    }
  });

  // Girar o aparelho / ampliar a janela além do breakpoint não deixa o menu preso aberto
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => {
    if (e.matches) setMobileMenu(false);
  });

  // ═══════════════════════════════════════════════════
  // SMOOTH SCROLL — Enhanced anchor links
  // ═══════════════════════════════════════════════════

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════
  // SCROLL — Unified scroll handler
  // ═══════════════════════════════════════════════════

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ═══════════════════════════════════════════════════
  // INIT — Trigger initial state
  // ═══════════════════════════════════════════════════

  // Initial header check
  updateHeader();
});
