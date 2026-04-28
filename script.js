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

// Range slider navigation for events (keeps Prev/Next as well)
const eventRange = document.querySelector('.event-range');
if (eventRail && eventRange) {
  const updateRange = () => {
    const maxScroll = eventRail.scrollWidth - eventRail.clientWidth;
    const pct = maxScroll > 0 ? (eventRail.scrollLeft / maxScroll) * 100 : 0;
    eventRange.value = String(pct);
  };

  eventRange.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value || 0);
    const maxScroll = eventRail.scrollWidth - eventRail.clientWidth;
    eventRail.scrollTo({ left: maxScroll * (val / 100), behavior: 'smooth' });
  });

  eventRail.addEventListener('scroll', updateRange);
  window.addEventListener('resize', updateRange);
  updateRange();
}

// Duplicate ticker content and set direction-based animation class
document.querySelectorAll('.ticker-inner').forEach((inner) => {
  if (inner.dataset._cloned === '1') return;
  inner.innerHTML = inner.innerHTML + inner.innerHTML;
  inner.dataset._cloned = '1';
  const dir = (inner.getAttribute('data-direction') || 'ltr').toLowerCase();
  if (dir === 'rtl') inner.classList.add('rtl');
  else inner.classList.add('ltr');
});

// Contact form: open mailto with form content
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const name = (form.name && form.name.value) || '';
    const email = (form.email && form.email.value) || '';
    const message = (form.message && form.message.value) || '';
    const subject = encodeURIComponent(`Richiesta dal sito: ${name || email}`);
    const body = encodeURIComponent(message + '\n\nContatto: ' + email);
    window.location.href = `mailto:info@centroestivo.org?subject=${subject}&body=${body}`;
  });
}

// Simple auto-gallery behavior
document.querySelectorAll('.auto-gallery').forEach((gallery) => {
  const track = gallery.querySelector('.gallery-track');
  if (!track) return;
  const imgs = Array.from(track.querySelectorAll('img'));
  let idx = 0;
  function show(i) {
    idx = ((i % imgs.length) + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
  }
  const prev = gallery.querySelector('.gallery-prev');
  const next = gallery.querySelector('.gallery-next');
  prev && prev.addEventListener('click', () => show(idx - 1));
  next && next.addEventListener('click', () => show(idx + 1));
  const autoplay = gallery.dataset.autoplay !== 'false';
  const interval = parseInt(gallery.dataset.interval) || 3500;
  let timer;
  if (autoplay) {
    timer = setInterval(() => show(idx + 1), interval);
    gallery.addEventListener('mouseenter', () => clearInterval(timer));
    gallery.addEventListener('mouseleave', () => { timer = setInterval(() => show(idx + 1), interval); });
  }
  show(0);
});

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
