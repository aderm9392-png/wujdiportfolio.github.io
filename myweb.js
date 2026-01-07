(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const cursorFollow = document.querySelector('.cursor-follow');
  const cursorOutline = document.querySelector('.cursor-outline');
  const glow = document.querySelector('.glow');
  const homeSection = document.getElementById('home');
  const magneticBtn = document.querySelector('.magnetic');
  const projectCards = document.querySelectorAll('.project-card');

  let mouseX = 0;
  let mouseY = 0;
  let isOverInteractive = false;

  // Theme toggle
  function setTheme(t) {
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      toggle.textContent = '🌙';
    }
    localStorage.setItem('theme', t);
  }

  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Smooth scrolling for nav links
  document.querySelectorAll('.nav-menu a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      target.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Advanced cursor system
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Cursor follow dot
    cursorFollow.style.display = 'block';
    cursorFollow.style.left = (mouseX - 5) + 'px';
    cursorFollow.style.top = (mouseY - 5) + 'px';

    // Cursor outline
    cursorOutline.style.display = 'block';
    cursorOutline.style.left = (mouseX - 25) + 'px';
    cursorOutline.style.top = (mouseY - 25) + 'px';

    // Cursor stretch on interactive elements
    const target = e.target;
    const isInteractive = target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('project-card');
    
    if (isInteractive) {
      cursorOutline.classList.add('stretched', 'hover');
      isOverInteractive = true;
    } else {
      cursorOutline.classList.remove('stretched', 'hover');
      isOverInteractive = false;
    }

    // Mouse tracking glow effect
    if (homeSection.getBoundingClientRect().top < window.innerHeight && homeSection.getBoundingClientRect().bottom > 0) {
      const rect = homeSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      glow.style.left = (x - 150) + 'px';
      glow.style.top = (y - 150) + 'px';
      glow.style.opacity = '0.4';
    } else {
      glow.style.opacity = '0';
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorFollow.style.display = 'none';
    cursorOutline.style.display = 'none';
  });

  // Magnetic button effect
  if (magneticBtn) {
    magneticBtn.addEventListener('mousemove', (e) => {
      const rect = magneticBtn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const moveX = (x - rect.width / 2) * 0.2;
      const moveY = (y - rect.height / 2) * 0.2;
      
      magneticBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    magneticBtn.addEventListener('mouseleave', () => {
      magneticBtn.style.transform = 'translate(0, 0)';
    });
  }

  // 3D Tilt effect for project cards
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (x - centerX) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 20px 50px rgba(0, 217, 255, 0.4)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.1)';
    });
  });

  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Formspree will handle the submission
    });
  }

  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger fade-in animations
        entry.target.querySelectorAll('.fade-in').forEach((el, index) => {
          setTimeout(() => {
            el.style.animationPlayState = 'running';
          }, index * 100);
        });

        // Animate skill bars
        entry.target.querySelectorAll('.skill-fill').forEach(skillBar => {
          const targetWidth = skillBar.getAttribute('data-width');
          skillBar.style.width = targetWidth + '%';
        });

        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Skill icon hover bounce effect
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Floating skill pills enhanced interaction
  const skillPills = document.querySelectorAll('.skill-pill');
  skillPills.forEach(pill => {
    pill.style.position = 'relative';
    
    pill.addEventListener('mouseenter', function() {
      this.style.position = 'relative';
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetY = (Math.random() - 0.5) * 10;
      this.style.transform = `scale(1.15) translate(${offsetX}px, ${offsetY}px)`;
    });

    pill.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Project Modal Functionality
  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalTechList = document.getElementById('modal-tech-list');
  const modalLiveLink = document.getElementById('modal-live-link');
  const modalCodeLink = document.getElementById('modal-code-link');
  const modalClose = document.querySelector('.modal-close');

  // Project data
  const projectData = {
    Restaurant: {
      title: 'Restaurant Website',
      description: 'A responsive Restaurant website showcasing product menu, Cart, Location and Contact Page with a Link to Whatsapp or any preferred social media or email.',
      image: 'Restaurant.png',
      technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
      liveLink: 'https://wujdi.github.io',
      
    },
    ecommerce: {
      title: 'E-commerce App',
      description: 'A full-stack e-commerce application built with React and Node.js featuring user authentication, payment integration, product management, and a modern shopping experience.',
      image: 'Ecommerce.png',
      technologies: ['React', 'Node.js', 'Express.js',],
      liveLink: 'https://judymustapha59-glitch.github.io/judymustapha59.github.io/',
      
    },
    taskmanager: {
      title: 'Build in Public',
      description: 'An interactive case study showing how I think, design, and debug using HTML, CSS, and JavaScript.',
      image: 'Buildinpublic.png',
      technologies: ['React', 'Node.js',],
      liveLink: 'https://wujdi05.github.io/BuildinPublic/',
    }
  };

  // Open modal on card click or navigate to live link
  projectCards.forEach(card => {
    const liveBtn = card.querySelector('.live-btn');
    
    card.addEventListener('click', (e) => {
      // If clicking the live button, navigate directly to the URL
      if (e.target === liveBtn || e.target.closest('.live-btn')) {
        const projectKey = card.getAttribute('data-project');
        const project = projectData[projectKey];
        if (project && project.liveLink && project.liveLink !== '#') {
          window.open(project.liveLink, '_blank');
        }
        return;
      }
      
      // Otherwise, open the modal
      const projectKey = card.getAttribute('data-project');
      const project = projectData[projectKey];
      
      if (project) {
        modalImg.src = project.image;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        modalLiveLink.href = project.liveLink;
        modalCodeLink.href = project.codeLink;
        
        // Clear and populate tech list
        modalTechList.innerHTML = '';
        project.technologies.forEach(tech => {
          const techSpan = document.createElement('span');
          techSpan.textContent = tech;
          modalTechList.appendChild(techSpan);
        });
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Touch Ripple Effect for Mobile
  function addRippleEffect(element) {
    element.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const size = Math.max(rect.width, rect.height);
      const x = touch.clientX - rect.left - size / 2;
      const y = touch.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      element.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // Apply ripple effect to interactive elements
  document.querySelectorAll('.btn, .skill-pill, .project-card, .skill-item').forEach(el => {
    addRippleEffect(el);
  });
})();




