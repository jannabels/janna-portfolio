document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));

  const slideshows = document.querySelectorAll('.project-slideshow');

  slideshows.forEach((slideshow) => {
    const slides = Array.from(slideshow.querySelectorAll('.project-slide'));
    const dots = Array.from(slideshow.querySelectorAll('.dot'));
    let currentIndex = 0;
    let autoplayId = null;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === currentIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === currentIndex);
      });
    };

    const startAutoplay = () => {
      if (slides.length <= 1) return;
      if (autoplayId) window.clearInterval(autoplayId);
      const interval = Number(slideshow.dataset.interval || 5000);
      autoplayId = window.setInterval(() => {
        showSlide(currentIndex + 1);
      }, interval);
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        showSlide(dotIndex);
        startAutoplay();
      });
    });

    slideshow.addEventListener('mouseenter', () => {
      startAutoplay();
    });

    slideshow.addEventListener('mouseleave', () => {
      if (autoplayId) window.clearInterval(autoplayId);
    });

    showSlide(0);
  });
});

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

root.setAttribute('data-theme', initialTheme);
themeToggle.textContent = initialTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});
