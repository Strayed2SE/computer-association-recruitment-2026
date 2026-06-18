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
                    this.opacity = Math.random() * 0.4 + 0.1;
                    // Randomly assign blue or purple tint
                    const hue = Math.random() > 0.5 ? 230 : 265;
                    this.color = `hsla(${hue}, 80%, 65%, ${this.opacity})`;
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < -10) this.x = width + 10;
                    if (this.x > width + 10) this.x = -10;
                    if (this.y < -10) this.y = height + 10;
                    if (this.y > height + 10) this.y = -10;
                }
                draw(ctx) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
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
            function drawConnections(ctx) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            const opacity = (1 - dist / 120) * 0.12;
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
                if (!isTabVisible) return;
                animFrameId = requestAnimationFrame(animate);
            }

            function animate() {
                ctx.clearRect(0, 0, width, height);
                particles.forEach(p => {
                    p.update();
                    p.draw(ctx);
                });
                drawConnections(ctx);
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

                    // --- Counter Animation ---
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
                }
            });
        })();

        function closeMobileNav() {
            const mobileNav = document.getElementById('mobileNav');
            const hamburger = document.getElementById('hamburger');
            mobileNav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
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

        // ============ FAQ Accordion ============
        function toggleFAQ(button) {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                item.style.removeProperty('--answer-height');
            });

            // Open clicked
            if (!isActive) {
                const answer = faqItem.querySelector('.faq-answer-inner');
                if (answer) {
                    faqItem.style.setProperty('--answer-height', answer.scrollHeight + 'px');
                }
                faqItem.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        }

        // ============ Counter Animation ============
        function animateCounters() {
            document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                if (counter.dataset.animated) return;
                counter.dataset.animated = 'true';

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

        // ============ Toast Notification ============
        function showToast(message, duration = 4000) {
            const existing = document.querySelector('.toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML = `
                <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                ${message}
            `;
            document.body.appendChild(toast);

            requestAnimationFrame(() => toast.classList.add('show'));

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, duration);
        }

        // ============ QR Code Modal ============
        function openQRModal() {
            const modal = document.getElementById('qrModal');
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            // Focus trap: focus the close button
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }

        function closeQRModal() {
            const modal = document.getElementById('qrModal');
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        // Close modal on overlay click
        document.getElementById('qrModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeQRModal();
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('qrModal');
                if (modal.classList.contains('open')) closeQRModal();
            }
        });

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
