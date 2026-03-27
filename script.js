// 0. Animated background paths
requestAnimationFrame(() => {
  const container = document.createElement('div');
  container.className = 'bg-paths';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 696 316');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('overflow', 'visible');
  svg.setAttribute('preserveAspectRatio', 'none');

  // Merge both orientations into a single SVG with ~36 paths
  const BATCH_COUNT = 6;
  const durations = Array.from({ length: BATCH_COUNT }, (_, b) => (26 + b * 3) * 1000);

  for (let i = 0; i < 36; i++) {
    const p = i % 2 === 0 ? 1 : -1;
    const idx = Math.floor(i / 2);
    const d =
      `M-${380 - idx * 5 * p} -${189 + idx * 6}` +
      `C-${380 - idx * 5 * p} -${189 + idx * 6} ` +
      `-${312 - idx * 5 * p} ${216 - idx * 6} ` +
      `${152 - idx * 5 * p} ${343 - idx * 6}` +
      `C${616 - idx * 5 * p} ${470 - idx * 6} ` +
      `${684 - idx * 5 * p} ${875 - idx * 6} ` +
      `${684 - idx * 5 * p} ${875 - idx * 6}`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', String(0.5 + idx * 0.03));
    svg.appendChild(path);
  }

  container.appendChild(svg);
  document.body.insertBefore(container, document.body.firstChild);

  svg.querySelectorAll('path').forEach((path, i) => {
    const totalLen = path.getTotalLength();
    const dashLen = totalLen * 0.35;
    const batchIdx = i % BATCH_COUNT;
    const duration = durations[batchIdx];

    path.style.strokeDasharray = `${dashLen} ${totalLen - dashLen}`;
    path.style.opacity = '0.12';

    path.animate(
      [
        { strokeDashoffset: '0' },
        { strokeDashoffset: `${-totalLen}` },
        { strokeDashoffset: `${-totalLen * 2}` },
      ],
      { duration, iterations: Infinity, easing: 'linear', delay: -(batchIdx / BATCH_COUNT) * duration }
    );
  });
});

// 1. Navbar background on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// 2. Active nav link via IntersectionObserver
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.remove('active'));
    const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, {
  rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'))}px 0px -60% 0px`,
});

sections.forEach(section => navObserver.observe(section));

// 3. Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinksList = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});

navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
  });
});

// 4. Scroll-reveal animation
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));
