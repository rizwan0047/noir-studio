// ============================================================
//  NOIR® — main.js
//  Preloader · Cursor · Magnetic · Reveal · Counters
//  Services Accordion · Testimonials · Clock · Scroll FX
// ============================================================

// ================= PRELOADER =================
const preloader = document.querySelector('.preloader');
const preFill = document.querySelector('.preloader-fill');
const prePercent = document.querySelector('.preloader-percent');

let progress = 0;
document.body.style.overflow = 'hidden';

const loadInterval = setInterval(() => {
  progress += Math.random() * 12;

  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.style.overflow = 'auto';
    }, 400);
  }

  if (preFill) preFill.style.width = progress + '%';
  if (prePercent) prePercent.textContent = Math.floor(progress) + '%';
}, 120);

// ================= CUSTOM CURSOR =================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let fx = 0;
let fy = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

(function followLoop() {
  fx += (mouseX - fx) * 0.12;
  fy += (mouseY - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(followLoop);
})();

// Grow cursor on hover targets
document.querySelectorAll('[data-hover]').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('grow');
    follower.classList.add('grow');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('grow');
    follower.classList.remove('grow');
  });
});

// ================= MAGNETIC BUTTONS =================
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(x∗0.3px,{x * 0.3}px,x∗0.3px,{y * 0.3}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
    el.style.transform = 'translate(0,0)';
    setTimeout(() => {
      el.style.transition = '';
    }, 500);
  });
});

// ================= SCROLL REVEAL =================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter if the revealed element contains one
        const counter = entry.target.querySelector('[data-count]');
        if (counter && !counter.dataset.done) {
          counter.dataset.done = 'true';
          animateCounter(counter);
        }

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ================= ANIMATED COUNTERS =================
function animateCounter(el) {
  const target = +el.dataset.count;
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 20);
}

// ================= SERVICES ACCORDION =================
document.querySelectorAll('.service-item').forEach((item) => {
  const head = item.querySelector('.service-head');
  const body = item.querySelector('.service-body');

  head.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all others first
    document.querySelectorAll('.service-item.open').forEach((other) => {
      other.classList.remove('open');
      other.querySelector('.service-body').style.maxHeight = null;
    });

    // Open clicked one (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// ================= TESTIMONIAL SLIDER =================
const slides = document.querySelectorAll('.t-slide');
const tIndexEl = document.getElementById('t-index');
let tCurrent = 0;

function showSlide(n) {
  slides.forEach((s) => s.classList.remove('active'));
  tCurrent = (n + slides.length) % slides.length;
  slides[tCurrent].classList.add('active');

  tIndexEl.textContent =
    String(tCurrent + 1).padStart(2, '0') +
    ' / ' +
    String(slides.length).padStart(2, '0');
}

const tNext = document.getElementById('t-next');
const tPrev = document.getElementById('t-prev');

if (tNext) tNext.addEventListener('click', () => showSlide(tCurrent + 1));
if (tPrev) tPrev.addEventListener('click', () => showSlide(tCurrent - 1));

// Auto-rotate every 6 seconds
setInterval(() => showSlide(tCurrent + 1), 6000);

// ================= LIVE CLOCK (Taipei time) =================
function updateClock() {
  const clockEl = document.getElementById('clock');
  if (!clockEl) return;

  const now = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  clockEl.textContent = now;
}
updateClock();
setInterval(updateClock, 1000);

// ================= SCROLL EFFECTS =================
function isTouchDevice() {
  return window.matchMedia('(hover: none)').matches;
}

window.addEventListener('scroll', () => {
  // --- Scroll progress bar ---
  const progressBar = document.querySelector('.scroll-progress');
  const scrolled =
    window.scrollY /
    (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.width = scrolled * 100 + '%';

  // --- Parallax on project images ---
  document.querySelectorAll('.project-img img').forEach((img) => {
    const rect = img.parentElement.getBoundingClientRect();
    const speed = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.06;
    img.style.translate = `0 ${speed}px`;
  });

  // --- Hero title fade on scroll ---
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const y = window.scrollY;
    heroTitle.style.transform = `translateY(${y * 0.25}px)`;
    heroTitle.style.opacity = Math.max(1 - y / 600, 0);
  }

  // --- Horizontal gallery auto-drift (desktop only) ---
  const track = document.getElementById('gallery-track');
  if (track && !isTouchDevice()) {
    const rect = track.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const visibleProgress =
        (window.innerHeight - rect.top) /
        (window.innerHeight + rect.height);
      track.scrollLeft =
        visibleProgress * (track.scrollWidth - track.clientWidth);
    }
  }
});

// ================= SMOOTH ANCHOR SCROLLING =================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // skip placeholder links

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
