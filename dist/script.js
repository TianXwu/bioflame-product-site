(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  const setProductState = (index) => {
    document.querySelectorAll('.range-dot').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === index);
    });
    const count = document.querySelector('#active-count');
    if (count) count.textContent = String(index + 1).padStart(2, '0');
  };

  const initVideoTabs = () => {
    const tabs = [...document.querySelectorAll('.video-tab')];
    const panels = [...document.querySelectorAll('.video-panel')];

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach((item, itemIndex) => {
          const active = itemIndex === index;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });

        panels.forEach((panel, panelIndex) => {
          const video = panel.querySelector('video');
          if (panelIndex !== index) {
            video.pause();
            panel.classList.remove('is-active');
            panel.hidden = true;
          }
        });

        const nextPanel = panels[index];
        nextPanel.hidden = false;
        nextPanel.classList.add('is-active');

        if (hasGsap && !reduceMotion) {
          window.gsap.fromTo(nextPanel, { autoAlpha: 0, scale: 1.015 }, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out',
            clearProps: 'transform'
          });
        }

        nextPanel.querySelector('video').play().catch(() => {});
      });
    });
  };

  initVideoTabs();

  if (!hasGsap || reduceMotion) {
    document.documentElement.classList.remove('js');
    document.querySelectorAll('.product-copy, .product-image').forEach((item, index) => {
      item.classList.toggle('is-active', index % 3 === 0);
    });
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const media = gsap.matchMedia();

  gsap.set([
    '.nav-shell',
    '.hero-kicker',
    '.hero h1',
    '.hero-subtitle',
    '.hero-actions',
    '.hero-caption',
    '.scroll-cue'
  ], { visibility: 'visible' });

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.nav-shell', { y: -24, autoAlpha: 0, duration: 0.7 })
    .from('.hero-kicker', { y: 18, autoAlpha: 0, duration: 0.55 }, '-=0.28')
    .from('.hero h1', { y: 46, autoAlpha: 0, duration: 1 }, '-=0.2')
    .from('.hero-subtitle', { y: 28, autoAlpha: 0, duration: 0.75 }, '-=0.62')
    .from('.hero-actions', { y: 22, autoAlpha: 0, duration: 0.65 }, '-=0.46')
    .from(['.hero-caption', '.scroll-cue'], { autoAlpha: 0, duration: 0.55 }, '-=0.25');

  gsap.to('.scroll-progress span', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2
    }
  });

  gsap.to('.hero-image', {
    scale: 1.055,
    yPercent: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  ScrollTrigger.batch('.reveal-item', {
    start: 'top 86%',
    once: true,
    onEnter: (items) => gsap.fromTo(items, {
      y: 34,
      autoAlpha: 0
    }, {
      y: 0,
      autoAlpha: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.08,
      overwrite: true
    })
  });

  const copies = gsap.utils.toArray('.product-copy');
  const images = gsap.utils.toArray('.product-image');
  copies.slice(1).forEach((item) => gsap.set(item, { autoAlpha: 0, y: 35 }));
  images.slice(1).forEach((item) => gsap.set(item, { autoAlpha: 0, scale: 0.95, y: 20 }));

  const productTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.range',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const index = Math.min(2, Math.floor(self.progress * 3));
        setProductState(index);
      }
    }
  });

  productTimeline
    .addLabel('c1', 0)
    .to(copies[0], { autoAlpha: 0, y: -28, duration: 0.12 }, 0.26)
    .to(images[0], { autoAlpha: 0, scale: 1.04, y: -20, duration: 0.12 }, 0.26)
    .fromTo(copies[1], { autoAlpha: 0, y: 35 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.36)
    .fromTo(images[1], { autoAlpha: 0, scale: 0.95, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.14 }, 0.36)
    .addLabel('c2', 0.4)
    .to(copies[1], { autoAlpha: 0, y: -28, duration: 0.12 }, 0.61)
    .to(images[1], { autoAlpha: 0, scale: 1.04, y: -20, duration: 0.12 }, 0.61)
    .fromTo(copies[2], { autoAlpha: 0, y: 35 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.71)
    .fromTo(images[2], { autoAlpha: 0, scale: 0.95, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.14 }, 0.71)
    .addLabel('c3', 0.75)
    .to({}, { duration: 0.15 });

  document.querySelectorAll('.range-dot').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.jump);
      const range = document.querySelector('.range');
      const maxDistance = range.offsetHeight - window.innerHeight;
      const progress = [0.02, 0.48, 0.9][index];
      window.scrollTo({
        top: range.offsetTop + maxDistance * progress,
        behavior: 'smooth'
      });
    });
  });

  media.add('(min-width: 901px)', () => {
    gsap.to('.product-halo', {
      rotation: 48,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: '.range',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  });

  gsap.to('.closing-orbit', {
    rotation: 90,
    scale: 1.12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.closing',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();

