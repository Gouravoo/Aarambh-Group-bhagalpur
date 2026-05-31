/* ============================================
   AARAMBH GROUP - Website JavaScript
   Animations, Interactions & Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });

    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
    }, 3000);

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header background on scroll
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll to top button visibility
        if (scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load

    // ============================================
    // SCROLL TO TOP
    // ============================================
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        navMobile.classList.toggle('open');
        document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // SMOOTH SCROLLING for anchor links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const animation = el.dataset.animation || 'fadeInUp';
                const delay = el.dataset.delay || 0;

                setTimeout(() => {
                    el.style.opacity = '1';
                    el.classList.add('animate-' + animation);
                }, parseInt(delay));

                animationObserver.unobserve(el);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        animationObserver.observe(el);
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const counters = document.querySelectorAll('.count');
    let countersStarted = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const counterSection = document.querySelector('.counters-section');
    if (counterSection) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(counterSection);
    }

    // ============================================
    // PROGRESS BAR ANIMATION
    // ============================================
    const progressBars = document.querySelectorAll('.progress-fill');

    const progressObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width;
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // ============================================
    // TESTIMONIAL SLIDER
    // ============================================
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialCards = testimonialTrack ? testimonialTrack.querySelectorAll('.testimonial-card') : [];
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.testimonial-dot') : [];
    let currentSlide = 0;
    let autoplayInterval;

    function updateSlider() {
        if (!testimonialTrack) return;
        const offset = -currentSlide * 100;
        testimonialTrack.style.transform = `translateX(${offset}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        updateSlider();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Dots click
    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            currentSlide = parseInt(this.dataset.index);
            updateSlider();
            resetAutoplay();
        });
    });

    // Touch / Swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    if (testimonialTrack) {
        testimonialTrack.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoplay();
        }
    }

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    if (testimonialCards.length > 0) {
        startAutoplay();
    }

    // ============================================
    // CONTACT FORM HANDLER
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                showFormNotification('Please fill in all fields.', 'error');
                return;
            }

            // Construct WhatsApp message
            const whatsappMsg = `Hello AARAMBH GROUP!%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AMessage: ${encodeURIComponent(message)}`;
            const whatsappUrl = `https://wa.me/919142207315?text=${whatsappMsg}`;

            showFormNotification('Redirecting to WhatsApp...', 'success');

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 800);

            contactForm.reset();
        });
    }

    function showFormNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.form-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'form-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            border-radius: 12px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            animation: fadeInDown 0.4s ease;
            ${type === 'success'
                ? 'background: rgba(86, 196, 119, 0.95); color: #0f0f23;'
                : 'background: rgba(255, 82, 82, 0.95); color: white;'
            }
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeInUp 0.4s ease reverse';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // ============================================
    // NEWSLETTER SUBSCRIBE
    // ============================================
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function () {
            const email = document.getElementById('newsletterEmail').value.trim();
            if (email && email.includes('@')) {
                showFormNotification('Thank you for subscribing!', 'success');
                document.getElementById('newsletterEmail').value = '';
            } else {
                showFormNotification('Please enter a valid email.', 'error');
            }
        });
    }

    // ============================================
    // FOOTER YEAR
    // ============================================
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-mobile a[href^="#"]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // PARALLAX EFFECT for hero shapes
    // ============================================
    const heroShapes = document.querySelectorAll('.hero-bg-shapes .shape');

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        heroShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ============================================
    // SERVICE BOX HOVER EFFECTS (Touch Devices)
    // ============================================
    const serviceBoxes = document.querySelectorAll('.service-box');
    serviceBoxes.forEach(box => {
        box.addEventListener('touchstart', function () {
            serviceBoxes.forEach(b => b.classList.remove('touched'));
            this.classList.add('touched');
        }, { passive: true });
    });

    // ============================================
    // FOOTER SOCIAL HOVER EFFECTS
    // ============================================
    const footerSocials = document.querySelectorAll('.footer-col a[aria-label]');
    footerSocials.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.background = 'var(--primary-color)';
            this.style.color = 'var(--darkest-bg)';
            this.style.transform = 'translateY(-3px)';
        });
        link.addEventListener('mouseleave', function () {
            this.style.background = 'rgba(255,192,0,0.1)';
            this.style.color = 'var(--primary-color)';
            this.style.transform = 'translateY(0)';
        });
    });

    // ============================================
    // VIDEO PLAY BUTTON (placeholder action)
    // ============================================
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', function () {
            showFormNotification('Video feature coming soon!', 'success');
        });
    }

    // ============================================
    // PORTFOLIO IMAGE LIGHTBOX (simple)
    // ============================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (!img) return;

            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.92);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
                padding: 20px;
            `;

            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 85vh;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                animation: fadeInUp 0.4s ease;
            `;

            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 25px;
                font-size: 40px;
                color: white;
                cursor: pointer;
                font-family: sans-serif;
                line-height: 1;
                transition: color 0.3s ease;
            `;
            closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#ffc000');
            closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = 'white');

            lightbox.appendChild(lightboxImg);
            lightbox.appendChild(closeBtn);

            lightbox.addEventListener('click', function (e) {
                if (e.target === lightbox || e.target === closeBtn) {
                    lightbox.style.animation = 'fadeIn 0.3s ease reverse';
                    setTimeout(() => lightbox.remove(), 300);
                }
            });

            document.body.appendChild(lightbox);
        });
    });

    // ============================================
    // LOADING COMPLETE LOG
    // ============================================
    console.log('%c AARAMBH GROUP Website Loaded Successfully! ', 
        'background: linear-gradient(135deg, #ffc000, #ff8c00); color: #0f0f23; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');

});
