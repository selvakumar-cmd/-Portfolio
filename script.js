/**
 * Portfolio Interactive Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // Force prefersReducedMotion to false to guarantee background particles, loading, and scroll animations run on all devices (especially mobile with battery saver)
    const prefersReducedMotion = false;

    // --- 0. Hacker Loader ---
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.loader-progress');
    const loaderMsg = document.getElementById('loader-msg');
    
    const messages = ["AWAKENING MAGIC...", "CONJURING SYSTEMS...", "CASTING UI SPELLS...", "SORCERY COMPLETE"];
    let msgIdx = 0;

    if(loader) {
        // If user prefers reduced motion, skip the cinematic loader animation.
        if (prefersReducedMotion) {
            progress.style.width = '100%';
            loaderMsg.textContent = messages[messages.length - 1];
            loader.classList.add('fade-out');
        } else {
            let width = 0;
            const interval = setInterval(() => {
                width += Math.random() * 25;
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        loader.classList.add('fade-out');
                    }, 500);
                }
                progress.style.width = width + '%';
                if(width > (msgIdx + 1) * 25 && msgIdx < messages.length - 1) {
                    msgIdx++;
                    loaderMsg.textContent = messages[msgIdx];
                }
            }, 150);
        }
    }
    




    // --- 2. Scroll Indicator Logic (Optional/None) ---



    // --- 4. Staggered Cascade Reveal on Scroll (2026 Trend) ---
    const revealElements = document.querySelectorAll('.reveal');
    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            let batchDelay = 0;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const parentGrid = el.closest('.hogwarts-letters-grid, .tarot-deck, .skills-grid, .bento-grid');
                    if (parentGrid) {
                        el.style.transitionDelay = batchDelay + "ms";
                        batchDelay += 130;
                    }
                    el.classList.add('active');
                    observer.unobserve(el);

                    setTimeout(() => {
                        el.style.transitionDelay = '';
                    }, 1000);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }


    // --- 6. Theme Engine & Synced Controls ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    let currentIsLight = localStorage.getItem('theme') === 'light';

    function setTheme(isLight) {
        currentIsLight = isLight;
        if (isLight) {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
        if (typeof initParticles === 'function') initParticles(isLight);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(!document.body.classList.contains('light-mode'));
        });
    }

    if (currentIsLight) {
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // --- 7. Mobile Menu Interactive Drawer ---
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksList = document.querySelector('.nav-links');

    if (menuBtn && navLinksList) {
        const toggleMenu = () => {
            menuBtn.classList.toggle('open');
            navLinksList.classList.toggle('open');
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('open');
                navLinksList.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navLinksList.contains(e.target) && !menuBtn.contains(e.target)) {
                menuBtn.classList.remove('open');
                navLinksList.classList.remove('open');
            }
        });
    }


    // --- 8. Contact Form Handling (Netlify Forms Integration) ---
    const contactForm = document.getElementById('portfolio-contact');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok) {
                    alert('Thanks! Your message has been sent successfully.');
                    contactForm.reset();
                } else {
                    alert('Oops! Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error(error);
                alert('Oops! There was a problem connecting to the server.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

        // --- WhatsApp Button Handler ---
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name')?.value.trim();
                const email = document.getElementById('email')?.value.trim();
                const message = document.getElementById('message')?.value.trim();

                if (!name || !email || !message) {
                    alert('Please fill in all fields (Name, Email, Message) before sending');
                    return;
                }

                // Format message with visitor details
                const whatsappMessage = `*New Contact from Portfolio*\n\n📝 Name: ${name}\n📧 Email: ${email}\n💬 Message: ${message}\n\n---\nHi Selva, I visited your portfolio website and would like to connect with you.`;
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const phoneNumber = '918838038576'; // Your WhatsApp number
                
                // Direct WhatsApp chat link
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

                window.open(whatsappURL, '_blank');
            });
        }
    }

    // --- 9. Typing Effect ---
    (function initTypingEffect() {
        const typedTextSpan = document.querySelector(".typed-text");
        const cursorSpan = document.querySelector(".cursor-typing");

        if (!typedTextSpan || !cursorSpan) return;

        const textArray = ["Python Full Stack Developer", "Data Analyst", "Software Developer Engineer", "Problem Solver"];
        const typingDelay = 80;
        const erasingDelay = 40;
        const newTextDelay = 1400;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex = (textArrayIndex + 1) % textArray.length;
                setTimeout(type, 500);
            }
        }

        setTimeout(type, 600);
    })();


    // --- 10. Particles.js ---
    function initParticles(isLight) {
        if (!prefersReducedMotion && window.particlesJS) {
            const isMobileDevice = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
            const particleCount = isMobileDevice ? 35 : 75;
            const pColor = isLight ? ["#7a5c10", "#b8860b", "#5a4008"] : ["#d4af37", "#b8860b", "#f0d060"];
            const lColor = isLight ? "#7a5c10" : "#d4af37";
            const pOpacity = isLight ? 0.75 : 0.6;
            const lOpacity = isLight ? 0.35 : 0.2;
            const speed = isLight ? 1.5 : 2;

            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": particleCount, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": pColor },
                    "shape": { "type": "circle" },
                    "opacity": { "value": pOpacity, "random": true },
                    "size": { "value": 2.5, "random": true },
                    "line_linked": {
                        "enable": true,
                        "distance": 140,
                        "color": lColor,
                        "opacity": lOpacity,
                        "width": 1
                    },
                    "move": {
                        "enable": true, "speed": speed, "direction": "none",
                        "random": true, "straight": false, "out_mode": "out", "bounce": false
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": { "enable": true, "mode": "grab" },
                        "onclick": { "enable": true, "mode": "push" },
                        "resize": true
                    },
                    "modes": {
                        "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                        "push": { "particles_nb": 4 }
                    }
                },
                "retina_detect": true
            });
        }
    }

    // Initialize on page load with saved theme
    initParticles(currentIsLight);

    // --- 13. Magnetic Buttons ---
    // Premium feel, but avoid overhead for reduced-motion users and on small screens.
    const magneticBtns = document.querySelectorAll('.btn, .social-links-big a, .project-links a');
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

    if (!prefersReducedMotion && !isMobile) {
        magneticBtns.forEach(btn => {
            btn.classList.add('magnetic');
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }




    // --- 14. Scramble Text Effect ---
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const scrambleEls = document.querySelectorAll('.scramble');
    scrambleEls.forEach(el => {
        const fx = new TextScramble(el);
        const originalText = el.innerText;
        el.innerText = '';
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fx.setText(originalText);
                observer.unobserve(el);
            }
        }, { threshold: 0.5 });
        observer.observe(el);
    });

    // --- 15. Bento Glow ---
    const bentoItems = document.querySelectorAll('.bento-item');
    if (!prefersReducedMotion) {
        bentoItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                item.style.setProperty('--mouse-x', `${x}%`);
                item.style.setProperty('--mouse-y', `${y}%`);
            });
        });
    }

    // --- 14. Interactive Terminal Section ---
    const termInput = document.getElementById('inline-terminal-input');
    const termOutput = document.getElementById('inline-terminal-output');
    const termForm = document.getElementById('inline-terminal-form');

    if (termInput && termOutput && termForm) {
        termForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const cmd = termInput.value.trim().toLowerCase();
            if (cmd) {
                processTerminalCommand(cmd, termOutput);
            }
            termInput.value = '';
        });
    }

    function processTerminalCommand(cmd, outputDiv) {
        // Echo command
        const cmdEcho = document.createElement('p');
        cmdEcho.innerHTML = `<span class="prompt">selvakumar@cmd:~$</span> ${cmd}`;
        outputDiv.appendChild(cmdEcho);

        const response = document.createElement('p');
        
        switch(cmd) {
            case 'help':
                response.innerHTML = `Available commands: <br>
                <span class="cmd-highlight">whoami</span> - Display my bio<br>
                <span class="cmd-highlight">skills</span> - List core technical skills<br>
                <span class="cmd-highlight">projects</span> - View my top projects<br>
                <span class="cmd-highlight">contact</span> - Get my email<br>
                <span class="cmd-highlight">spells</span> - Wizarding Technomancy spells<br>
                <span class="cmd-highlight">accio resume</span> - Download resume<br>
                <span class="cmd-highlight">lumos</span> - Light mode<br>
                <span class="cmd-highlight">nox</span> - Dark mode<br>
                <span class="cmd-highlight">clear</span> - Clear the terminal`;
                break;
            case 'whoami':
                response.textContent = "Selvakumar S (The One Selva Harrington) — Full Stack Developer & Technomancer.";
                break;
            case 'skills':
                response.innerHTML = "Python, Django, Java, Spring Boot, JavaScript, SQL, AWS, Docker, Git.";
                break;
            case 'projects':
                response.innerHTML = "1. AI Resume Builder<br>2. SLA Ticket Automation<br>3. Zomato Data Analytics<br>4. Vetsphere Clinic Management";
                break;
            case 'contact':
                response.innerHTML = "Email: <a href='mailto:contact.s.selvakumar@gmail.com' style='color:var(--accent-primary)'>contact.s.selvakumar@gmail.com</a>";
                break;
            case 'spells':
                response.innerHTML = "📜 <strong>Technomancy Spells:</strong><br>- <span class='cmd-highlight'>accio resume</span>: Summon PDF Resume<br>- <span class='cmd-highlight'>lumos</span>: Illuminate realm (Light)<br>- <span class='cmd-highlight'>nox</span>: Cast shadows (Dark)<br>- <span class='cmd-highlight'>alohomora</span>: Unlock secret lore";
                break;
            case 'accio':
            case 'accio resume':
                response.textContent = "✨ Accio Resume! Summoning Selvakumar's Resume now...";
                {
                    const link = document.createElement('a');
                    link.href = 'Selva kumar.S.pdf';
                    link.download = 'Selva kumar.S.pdf';
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                break;
            case 'lumos':
                response.textContent = "✨ Lumos Maxima! Illuminating the realm...";
                setTheme(true);
                break;
            case 'nox':
                response.textContent = "🌑 Nox! Casting shadows across the realm...";
                setTheme(false);
                break;
            case 'alohomora':
                response.textContent = '🗝️ Alohomora! "Any sufficiently advanced technology is indistinguishable from magic." — Selva Harrington';
                break;
            case 'clear':
                outputDiv.innerHTML = '';
                return;
            case 'sudo':
                response.textContent = "Nice try, but you are not in the sudoers file. This incident will be reported. 🚨";
                break;
            default:
                response.innerHTML = `Command not found: ${cmd}. Type <span class="cmd-highlight">help</span> or <span class="cmd-highlight">spells</span>.`;
        }
        
        response.style.color = "var(--text-secondary)";
        response.style.marginBottom = "15px";
        outputDiv.appendChild(response);
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    // --- 15. Animated Proficiency Bars ---
    function animateProfBars() {
        document.querySelectorAll('.prof-fill').forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth + '%';
        });
    }

    // Trigger on scroll using IntersectionObserver
    const profSection = document.querySelector('.proficiency-bars');
    if (profSection) {
        const profObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProfBars();
                    profObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        profObserver.observe(profSection);
    }

    // --- 16. GitHub Mini Stats via API ---
    async function fetchGitHubStats() {
        const reposEl = document.getElementById('gh-repos');
        const followersEl = document.getElementById('gh-followers');
        const starsEl = document.getElementById('gh-stars');

        try {
            const res = await fetch('https://api.github.com/users/selvakumar-cmd');
            if (res.ok) {
                const data = await res.json();
                if (typeof data.public_repos === 'number' && reposEl) reposEl.textContent = data.public_repos;
                if (typeof data.followers === 'number' && followersEl) followersEl.textContent = data.followers;
            }

            // Fetch total stars across repos
            const reposRes = await fetch('https://api.github.com/users/selvakumar-cmd/repos?per_page=100');
            if (reposRes.ok) {
                const repos = await reposRes.json();
                if (Array.isArray(repos) && starsEl) {
                    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
                    starsEl.textContent = totalStars;
                }
            }
        } catch (e) {
            if (reposEl && (reposEl.textContent === '...' || reposEl.textContent === '--')) reposEl.textContent = '8';
            if (starsEl && (starsEl.textContent === '...' || starsEl.textContent === '--')) starsEl.textContent = '0';
            if (followersEl && (followersEl.textContent === '...' || followersEl.textContent === '--')) followersEl.textContent = '0';
        }
    }
    fetchGitHubStats();

    // =========================================================
    // 2026 ULTRA-LUXURY INTERACTIVE ENGINE (Awwwards / Linear)
    // =========================================================

    // --- A. Unified Ultra-Smooth 60/120 FPS Scroll Controller ---
    const nav = document.getElementById('main-nav');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Cache section positions to avoid layout thrashing during scroll
    let sectionOffsets = [];
    function cacheSectionOffsets() {
        sectionOffsets = Array.from(sections).map(sec => ({
            id: sec.id,
            top: sec.offsetTop
        }));
    }
    cacheSectionOffsets();
    window.addEventListener('resize', cacheSectionOffsets, { passive: true });

    let isScrollTicking = false;
    function onScrollUpdate() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // 1. Navbar scrolled class
        if (nav) {
            if (scrollTop > 50) {
                if (!nav.classList.contains('scrolled')) nav.classList.add('scrolled');
            } else {
                if (nav.classList.contains('scrolled')) nav.classList.remove('scrolled');
            }
        }

        // 2. Active nav link tracking using cached offsets (zero forced reflow!)
        let current = '';
        for (let i = sectionOffsets.length - 1; i >= 0; i--) {
            if (scrollTop >= (sectionOffsets[i].top - 220)) {
                current = sectionOffsets[i].id;
                break;
            }
        }
        if (current) {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${current}`;
                if (isActive && !link.classList.contains('active')) link.classList.add('active');
                else if (!isActive && link.classList.contains('active')) link.classList.remove('active');
            });
        }

        // 3. Top scroll progress bar
        if (scrollProgressBar) {
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            scrollProgressBar.style.width = scrollPercent + '%';
        }

        isScrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            requestAnimationFrame(onScrollUpdate);
            isScrollTicking = true;
        }
    }, { passive: true });// --- B. Interactive Spotlight Glow Cursor Tracker (Bento & Cards) ---
    const spotlightCards = document.querySelectorAll('.bento-item, .project-card, .highlight-item, .skill-category');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
    });

    // --- C. 1-Click Copy Email with Interactive Glass Toast ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const toastNotify = document.getElementById('toast-notify');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    let toastTimeout;

    function showGlassToast(title, desc) {
        if (!toastNotify) return;
        if (toastTitle) toastTitle.textContent = title;
        if (toastDesc) toastDesc.textContent = desc;

        toastNotify.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotify.classList.remove('show');
        }, 3200);
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'contact.s.selvakumar@gmail.com';
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(() => {
                    showGlassToast('✨ Email Copied!', 'contact.s.selvakumar@gmail.com copied to clipboard.');
                }).catch(() => {
                    showGlassToast('📬 Contact Email', 'contact.s.selvakumar@gmail.com');
                });
            } else {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = email;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showGlassToast('✨ Email Copied!', 'contact.s.selvakumar@gmail.com copied to clipboard.');
                } catch (e) {
                    showGlassToast('📬 Contact Email', 'contact.s.selvakumar@gmail.com');
                }
                document.body.removeChild(textarea);
            }
        });
    }

    // --- D. Interactive Lumos Wand Particle Trail (Technomancy Magic) ---
    if (!prefersReducedMotion && !isMobile) {
        let lastParticleTime = 0;
        const particleColors = ['#d4af37', '#ffd700', '#38bdf8', '#7dd3fc', '#ffffff'];

        window.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastParticleTime < 30) return; // Throttle to maintain 60fps
            lastParticleTime = now;

            const particle = document.createElement('div');
            particle.className = 'lumos-sparkle';
            const size = Math.floor(Math.random() * 5) + 3; // 3px to 7px
            const color = particleColors[Math.floor(Math.random() * particleColors.length)];

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${e.clientX}px`;
            particle.style.top = `${e.clientY}px`;
            particle.style.background = color;
            particle.style.color = color;
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle && particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 750);
        }, { passive: true });
    }

    // =========================================================
    // 🧙‍♂️ HOGWARTS MAGICAL SYSTEM — Pure Harry Potter Vibe
    // =========================================================
    // Clean up any previously saved house theme
    try {
        localStorage.removeItem('hogwarts-house');
        ['house-gryffindor', 'house-ravenclaw', 'house-slytherin', 'house-hufflepuff'].forEach(c => document.body.classList.remove(c));
    } catch (e) {}

    // --- F. Wand Click Spell Burst (click anywhere) ---
    const spellColors = ['#ffd700', '#38bdf8', '#a78bfa', '#f472b6', '#34d399'];

    function fireWandBurst(x, y, color) {
        const burst = document.createElement('div');
        burst.className = 'wand-burst';
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;
        burst.style.color = color || spellColors[Math.floor(Math.random() * spellColors.length)];
        document.body.appendChild(burst);
        setTimeout(() => {
            if (burst && burst.parentNode) burst.parentNode.removeChild(burst);
        }, 700);
    }

    if (!isMobile) {
        document.addEventListener('click', (e) => {
            // Only fire on non-interactive or background clicks
            const tag = e.target.tagName.toLowerCase();
            if (['input', 'textarea', 'select'].includes(tag)) return;
            const color = spellColors[Math.floor(Math.random() * spellColors.length)];
            fireWandBurst(e.clientX, e.clientY, color);
        });
    }

    // --- G. Marauder's Map Footer Easter Egg ---
    const mischiefBtn = document.getElementById('mischief-btn');
    const marauderQuote = document.getElementById('marauder-quote');

    const marauderLines = [
        '"I solemnly swear that I am up to no good."',
        '"Mischief Managed. 🗺️"',
        '"Messrs. Moony, Wormtail, Padfoot & Prongs are proud to present..."',
        '"The Marauder\'s Map: it shows every inch of Hogwarts, every footstep."',
        '"...And with that, the map goes blank." ✨'
    ];
    let marauderIdx = 0;
    let mischiefManaged = false;

    if (mischiefBtn && marauderQuote) {
        mischiefBtn.addEventListener('click', () => {
            mischiefManaged = !mischiefManaged;
            if (mischiefManaged) {
                mischiefBtn.textContent = 'I Solemnly Swear... 🪄';
                // Cycle through quotes
                marauderIdx = 0;
                const cycleQuotes = setInterval(() => {
                    marauderIdx++;
                    if (marauderIdx >= marauderLines.length) {
                        clearInterval(cycleQuotes);
                        mischiefManaged = false;
                        mischiefBtn.textContent = 'Mischief Managed 🪄';
                        marauderIdx = 0;
                        return;
                    }
                    if (marauderQuote) marauderQuote.textContent = marauderLines[marauderIdx];
                }, 1600);
            } else {
                if (marauderQuote) marauderQuote.textContent = marauderLines[0];
                mischiefBtn.textContent = 'Mischief Managed 🪄';
            }
            fireWandBurst(
                mischiefBtn.getBoundingClientRect().left + mischiefBtn.getBoundingClientRect().width / 2,
                mischiefBtn.getBoundingClientRect().top,
                '#ffd700'
            );
        });
    }

    // =========================================================
    // 🎬 HERO CINEMATIC VIDEO & AURORA ENGINE
    // =========================================================
    const heroCanvas = document.getElementById('hero-aurora-canvas');
    const heroSection = document.getElementById('home');
    let heroAnimFrame = null;
    let heroVisible = true;

    if (heroCanvas && heroSection) {
        const ctx = heroCanvas.getContext('2d');
        let width = heroCanvas.width = heroSection.offsetWidth;
        let height = heroCanvas.height = heroSection.offsetHeight;

        window.addEventListener('resize', () => {
            if (heroSection && heroCanvas) {
                width = heroCanvas.width = heroSection.offsetWidth;
                height = heroCanvas.height = heroSection.offsetHeight;
            }
        }, { passive: true });

        // Cosmic stardust particles
        const stars = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height * 0.75,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.02 + 0.005,
            drift: (Math.random() - 0.5) * 0.3
        }));

        let time = 0;

        function getHouseAuroraColors() {
            return ['rgba(212, 175, 55, 0.25)', 'rgba(56, 189, 248, 0.2)', 'rgba(255, 215, 0, 0.3)'];
        }

        function drawHeroAurora() {
            if (!heroVisible) return;
            ctx.clearRect(0, 0, width, height);

            time += 0.008;
            const colors = getHouseAuroraColors();

            // Draw 3 atmospheric undulating waves
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0, height * 0.45);
                
                const grad = ctx.createLinearGradient(0, 0, width, height * 0.6);
                grad.addColorStop(0, colors[i % colors.length]);
                grad.addColorStop(0.5, colors[(i + 1) % colors.length]);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;

                for (let x = 0; x <= width; x += 30) {
                    const wave1 = Math.sin(x * 0.0025 + time + i * 1.5) * 45;
                    const wave2 = Math.cos(x * 0.004 - time * 0.8 + i) * 25;
                    const y = height * (0.28 + i * 0.12) + wave1 + wave2;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(width, 0);
                ctx.lineTo(0, 0);
                ctx.closePath();
                ctx.fill();
            }

            // Draw twinkling stardust
            stars.forEach(s => {
                s.alpha += Math.sin(time * 5 + s.x) * s.speed;
                s.x += s.drift;
                if (s.x < 0) s.x = width;
                if (s.x > width) s.x = 0;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 235, 180, ${Math.max(0.1, Math.min(1, s.alpha))})`;
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            heroAnimFrame = requestAnimationFrame(drawHeroAurora);
        }

        // IntersectionObserver to pause when not viewing hero (battery/CPU friendly)
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                heroVisible = entry.isIntersecting;
                if (heroVisible) {
                    cancelAnimationFrame(heroAnimFrame);
                    heroAnimFrame = requestAnimationFrame(drawHeroAurora);
                }
            });
        }, { threshold: 0.1 });
        heroObserver.observe(heroSection);

        drawHeroAurora();
    }

});


