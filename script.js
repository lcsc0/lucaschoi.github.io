// 0. Animated background paths
(function () {
  const container = document.createElement('div');
  container.className = 'bg-paths';

  [1, -1].forEach(position => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 696 316');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('overflow', 'visible');

    for (let i = 0; i < 36; i++) {
      const p = position;
      const d =
        `M-${380 - i * 5 * p} -${189 + i * 6}` +
        `C-${380 - i * 5 * p} -${189 + i * 6} ` +
        `-${312 - i * 5 * p} ${216 - i * 6} ` +
        `${152 - i * 5 * p} ${343 - i * 6}` +
        `C${616 - i * 5 * p} ${470 - i * 6} ` +
        `${684 - i * 5 * p} ${875 - i * 6} ` +
        `${684 - i * 5 * p} ${875 - i * 6}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', String(0.5 + i * 0.03));
      path.style.opacity = String(0.2 + (i / 35) * 0.3);
      svg.appendChild(path);
    }

    container.appendChild(svg);
  });

  document.body.insertBefore(container, document.body.firstChild);

  container.querySelectorAll('path').forEach((path, globalIdx) => {
    const totalLen = path.getTotalLength();
    const dashLen = totalLen * 0.7;
    const duration = (20 + Math.random() * 10) * 1000;

    path.style.strokeDasharray = `${dashLen} ${totalLen - dashLen}`;

    path.animate(
      [
        { strokeDashoffset: '0' },
        { strokeDashoffset: `${-totalLen * 2}` },
      ],
      { duration, iterations: Infinity, easing: 'linear', delay: -Math.random() * duration }
    );
  });
}());

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
