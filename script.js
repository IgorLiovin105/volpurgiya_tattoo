// ====== SMOOTH SCROLL (anchors) ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ====== SCROLL REVEAL ======
const revealElements = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

document.querySelectorAll('.service, .process__step').forEach(el => {
  el.setAttribute('data-reveal', '');
  revealObserver.observe(el);
});

// ====== BURGER ======
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ====== PORTFOLIO FILTER ======
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio__item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.pointerEvents = 'auto';
      } else {
        item.style.opacity = '0.15';
        item.style.transform = 'scale(0.97)';
        item.style.pointerEvents = 'none';
      }
    });
  });
});

// ====== STAGGER REVEAL FOR GRID ITEMS ======
const gridObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.portfolio__item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, i * 100);
      });
      gridObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

portfolioItems.forEach(item => {
  item.classList.add('reveal');
});

const portfolioContainer = document.querySelector('.portfolio__grid');
if (portfolioContainer) gridObserver.observe(portfolioContainer);

// ====== LERP HELPER ======
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const smooth = {};
function getSmooth(key, target, speed) {
  if (smooth[key] === undefined) smooth[key] = target;
  smooth[key] = lerp(smooth[key], target, speed);
  if (Math.abs(smooth[key] - target) < 0.01) smooth[key] = target;
  return smooth[key];
}

// ====== PARALLAX SYSTEM ======
const nav = document.getElementById('nav');
const heroVisual = document.querySelector('.hero__visual');
const heroContent = document.querySelector('.hero__content');
const heroSideText = document.querySelector('.hero__side-text');
const aboutPortrait = document.querySelector('.about__portrait');
const aboutContent = document.querySelector('.about__content');
const sectionTitles = document.querySelectorAll('.portfolio__title, .services__title, .process__title, .contact__title, .about__title');

const titleLayers = [];
sectionTitles.forEach((title, i) => {
  titleLayers.push({ el: title, yOffset: 20, key: 'title_' + i });
});

function updateParallax() {
  const scrollY = window.pageYOffset;
  const winH = window.innerHeight;

  // Nav
  if (scrollY > 100) {
    nav.style.padding = '16px 40px';
    nav.style.background = 'rgba(240,230,208,0.92)';
  } else {
    nav.style.padding = '24px 40px';
    nav.style.background = 'rgba(240,230,208,0.7)';
  }

  // Hero
  const heroH = winH;
  if (scrollY < heroH * 1.5) {
    if (heroVisual) {
      const targetY = scrollY * 0.35;
      const y = getSmooth('heroVisY', targetY, 0.08);
      heroVisual.style.transform = `translateY(${y}px)`;
    }

    if (heroContent) {
      const targetY = scrollY * 0.15;
      const y = getSmooth('heroContY', targetY, 0.08);
      heroContent.style.transform = `translateY(${y}px)`;
    }

    if (heroSideText) {
      const targetY = scrollY * 0.25;
      const y = getSmooth('heroSideY', targetY, 0.08);
      heroSideText.style.transform = `translateY(${y}px)`;
    }
  }

  // About section parallax
  if (aboutPortrait) {
    const rect = aboutPortrait.getBoundingClientRect();
    if (rect.top < winH && rect.bottom > 0) {
      const progress = (winH - rect.top) / (winH + rect.height);
      const targetY = (progress - 0.5) * 40;
      const y = getSmooth('aboutPortY', targetY, 0.06);
      aboutPortrait.style.transform = `translateY(${y}px)`;
    }
  }

  if (aboutContent) {
    const rect = aboutContent.getBoundingClientRect();
    if (rect.top < winH && rect.bottom > 0) {
      const progress = (winH - rect.top) / (winH + rect.height);
      const targetY = (progress - 0.5) * -25;
      const y = getSmooth('aboutContY', targetY, 0.06);
      aboutContent.style.transform = `translateY(${y}px)`;
    }
  }

  // Section titles parallax
  titleLayers.forEach(layer => {
    const rect = layer.el.getBoundingClientRect();
    if (rect.top < winH && rect.bottom > 0) {
      const progress = (winH - rect.top) / (winH + rect.height);
      const targetY = (progress - 0.5) * layer.yOffset;
      const y = getSmooth(layer.key, targetY, 0.06);
      layer.el.style.transform = `translateY(${y}px)`;
    }
  });

  requestAnimationFrame(updateParallax);
}

requestAnimationFrame(updateParallax);

// ====== MOUSE PARALLAX ON HERO ======
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function mouseParallax() {
  if (heroVisual) {
    const mx = mouseX * 8;
    const my = mouseY * 5;
    const scrollY = window.pageYOffset;
    const baseY = getSmooth('heroVisY', scrollY * 0.35, 0.08);
    heroVisual.style.transform = `translateY(${baseY}px) translate(${mx}px, ${my}px)`;
  }
  requestAnimationFrame(mouseParallax);
}
mouseParallax();

// ====== PRELOADER ======
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('done'), 1000);
  }
});
