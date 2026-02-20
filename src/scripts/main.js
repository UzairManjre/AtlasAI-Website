

// ============================================
// SCROLL ANIMATION ENGINE
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Scroll Reveal System ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve — keeps it simple
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // --- 2. Staggered Children Reveal ---
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.stagger-item');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 120}ms`;
          child.classList.add('revealed');
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-container').forEach(el => {
    staggerObserver.observe(el);
  });

  // --- 3. Counter Animation ---
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const numericTarget = parseFloat(target);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * numericTarget);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- 4. Navbar Scroll Effect ---
  const nav = document.querySelector('nav');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    // Navbar effect
    if (scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Progress bar
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
  });

  // --- 5. Parallax Blobs ---
  const blobs = document.querySelectorAll('.blob-organic');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    blobs.forEach((blob, i) => {
      const speed = (i % 2 === 0) ? 0.03 : -0.02;
      blob.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // --- 6. Tilt Effect on Cards ---
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- 7. Magnetic Button Effect ---
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // --- 8. Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
        toggleMobileMenu();
      }
    });
  });

  // --- 9. Mobile Menu System ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let isMenuOpen = false;

  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('translate-x-full');
    mobileMenu.classList.toggle('translate-x-0');

    // Animate hamburger to X
    const bar1 = mobileMenuToggle.querySelector('.bar-1');
    const bar2 = mobileMenuToggle.querySelector('.bar-2');
    const bar3 = mobileMenuToggle.querySelector('.bar-3');

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      bar1.style.transform = 'translateY(7px) rotate(45deg)';
      bar2.style.opacity = '0';
      bar3.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      document.body.style.overflow = '';
      bar1.style.transform = 'translateY(0) rotate(0)';
      bar2.style.opacity = '1';
      bar3.style.transform = 'translateY(0) rotate(0)';
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // --- 10. Web3Forms Submission Logic ---
  const contactForm = document.getElementById('contact-form');
  const formResult = document.getElementById('form-result');

  if (contactForm) {
    // Inject Access Key from Environment Variable
    const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
    if (accessKeyInput && import.meta.env.VITE_WEB3FORMS_ACCESS_KEY) {
      accessKeyInput.value = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;

      // Loading State
      submitButton.innerHTML = '<span>Sending...</span>';
      submitButton.disabled = true;
      formResult.classList.add('hidden');
      formResult.classList.remove('text-red-500', 'text-green-500');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
        .then(async (response) => {
          let json = await response.json();
          if (response.status == 200) {
            formResult.innerHTML = "Success! Your pilot request has been sent.";
            formResult.classList.add('text-green-500');
            formResult.classList.remove('hidden');
            contactForm.reset();
          } else {
            console.log(response);
            formResult.innerHTML = json.message || "Something went wrong. Please try again.";
            formResult.classList.add('text-red-500');
            formResult.classList.remove('hidden');
          }
        })
        .catch(error => {
          console.log(error);
          formResult.innerHTML = "Something went wrong. Please check your connection.";
          formResult.classList.add('text-red-500');
          formResult.classList.remove('hidden');
        })
        .then(function () {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;

          // Clear success message after 5 seconds
          setTimeout(() => {
            formResult.classList.add('hidden');
          }, 5000);
        });
    });
  }

});
