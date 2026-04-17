const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const topShell = document.querySelector('.top-shell');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 860 && nav && menuToggle) {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener('scroll', () => {
  if (!topShell) return;
  topShell.classList.toggle('scrolled', window.scrollY > 18);
});

const eventRail = document.getElementById('eventRail');
const prevBtn = document.querySelector('.event-btn.prev');
const nextBtn = document.querySelector('.event-btn.next');

function getRailStep() {
  if (!eventRail) return 300;
  const firstCard = eventRail.querySelector('.event-card');
  if (!firstCard) return 300;
  const gap = parseFloat(getComputedStyle(eventRail).columnGap || getComputedStyle(eventRail).gap || '0');
  return firstCard.getBoundingClientRect().width + gap;
}

function updateRailButtons() {
  if (!eventRail || !prevBtn || !nextBtn) return;
  const maxScroll = Math.max(0, eventRail.scrollWidth - eventRail.clientWidth);
  prevBtn.disabled = eventRail.scrollLeft <= 3;
  nextBtn.disabled = eventRail.scrollLeft >= maxScroll - 3;
}

if (eventRail && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    eventRail.scrollBy({ left: -getRailStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    eventRail.scrollBy({ left: getRailStep(), behavior: 'smooth' });
  });

  eventRail.addEventListener('scroll', updateRailButtons);
  window.addEventListener('resize', updateRailButtons);
  updateRailButtons();
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const sectionId = entry.target.id;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isActive);
      });
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('main section[id]').forEach((section) => {
  sectionObserver.observe(section);
});

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !window.gsap) {
  document.querySelectorAll('.reveal').forEach((element) => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
} else {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-copy > *', {
    y: 26,
    opacity: 0,
    duration: 0.82,
    stagger: 0.11,
    ease: 'power2.out',
  });

  gsap.from('.hero-collage .shot, .hero-collage .tag-card', {
    y: 24,
    opacity: 0,
    duration: 0.82,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power2.out',
  });

  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.to(element, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 86%',
      },
    });
  });

  gsap.to('.ambient-one', {
    y: 110,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      scrub: true,
      start: 'top top',
      end: 'bottom bottom',
    },
  });

  gsap.to('.ambient-two', {
    y: -90,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      scrub: true,
      start: 'top top',
      end: 'bottom bottom',
    },
  });
}
