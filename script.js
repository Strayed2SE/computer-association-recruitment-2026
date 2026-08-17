        // ============ JS Boot ============
        // JS is alive: remove the no-js class so reveal animations take over.
        // Without JS, html.no-js keeps all content visible via CSS fallback.
        document.documentElement.classList.remove('no-js');

        // ============ Theme Toggle ============
        (function() {
            const toggle = document.getElementById('themeToggle');
            const html = document.documentElement;

            // Load saved preference or use system default
            const saved = localStorage.getItem('theme');
            if (saved) {
                html.setAttribute('data-theme', saved);
            } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                html.setAttribute('data-theme', 'light');
            }

            toggle.addEventListener('click', () => {
                const current = html.getAttribute('data-theme');
                const next = current === 'light' ? 'dark' : 'light';
                html.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
            });
        })();

        // ============ Particle Background (Canvas) ============
        (function() {
            const canvas = document.getElementById('heroCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let width, height;
            let particles = [];
            const PARTICLE_COUNT = 80;

            function resize() {
                const hero = document.getElementById('hero');
                const rect = hero.getBoundingClientRect();
                width = canvas.width = rect.width;
                height = canvas.height = rect.height;
            }

            // Theme-aware color palette: light mode needs darker, more opaque particles
            function palette() {
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                return {
                    sat: isLight ? 70 : 80,
                    light: isLight ? 45 : 65,
                    opMin: isLight ? 0.22 : 0.10,
                    opRange: isLight ? 0.35 : 0.40,
                    lineMax: isLight ? 0.20 : 0.12
                };
            }

            class Particle {
                constructor() {
                    this.reset();
                }
                reset() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.size = Math.random() * 2 + 0.5;
                    this.speedX = (Math.random() - 0.5) * 0.5;
                    this.speedY = (Math.random() - 0.5) * 0.5;
                    this.baseOpacity = Math.random() * 0.4 + 0.1;
                    // Randomly assign blue or purple tint
                    this.hue = Math.random() > 0.5 ? 230 : 265;
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < -10) this.x = width + 10;
                    if (this.x > width + 10) this.x = -10;
                    if (this.y < -10) this.y = height + 10;
                    if (this.y > height + 10) this.y = -10;
                }
                draw(ctx, p) {
                    const opacity = p.opMin + this.baseOpacity * p.opRange;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${this.hue}, ${p.sat}%, ${p.light}%, ${opacity})`;
                    ctx.fill();
                }
            }

            function initParticles() {
                particles = [];
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    particles.push(new Particle());
                }
            }

            // Draw connection lines between nearby particles
            function drawConnections(ctx, p) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            const opacity = (1 - dist / 120) * p.lineMax;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(79, 110, 247, ${opacity})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            let animFrameId;
            let isTabVisible = true;

            function startAnimation() {
                if (!isTabVisible || !isHeroVisible) return;
                animFrameId = requestAnimationFrame(animate);
            }

            function animate() {
                const p = palette();
                ctx.clearRect(0, 0, width, height);
                particles.forEach(particle => {
                    particle.update();
                    particle.draw(ctx, p);
                });
                drawConnections(ctx, p);
                startAnimation();
            }

            requestAnimationFrame(() => {
                resize();
                initParticles();
                startAnimation();
            });

            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    resize();
                    initParticles();
                }, 150);
            });

            // Pause rendering when tab is hidden OR Hero scrolls out of view (saves GPU)
            let isHeroVisible = true;
            const hero = document.getElementById('hero');
            if (hero && 'IntersectionObserver' in window) {
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        isHeroVisible = entry.isIntersecting;
                        if (isHeroVisible) {
                            startAnimation();
                        } else {
                            cancelAnimationFrame(animFrameId);
                        }
                    });
                }, { threshold: 0 });
                io.observe(hero);
            }

            document.addEventListener('visibilitychange', () => {
                isTabVisible = !document.hidden;
                if (isTabVisible) {
                    startAnimation();
                } else {
                    cancelAnimationFrame(animFrameId);
                }
            });
        })();

        // ============ Unified Scroll Handler (throttled via rAF) ============
        (function() {
            const navbar = document.getElementById('navbar');
            const backToTop = document.getElementById('backToTop');
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            let ticking = false;

            function onScroll() {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;

                    // Navbar glass effect
                    navbar.classList.toggle('scrolled', scrollY > 50);

                    // Back to top
                    backToTop.classList.toggle('visible', scrollY > 600);

                    // Active nav link (skip on mobile where .nav-links is hidden)
                    if (navLinks.length > 0) {
                        let currentSection = '';
                        sections.forEach(section => {
                            if (scrollY >= section.offsetTop - 120) {
                                currentSection = section.getAttribute('id');
                            }
                        });
                        navLinks.forEach(link => {
                            const isActive = link.getAttribute('href') === '#' + currentSection;
                            link.classList.toggle('active', isActive);
                        });
                    }

                    // --- Scroll Reveal ---
                    const reveals = document.querySelectorAll('.reveal:not(.visible)');
                    const windowHeight = window.innerHeight;
                    reveals.forEach(el => {
                        if (el.getBoundingClientRect().top < windowHeight * 0.88) {
                            el.classList.add('visible');
                        }
                    });

                    // --- Stats counter (fires once when stats section is visible) ---
                    const statsSection = document.getElementById('stats');
                    if (statsSection && statsSection.getBoundingClientRect().top < windowHeight * 0.7) {
                        animateCounters();
                    }

                    ticking = false;
                });
            }

            window.addEventListener('scroll', onScroll, { passive: true });
            // Fire once on load to catch elements already in view
            window.addEventListener('load', () => { ticking = false; onScroll(); });
        })();

        // ============ Stats Counter Animation ============
        function animateCounters() {
            document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
                if (counter.dataset.animated) return;
                counter.dataset.animated = 'true';

                const raw = counter.getAttribute('data-count');
                const target = parseInt(raw, 10);

                // Non-numeric values (e.g. "十佳社团"): display as-is, no "+" suffix
                if (isNaN(target)) {
                    counter.textContent = raw;
                    return;
                }

                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    counter.textContent = current + '+';

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target + '+';
                    }
                }

                requestAnimationFrame(update);
            });
        }

        // ============ Mobile Nav ============
        (function() {
            const hamburger = document.getElementById('hamburger');
            const mobileNav = document.getElementById('mobileNav');

            hamburger.addEventListener('click', () => {
                const isOpen = mobileNav.classList.contains('open');
                if (isOpen) {
                    closeMobileNav();
                } else {
                    mobileNav.classList.add('open');
                    hamburger.classList.add('active');
                    hamburger.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                    // Move focus into the menu so keyboard users land inside it
                    const firstLink = mobileNav.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            });
        })();

        function closeMobileNav() {
            const mobileNav = document.getElementById('mobileNav');
            const hamburger = document.getElementById('hamburger');
            if (!mobileNav.classList.contains('open')) return;
            mobileNav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            // Return focus to the hamburger that opened the menu
            if (document.activeElement && mobileNav.contains(document.activeElement)) {
                hamburger.focus();
            }
        }

        // ============ Keyboard support for role="button" elements ============
        document.addEventListener('keydown', (e) => {
            if (e.target.getAttribute('role') === 'button' && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                e.target.click();
            }
        });

        // ============ Scroll To Section ============
        function scrollToSection(event, sectionId) {
            if (event) event.preventDefault();
            const section = document.getElementById(sectionId);
            if (section) {
                closeMobileNav();
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // ============ FAQ Accordion (independent: each item toggles on its own) ============
        function toggleFAQ(button) {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');

            if (isActive) {
                faqItem.classList.remove('active');
                button.setAttribute('aria-expanded', 'false');
                faqItem.style.removeProperty('--answer-height');
            } else {
                const answer = faqItem.querySelector('.faq-answer-inner');
                if (answer) {
                    faqItem.style.setProperty('--answer-height', answer.scrollHeight + 'px');
                }
                faqItem.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        }

        // ============ QR Code Modal ============
        let modalLastFocus = null;

        function openQRModal() {
            const modal = document.getElementById('qrModal');
            modalLastFocus = document.activeElement;
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }

        function closeQRModal() {
            const modal = document.getElementById('qrModal');
            closeQRZoom(); // 关闭报名弹窗时一并关闭二维码放大层
            modal.classList.remove('open');
            document.body.style.overflow = '';
            // Return focus to the element that opened the modal
            if (modalLastFocus && typeof modalLastFocus.focus === 'function') {
                modalLastFocus.focus();
                modalLastFocus = null;
            }
        }

        // Focus trap: keep Tab cycling within the modal while open
        document.getElementById('qrModal').addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const modal = e.currentTarget;
            const focusable = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        // Close modal on overlay click
        document.getElementById('qrModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeQRModal();
        });

        // Close modal / mobile nav on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const zoomOverlay = document.getElementById('qrZoomOverlay');
                if (zoomOverlay.classList.contains('open')) {
                    closeQRZoom();
                    return;
                }
                const modal = document.getElementById('qrModal');
                if (modal.classList.contains('open')) {
                    closeQRModal();
                    return;
                }
                const mobileNav = document.getElementById('mobileNav');
                if (mobileNav.classList.contains('open')) closeMobileNav();
            }
        });

        // ============ QR Zoom Lightbox (双击二维码放大) ============
        let qrZoomLastFocus = null;

        function openQRZoom(imgSrc) {
            const overlay = document.getElementById('qrZoomOverlay');
            const zoomImg = document.getElementById('qrZoomImg');
            if (!overlay || !zoomImg || !imgSrc) return;
            qrZoomLastFocus = document.activeElement;
            zoomImg.src = imgSrc;
            overlay.classList.add('open');
            const closeBtn = document.getElementById('qrZoomClose');
            if (closeBtn) closeBtn.focus();
        }

        function closeQRZoom() {
            const overlay = document.getElementById('qrZoomOverlay');
            if (!overlay || !overlay.classList.contains('open')) return;
            overlay.classList.remove('open');
            if (qrZoomLastFocus && typeof qrZoomLastFocus.focus === 'function') {
                qrZoomLastFocus.focus();
                qrZoomLastFocus = null;
            }
        }

        // 双击二维码图片放大（报名表二维码补图后同样生效）
        document.querySelectorAll('.qr-placeholder img').forEach(img => {
            img.addEventListener('dblclick', (e) => {
                e.preventDefault();
                openQRZoom(img.src);
            });
        });

        // 点击放大层任意位置或关闭按钮关闭
        document.getElementById('qrZoomOverlay').addEventListener('click', closeQRZoom);
        document.getElementById('qrZoomClose').addEventListener('click', closeQRZoom);

        // ============ CTA Handlers ============
        function handleJoin() {
            openQRModal();
        }

        function handleMoreInfo() {
            const faqSection = document.getElementById('faq');
            if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
