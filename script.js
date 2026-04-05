/* =========================================================
   CHRONO X — Premium Smartwatch Landing Page
   script.js
   Author: Developer Portfolio Project
   ========================================================= */

'use strict';

// ===================== NAVBAR — SCROLL BEHAVIOR =====================
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    function handleScroll() {
        const currentScroll = window.scrollY;

        // Add scrolled class after 60px
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });
})();


// ===================== MOBILE MENU TOGGLE =====================
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .btn-mobile-cta');

    if (!hamburger || !mobileMenu) return;

    function toggleMenu(force) {
        const isOpen = force !== undefined ? force : !hamburger.classList.contains('active');
        hamburger.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => toggleMenu());

    // Close menu on any link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleMenu(false);
    });
})();


// ===================== SMOOTH SCROLLING =====================
(function initSmoothScroll() {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const targetY = target.getBoundingClientRect().top + window.scrollY - navH;

            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
        });
    });
})();


// ===================== SCROLL ANIMATIONS (IntersectionObserver) =====================
(function initScrollAnimations() {
    const animatedEls = document.querySelectorAll('[data-animate]');
    if (!animatedEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(el => observer.observe(el));
})();


// ===================== ACTIVE NAV LINK HIGHLIGHT =====================
(function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const navH = 80;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active-link',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    }, {
        rootMargin: `-${navH}px 0px -60% 0px`,
        threshold: 0
    });

    sections.forEach(s => observer.observe(s));
})();


// ===================== COUNTDOWN TIMER =====================
(function initCountdown() {
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl) return;

    // Set deadline: 2 days, 18 hours from now (stored in sessionStorage so it persists on refresh)
    let deadline;
    const storedDeadline = sessionStorage.getItem('chrono_deadline');

    if (storedDeadline) {
        deadline = parseInt(storedDeadline);
    } else {
        deadline = Date.now() + (2 * 24 * 60 * 60 * 1000) + (18 * 60 * 60 * 1000) + (45 * 60 * 1000);
        sessionStorage.setItem('chrono_deadline', String(deadline));
    }

    function pad(n) {
        return String(Math.max(0, n)).padStart(2, '0');
    }

    function animateFlip(el, newVal) {
        if (el.textContent === newVal) return;
        el.style.transform = 'scale(0.85)';
        el.style.opacity = '0.4';
        el.style.transition = 'all 0.2s ease';
        setTimeout(() => {
            el.textContent = newVal;
            el.style.transform = 'scale(1)';
            el.style.opacity = '1';
        }, 150);
    }

    function tick() {
        const remaining = deadline - Date.now();

        if (remaining <= 0) {
            // Timer expired — show zeros
            [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => {
                el.textContent = '00';
            });
            return;
        }

        const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remaining % (1000 * 60)) / 1000);

        animateFlip(daysEl,    pad(d));
        animateFlip(hoursEl,   pad(h));
        animateFlip(minutesEl, pad(m));
        animateFlip(secondsEl, pad(s));
    }

    tick();
    setInterval(tick, 1000);
})();


// ===================== FAQ ACCORDION =====================
(function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('open', !isOpen);
            question.setAttribute('aria-expanded', String(!isOpen));
        });
    });
})();


// ===================== CONTACT FORM =====================
(function initContactForm() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const fields = form.querySelectorAll('input[required], textarea[required]');
        let valid = true;

        fields.forEach(field => {
            field.style.borderColor = '';
            if (!field.value.trim()) {
                field.style.borderColor = 'rgba(255, 80, 80, 0.6)';
                valid = false;
            }
        });

        if (!valid) return;

        // Disable button, show loading state
        const btn = form.querySelector('.form-submit');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        // Simulate async form submission (replace with actual fetch/API call)
        setTimeout(() => {
            form.reset();
            btn.innerHTML = originalContent;
            btn.style.opacity = '1';
            btn.disabled = false;
            success.classList.add('show');

            setTimeout(() => {
                success.classList.remove('show');
            }, 5000);
        }, 1400);
    });
})();


// ===================== ACTIVE NAV LINK STYLE INJECTION =====================
(function injectActiveNavStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active-link {
            color: var(--text-primary);
        }
        .nav-link.active-link::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
})();


// ===================== HERO ENTRANCE ANIMATION =====================
(function initHeroEntrance() {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual  = document.querySelector('.hero-visual');
    if (!heroContent || !heroVisual) return;

    // Stagger the hero elements in on page load
    const children = heroContent.children;
    Array.from(children).forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(24px)';
        child.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.12}s`;
    });

    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateX(30px)';
    heroVisual.style.transition = 'opacity 0.9s ease 0.3s, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s';

    // Trigger animation after very short delay
    requestAnimationFrame(() => {
        setTimeout(() => {
            Array.from(children).forEach(child => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            });
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateX(0)';
        }, 80);
    });
})();


// ===================== PARALLAX ORBS =====================
(function initParallax() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        if (!ticking) {
            requestAnimationFrame(() => {
                orbs.forEach((orb, i) => {
                    const depth = (i + 1) * 12;
                    orb.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();


// ===================== PRICING CARD GLOW FOLLOW =====================
(function initCardGlow() {
    const card = document.querySelector('.pricing-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(2);
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(2);
        card.style.background = `
            radial-gradient(circle at ${x}% ${y}%, rgba(201, 168, 76, 0.07), transparent 60%),
            var(--bg-surface)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
})();


// ===================== UNITS BAR ANIMATION =====================
(function initUnitsBar() {
    const barFill = document.querySelector('.units-bar-fill');
    if (!barFill) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate from 0 to 32%
                barFill.style.transition = 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s';
                barFill.style.width = '32%';
                observer.unobserve(barFill);
            }
        });
    }, { threshold: 0.5 });

    barFill.style.width = '0%';
    observer.observe(barFill);
})();