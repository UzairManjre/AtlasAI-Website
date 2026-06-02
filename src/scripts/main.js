

// ============================================
// SCROLL ANIMATION ENGINE
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  // --- Dynamic Time-based Greeting (Valyra) ---
  const timeGreetingEl = document.getElementById('time-greeting');
  if (timeGreetingEl) {
    const hours = new Date().getHours();
    let greeting = "Welcome to VALYRA.";
    if (hours < 12) {
      greeting = "Good morning, traveler. Welcome to VALYRA.";
    } else if (hours < 17) {
      greeting = "Good afternoon. Welcome to VALYRA.";
    } else {
      greeting = "Good evening. Welcome to VALYRA.";
    }
    timeGreetingEl.textContent = greeting;
  }

  // --- Ambient Canvas Animation (Option B Flow Field + Agreeable Gradient Blobs & Waves) ---
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    let width = canvas.width = parent.clientWidth || window.innerWidth;
    let height = canvas.height = parent.clientHeight || window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = parent.clientWidth || window.innerWidth;
      height = canvas.height = parent.clientHeight || window.innerHeight;
    });

    // 1. Organic color blobs (translucent glows)
    const blobs = [
      { x: width * 0.2, y: height * 0.3, vx: 0.15, vy: 0.1, radius: 550, color: 'rgba(13, 148, 136, 0.26)' },
      { x: width * 0.8, y: height * 0.5, vx: -0.1, vy: 0.12, radius: 650, color: 'rgba(45, 212, 191, 0.22)' },
      { x: width * 0.5, y: height * 0.8, vx: 0.08, vy: -0.07, radius: 480, color: 'rgba(129, 140, 248, 0.18)' },
      { x: width * 0.3, y: height * 0.6, vx: -0.05, vy: 0.08, radius: 400, color: 'rgba(251, 191, 36, 0.14)' }
    ];

    // 2. Flow Field configuration (Option B)
    const particleCount = 200;
    const particles = [];
    const maxSpeed = 1.8;

    class FlowParticle {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        if (isInitial) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        } else {
          // Spawn at screen edges
          if (Math.random() < 0.5) {
            this.x = 0;
            this.y = Math.random() * height;
          } else {
            this.x = Math.random() * width;
            this.y = 0;
          }
        }

        this.vx = Math.random() * 0.5 + 0.2;
        this.vy = Math.random() * 0.5 + 0.2;
        this.speedMultiplier = Math.random() * 0.5 + 0.5;
        this.history = [];
        this.maxHistory = Math.floor(Math.random() * 5) + 5; // Trail length 5 to 9
        
        // Curated teals with high transparency to overlay nicely
        const tealColors = [
          'rgba(13, 148, 136, 0.18)',  // Teal 600
          'rgba(45, 212, 191, 0.22)',  // Teal 400
          'rgba(15, 118, 110, 0.14)',  // Teal 700
          'rgba(94, 234, 212, 0.25)'   // Teal 300
        ];
        this.color = tealColors[Math.floor(Math.random() * tealColors.length)];
        this.lineWidth = Math.random() * 1.2 + 0.6;
      }

      update(time, mouse) {
        // Base flow field angle
        const angle = Math.sin(this.x * 0.003 + time * 0.0003) * Math.cos(this.y * 0.003 + time * 0.0002) * Math.PI * 1.5 + 
                      Math.sin(this.y * 0.001 - time * 0.0001) * Math.PI * 0.5;

        // Apply flow force
        this.vx += Math.cos(angle) * 0.05 * this.speedMultiplier;
        this.vy += Math.sin(angle) * 0.05 * this.speedMultiplier;

        // Mouse vortex (whirlpool) influence
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 220) {
            const force = (1 - dist / 220) * 1.5;
            const tx = -dy / dist;
            const ty = dx / dist;

            this.vx += tx * force * 0.6;
            this.vy += ty * force * 0.6;

            // Spiral inwards
            this.vx += (dx / dist) * force * 0.15;
            this.vy += (dy / dist) * force * 0.15;
          }
        }

        // Limit speed
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxHistory) {
          this.history.shift();
        }

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset(false);
        }
      }

      draw() {
        if (this.history.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    // Initialize flow field particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new FlowParticle(true));
    }

    // Interactive mouse state
    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    let time = 0;
    function animate() {
      // Clear with body background color
      ctx.fillStyle = '#fafbfc';
      ctx.fillRect(0, 0, width, height);

      time += 1.5;

      // 1. Draw organic color blobs
      blobs.forEach(blob => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Gentle attraction to mouse
        if (mouse.x && mouse.y) {
          blob.x += (mouse.x - blob.x) * 0.001;
          blob.y += (mouse.y - blob.y) * 0.001;
        }

        // Bounce edges
        if (blob.x - blob.radius < -100 || blob.x + blob.radius > width + 100) blob.vx *= -1;
        if (blob.y - blob.radius < -100 || blob.y + blob.radius > height + 100) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Update and draw flow field particles
      particles.forEach(p => {
        p.update(time, mouse);
        p.draw();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

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

  // --- Framer-Style Rotating Text Pro Animation ---
  const container = document.getElementById('rotating-container');
  if (container) {
    const words = container.querySelectorAll('.rotating-word');
    if (words.length > 0) {
      let activeIndex = 0;

      // Set initial container width to match the first word
      const setWidth = () => {
        container.style.width = `${words[activeIndex].offsetWidth}px`;
      };
      
      // Run immediately and on full window load to ensure custom fonts are loaded
      setWidth();
      window.addEventListener('load', setWidth);

      // Handle window resizing
      window.addEventListener('resize', () => {
        container.style.width = `${words[activeIndex].offsetWidth}px`;
      });

      function rotateText() {
        const nextIndex = (activeIndex + 1) % words.length;

        // Animate the container width to fit the upcoming word
        container.style.width = `${words[nextIndex].offsetWidth}px`;

        // Animate out current word (slide up and fade out)
        words[activeIndex].classList.remove('translate-y-0', 'opacity-100');
        words[activeIndex].classList.add('-translate-y-full', 'opacity-0');

        // Animate in next word (slide up from bottom and fade in)
        words[nextIndex].classList.remove('translate-y-full', 'opacity-0');
        words[nextIndex].classList.add('translate-y-0', 'opacity-100');

        // Reset the previous word back to the bottom after transition finishes
        const prevIndex = activeIndex;
        setTimeout(() => {
          words[prevIndex].classList.remove('-translate-y-full');
          words[prevIndex].classList.add('translate-y-full');
        }, 500); // 500ms matches the transition-all duration-500 in HTML

        activeIndex = nextIndex;
      }

      // Rotate every 3 seconds
      setInterval(rotateText, 3000);
    }
  }

  // --- Pre-split Handwritten Text into Characters ---
  document.querySelectorAll('.handwritten-text').forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    Array.from(text).forEach((char, idx) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'handwritten-char';
      span.style.transitionDelay = `${idx * 85}ms`; // staggered writing effect (decreased speed)
      el.appendChild(span);
    });
  });

  // --- Framer-Style TextFill Scroll Animation ---
  const problemSection = document.getElementById('problem-section');
  const problemHeadline = document.getElementById('problem-headline');
  const problemSubtitle = document.getElementById('problem-subtitle');

  if (problemSection && problemHeadline) {
    const nodes = Array.from(problemHeadline.childNodes);
    problemHeadline.innerHTML = '';
    const wordSpans = [];

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(w => {
          if (w.trim() === '') {
            problemHeadline.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement('span');
            span.className = 'textfill-word';
            span.textContent = w;
            problemHeadline.appendChild(span);
            wordSpans.push(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.add('textfill-word');
        problemHeadline.appendChild(node);
        wordSpans.push(node);
      }
    });

    if (problemSubtitle) {
      problemSubtitle.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      problemSubtitle.style.transform = 'translateY(10px)';
      problemSubtitle.style.opacity = '0.15';
    }

    const handleTextFillScroll = () => {
      const rect = problemSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight * 0.95;
      const end = windowHeight * 0.25;
      
      let progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      const numWords = wordSpans.length;
      wordSpans.forEach((span, idx) => {
        const wordThreshold = idx / numWords;
        if (progress > wordThreshold) {
          span.classList.add('textfill-word-active');
        } else {
          span.classList.remove('textfill-word-active');
        }
      });

      if (problemSubtitle) {
        if (progress > 0.85) {
          problemSubtitle.style.opacity = '1';
          problemSubtitle.style.transform = 'translateY(0)';
        } else {
          problemSubtitle.style.opacity = '0.15';
          problemSubtitle.style.transform = 'translateY(10px)';
        }
      }
    };

    window.addEventListener('scroll', handleTextFillScroll, { passive: true });
    handleTextFillScroll(); // Initial run
  }

  // --- 8. Wheel Timeline Drag-to-Rotate & Radial Layout Controller ---
  function initWheelTimeline() {
    const dragZone = document.getElementById('wheel-timeline-drag-zone');
    const rotatingElement = document.getElementById('wheel-rotating-element');
    const counterElement = document.getElementById('timeline-step-counter');
    const ticksContainer = document.getElementById('wheel-ticks-container');
    const cards = document.querySelectorAll('#timeline-cards-stack .timeline-card');
    const nodes = document.querySelectorAll('#wheel-rotating-element .wheel-node');

    if (!dragZone || !rotatingElement) return;

    // A. Generate Radial Ticks
    const totalTicks = 70;
    const tickSpacing = 2.4; // degrees between ticks
    const startAngle = -82.8; // centered around 0 degrees ((70 - 1) * 2.4 / 2)
    const ticksArray = [];

    if (ticksContainer) {
      ticksContainer.innerHTML = ''; // clean default
      for (let i = 0; i < totalTicks; i++) {
        const angle = startAngle + i * tickSpacing;
        const tick = document.createElement('div');
        tick.className = 'wheel-tick';
        tick.style.setProperty('--tick-angle', `${angle}deg`);
        ticksContainer.appendChild(tick);
        ticksArray.push({ element: tick, baseAngle: angle });
      }
    }

    // B. State Variables
    let isDragging = false;
    let startMouseAngle = 0;
    let startWheelRotation = 40; // Starts at Step 1 active (+40deg)
    let currentWheelRotation = 40;

    const stepTargetRotations = { 1: 40, 2: 20, 3: 0, 4: -20, 5: -40 };

    // Function to calculate cursor angle relative to the center of the wheel
    const getAngleBetweenCursorAndWheelCenter = (clientX, clientY) => {
      const rect = rotatingElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      
      return Math.atan2(dy, dx) * (180 / Math.PI); // returns degrees
    };

    // C. Update Ticks and Active Classes
    const updateWheelUI = (rotationVal) => {
      // Set rotation variable and direct transform on the wheel container
      rotatingElement.style.setProperty('--wheel-rotation', `${rotationVal}deg`);
      rotatingElement.style.transform = `rotate(${rotationVal}deg)`;

      // Determine which step is currently closest to the active line (0 degrees absolute)
      let closestStep = 1;
      let minDiff = Infinity;
      
      for (let s = 1; s <= 5; s++) {
        const targetRot = stepTargetRotations[s];
        const diff = Math.abs(rotationVal - targetRot);
        if (diff < minDiff) {
          minDiff = diff;
          closestStep = s;
        }
      }

      // Update UI counter
      if (counterElement) {
        counterElement.textContent = `0${closestStep} / 05`;
      }

      // Update Node active state
      nodes.forEach(node => {
        const step = parseInt(node.dataset.step);
        if (step === closestStep) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });

      // Update Card active state
      cards.forEach(card => {
        const step = parseInt(card.dataset.step);
        if (step === closestStep) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });



      // D. Proximity Tick Glowing
      ticksArray.forEach(tick => {
        const absoluteAngle = tick.baseAngle + rotationVal;
        const absAngleRad = Math.abs(absoluteAngle);

        let scale = 1;
        let opacity = 0.15;
        let isActive = false;

        // If tick is close to the active horizontal axis (0 degrees)
        if (absAngleRad < 22) {
          const factor = 1 - absAngleRad / 22; // 0 (far) to 1 (aligned)
          scale = 1 + factor * 1.5; // scale width up to 2.5x
          opacity = 0.18 + factor * 0.82; // fade in up to 1.0 opacity
          if (absAngleRad < 1.2) {
            isActive = true;
          }
        }

        tick.element.style.setProperty('--tick-scale', scale);
        tick.element.style.setProperty('--tick-opacity', opacity);

        if (isActive) {
          tick.element.classList.add('active-tick');
        } else {
          tick.element.classList.remove('active-tick');
        }
      });
    };

    // E. Snapping Function
    const snapToClosestStep = (currentRot) => {
      let closestStep = 1;
      let minDiff = Infinity;
      
      for (let s = 1; s <= 5; s++) {
        const targetRot = stepTargetRotations[s];
        const diff = Math.abs(currentRot - targetRot);
        if (diff < minDiff) {
          minDiff = diff;
          closestStep = s;
        }
      }

      const snapRot = stepTargetRotations[closestStep];
      currentWheelRotation = snapRot;
      
      // Remove dragging class to re-enable transitions
      document.body.classList.remove('dragging');
      updateWheelUI(snapRot);
    };

    // F. Drag Handlers
    const startDrag = (clientX, clientY) => {
      isDragging = true;
      document.body.classList.add('dragging');
      startMouseAngle = getAngleBetweenCursorAndWheelCenter(clientX, clientY);
      startWheelRotation = currentWheelRotation;
    };

    const dragMove = (clientX, clientY) => {
      if (!isDragging) return;
      
      const currentMouseAngle = getAngleBetweenCursorAndWheelCenter(clientX, clientY);
      
      // Calculate angle delta
      let deltaAngle = currentMouseAngle - startMouseAngle;
      
      // Handle wrapping boundaries (-180 to 180 jumps)
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;
      
      // New rotation
      let newRotation = startWheelRotation + deltaAngle;
      
      // Clamp boundaries so the wheel can't spin indefinitely
      newRotation = Math.max(-60, Math.min(60, newRotation));
      currentWheelRotation = newRotation;
      
      updateWheelUI(newRotation);
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      snapToClosestStep(currentWheelRotation);
    };

    // G. Event Listeners for Mouse/Touch
    rotatingElement.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });

    rotatingElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        dragMove(e.clientX, e.clientY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        dragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    // H. Nodes click navigation
    nodes.forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent drag start triggers on click
        const step = parseInt(node.dataset.step);
        const targetRot = stepTargetRotations[step];
        currentWheelRotation = targetRot;
        
        document.body.classList.remove('dragging');
        updateWheelUI(targetRot);
      });
    });



    // Initial draw
    updateWheelUI(currentWheelRotation);
  }

  // --- 9. Mobile Timeline Swipe Synchronization ---
  function initMobileTimeline() {
    const mobileTrack = document.getElementById('mobile-carousel-track');
    const mobileDots = document.querySelectorAll('.mobile-step-dot');
    const mobileRotatingElement = document.getElementById('mobile-wheel-rotating-element');

    if (!mobileTrack) return;

    const handleMobileScroll = () => {
      const scrollLeft = mobileTrack.scrollLeft;
      const width = mobileTrack.getBoundingClientRect().width;
      const maxScroll = mobileTrack.scrollWidth - width;
      
      // Calculate scroll progress percent (0 to 1)
      const progressPercent = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      
      // Rotate mobile wheel from +32deg to -32deg
      const startMobileRot = 32;
      const endMobileRot = -32;
      const mobileRotVal = startMobileRot + progressPercent * (endMobileRot - startMobileRot);
      
      if (mobileRotatingElement) {
        mobileRotatingElement.style.setProperty('--mobile-wheel-rotation', `${mobileRotVal}deg`);
        mobileRotatingElement.style.transform = `rotate(${mobileRotVal}deg)`;
      }

      // Active card snapping
      const activeStep = Math.max(1, Math.min(5, Math.round(scrollLeft / width) + 1));

      mobileDots.forEach(dot => {
        if (parseInt(dot.dataset.step) === activeStep) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    // Dot navigation
    mobileDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const step = parseInt(dot.dataset.step);
        const width = mobileTrack.getBoundingClientRect().width;

        mobileTrack.scrollTo({
          left: (step - 1) * width,
          behavior: 'smooth'
        });
      });
    });

    mobileTrack.addEventListener('scroll', handleMobileScroll, { passive: true });
    handleMobileScroll(); // initial trigger
  }

  initWheelTimeline();
  initMobileTimeline();

});
