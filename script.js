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

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      currentSlide = (currentSlide === 0) ? heroSlides.length - 1 : currentSlide - 1;
      updateHeroSlide();
    });

    btnNext.addEventListener('click', () => {
      currentSlide = (currentSlide === heroSlides.length - 1) ? 0 : currentSlide + 1;
      updateHeroSlide();
    });
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
  // MOBILE MENU — Toggle
  // ═══════════════════════════════════════════════════

  function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile nav on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
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
