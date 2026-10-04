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



    // --- 3. Navbar Scroll Effect ---
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });


    // --- 4. Reveal on Scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Show all immediately for reduced-motion users.
        revealElements.forEach(el => el.classList.add('active'));
    }


    // --- 5. Active Link Tracking ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });



    // --- 6. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    let startLight = false;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        if (isLight) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
        
        // Re-initialize particles with theme colors
        if (typeof initParticles === 'function') {
            initParticles(isLight);
        }
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
        startLight = true;
    }

    // --- Live Timezone Badge ---
    function updateLiveTime() {
        const timeElement = document.getElementById('live-time');
        if (timeElement) {
            const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const timeString = new Intl.DateTimeFormat('en-US', options).format(new Date());
            timeElement.textContent = `IST ${timeString}`;
        }
    }
    updateLiveTime();
    setInterval(updateLiveTime, 1000);
    // --- 7. Mobile Menu (Simple implementation) ---
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksList = document.querySelector('.nav-links');
    
    // For a more advanced menu, we'd add logic here to toggle visibility on mobile.
    // For now, it's a placeholder for future enhancement.


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
            // Light mode: darker bronze/gold so particles are visible on cream bg
            // Dark mode: bright gold so particles glow on black bg
            const pColor  = isLight ? ["#7a5c10", "#b8860b", "#5a4008"] : ["#d4af37", "#b8860b", "#f0d060"];
            const lColor  = isLight ? "#7a5c10" : "#d4af37";
            const pOpacity = isLight ? 0.75 : 0.6;
            const lOpacity = isLight ? 0.35 : 0.2;
            const speed    = isLight ? 1.5  : 2;

            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 90, "density": { "enable": true, "value_area": 800 } },
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
    initParticles(startLight);

    // --- 11. Skills Radar Chart ---
    const ctx = document.getElementById('skillsRadar');
    if (ctx && window.Chart) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Python', 'Django', 'SQL', 'JavaScript', 'HTML/CSS', 'REST APIs'],
                datasets: [{
                    label: 'Skill Proficiency',
                    data: [90, 85, 80, 75, 85, 70],
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    pointBackgroundColor: 'rgba(168, 85, 247, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(168, 85, 247, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#a1a1aa', font: { size: 12, family: "'Inter', sans-serif" } },
                        ticks: { display: false, min: 0, max: 100 }
                    }
                },
                plugins: { legend: { display: false } },
                maintainAspectRatio: false
            }
        });
    }

    // --- 12. Terminal Mode ---
    const terminalBtn = document.getElementById('terminal-btn');
    const terminalModal = document.getElementById('terminal-modal');
    const terminalClose = document.getElementById('terminal-close');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    if (terminalBtn && terminalModal) {
        terminalBtn.addEventListener('click', () => {
            terminalModal.classList.add('active');
            setTimeout(() => terminalInput.focus(), 500);
        });
        terminalClose.addEventListener('click', () => {
            terminalModal.classList.remove('active');
        });
        
        const commands = {
            'help': 'Available commands: <br>- <span class="cmd-highlight">whoami</span>: About me<br>- <span class="cmd-highlight">skills</span>: My expertise<br>- <span class="cmd-highlight">projects</span>: View my work<br>- <span class="cmd-highlight">contact</span>: Get in touch<br>- <span class="cmd-highlight">spells</span>: Technomancy magical incantations<br>- <span class="cmd-highlight">accio resume</span>: Summon resume<br>- <span class="cmd-highlight">lumos</span>: Turn on light mode<br>- <span class="cmd-highlight">nox</span>: Turn on dark mode<br>- <span class="cmd-highlight">alohomora</span>: Unlock secret lore<br>- <span class="cmd-highlight">clear</span>: Clear terminal',
            'whoami': 'Selvakumar S (The One Selva Harrington) — Python Full Stack Developer & Technomancer specializing in Django, Java, Spring Boot and scalable architectures.',
            'skills': 'Python, Django, Java, Spring Boot, REST APIs, PostgreSQL, SQLite, JavaScript, Git/GitHub, Docker, Netlify, Render.',
            'projects': '1. Enterprise SLA Complaint Management<br>2. Vetsphere Pet Care Architecture<br>3. Zomato India Restaurant Analytics<br>4. AI Resume Builder System',
            'contact': 'Email: contact.s.selvakumar@gmail.com<br>LinkedIn: https://www.linkedin.com/in/contact-selvakumar',
            'spells': '📜 Technomancy Grimoire Spells:<br>- <span class="cmd-highlight">accio resume</span>: Summon PDF Resume<br>- <span class="cmd-highlight">lumos</span>: Illuminate realm (Light mode)<br>- <span class="cmd-highlight">nox</span>: Cast shadows (Dark mode)<br>- <span class="cmd-highlight">alohomora</span>: Unlock secret technomancy lore<br>- <span class="cmd-highlight">expelliarmus</span>: Disarm bugs and system anomalies',
            'accio': '✨ Accio Resume! Summoning Selvakumar\'s Resume now...',
            'accio resume': '✨ Accio Resume! Summoning Selvakumar\'s Resume now...',
            'lumos': '✨ Lumos Maxima! Illuminating the Technomancy realm...',
            'nox': '🌑 Nox! Casting shadows across the realm...',
            'alohomora': '🗝️ Alohomora! Unlocked Secret Lore: "Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke / Selva Harrington',
            'expelliarmus': '⚡ Expelliarmus! Disarming 100% of runtime exceptions, bugs, and latency.'
        };

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                terminalInput.value = '';
                
                if(cmd === '') return;
                
                const cmdLine = document.createElement('p');
                cmdLine.innerHTML = `<span class="prompt">selvakumar@portfolio:~$</span> ${cmd}`;
                terminalOutput.appendChild(cmdLine);

                if (cmd === 'clear') {
                    terminalOutput.innerHTML = '';
                    return;
                }

                // Spell handling side-effects
                if (cmd === 'accio' || cmd === 'accio resume') {
                    const link = document.createElement('a');
                    link.href = 'Selva kumar.S.pdf';
                    link.download = 'Selva kumar.S.pdf';
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else if (cmd === 'lumos') {
                    document.body.classList.remove('dark-mode');
                    document.body.classList.add('light-mode');
                    localStorage.setItem('theme', 'light');
                    if (typeof initParticles === 'function') initParticles(true);
                } else if (cmd === 'nox') {
                    document.body.classList.remove('light-mode');
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                    if (typeof initParticles === 'function') initParticles(false);
                }

                const responseLine = document.createElement('p');
                responseLine.innerHTML = commands[cmd] || `bash: ${cmd}: command not found. Type <span class="cmd-highlight">help</span> or <span class="cmd-highlight">spells</span>`;
                terminalOutput.appendChild(responseLine);

                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });
    }

    // --- 13. Magnetic Buttons ---
    // Premium feel, but avoid overhead for reduced-motion users and on small screens.
    const magneticBtns = document.querySelectorAll('.btn, .social-links-big a, .project-links a, .terminal-toggle-btn');
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
        // --- 13. GitHub Activity Calendar ---
    if (typeof GitHubCalendar !== 'undefined') {
        GitHubCalendar(".calendar", "selvakumar-cmd", {
            responsive: true,
            tooltips: true
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
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                if (typeof initParticles === 'function') initParticles(true);
                break;
            case 'nox':
                response.textContent = "🌑 Nox! Casting shadows across the realm...";
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                if (typeof initParticles === 'function') initParticles(false);
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
        try {
            const res = await fetch('https://api.github.com/users/selvakumar-cmd');
            const data = await res.json();
            const reposEl = document.getElementById('gh-repos');
            const followersEl = document.getElementById('gh-followers');
            if (reposEl) reposEl.textContent = data.public_repos ?? '--';
            if (followersEl) followersEl.textContent = data.followers ?? '--';

            // Fetch total stars across repos
            const reposRes = await fetch('https://api.github.com/users/selvakumar-cmd/repos?per_page=100');
            const repos = await reposRes.json();
            const totalStars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + r.stargazers_count, 0) : '--';
            const starsEl = document.getElementById('gh-stars');
            if (starsEl) starsEl.textContent = totalStars;
        } catch (e) {
            ['gh-repos', 'gh-stars', 'gh-followers'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '--';
            });
        }
    }
    fetchGitHubStats();

    // =========================================================
    // 2026 ULTRA-LUXURY INTERACTIVE ENGINE (Awwwards / Linear)
    // =========================================================

    // --- A. Precision Top Scroll Progress Bar & Floating Quick Dock ---
    const scrollProgressBar = document.getElementById('scroll-progress');
    const quickDock = document.getElementById('quick-dock');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollProgressBar) {
            scrollProgressBar.style.width = scrollPercent + '%';
        }

        // Show quick dock after scrolling past hero section (350px)
        if (quickDock) {
            if (scrollTop > 350) {
                quickDock.classList.add('visible');
            } else {
                quickDock.classList.remove('visible');
            }
        }
    }, { passive: true });

    // --- B. Interactive Spotlight Glow Cursor Tracker (Bento & Cards) ---
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

    // --- E. Sorting Hat Ceremony & Hogwarts House Theme Switcher ---
    const sortingHatModal = document.getElementById('sorting-hat-modal');
    const sortingHatBtn = document.getElementById('sorting-hat-btn');
    const sortingClose = document.getElementById('sorting-close');
    const dockSortingBtn = document.getElementById('dock-sorting-btn');
    const hatSpeech = document.getElementById('hat-speech');
    const currentHouseName = document.getElementById('current-house-name');
    const houseBtns = document.querySelectorAll('.house-btn');

    const houseData = {
        gryffindor: {
            name: 'Gryffindor Gold & Crimson',
            class: 'house-gryffindor',
            speech: '"Ah... I sense great courage here! Daring, nerve, and chivalry — the builder who ships bold architectures and never backs down from a deadline. GRYFFINDOR! ⚡🦁"',
            toast: '🦁 Welcome, Gryffindor! Courage & Bold Code guide you.'
        },
        ravenclaw: {
            name: 'Ravenclaw Sapphire & Bronze',
            class: 'house-ravenclaw',
            speech: '"Excellent... a keen and curious mind! You value clean architecture, elegant solutions, and elegant API design above all. RAVENCLAW! 🦅✨"',
            toast: '🦅 Welcome, Ravenclaw! Wit & Wisdom illuminate your code.'
        },
        slytherin: {
            name: 'Slytherin Emerald & Silver',
            class: 'house-slytherin',
            speech: '"Cunning resourcefulness! You build systems that scale to millions, optimise every query, and always find the most efficient path. SLYTHERIN! 🐍💚"',
            toast: '🐍 Welcome, Slytherin! Ambition & Cunning drive your systems.'
        },
        hufflepuff: {
            name: 'Hufflepuff Gold & Black',
            class: 'house-hufflepuff',
            speech: '"Steadfast and loyal! Patient, fair, and dedicated — you deliver consistent, resilient code and never leave a teammate behind. HUFFLEPUFF! 🦡🌟"',
            toast: '🦡 Welcome, Hufflepuff! Loyalty & Hard Work define your craft.'
        }
    };

    const houseClasses = ['house-gryffindor', 'house-ravenclaw', 'house-slytherin', 'house-hufflepuff'];
    let savedHouse = localStorage.getItem('hogwarts-house') || null;

    function openSortingHat() {
        if (!sortingHatModal) return;
        sortingHatModal.classList.add('active');
        if (hatSpeech) hatSpeech.textContent = '"Step forth! Let me inspect your code and ambition to reveal your true Hogwarts House..."';
        // Restore saved selection
        houseBtns.forEach(btn => {
            btn.classList.remove('active');
            if (savedHouse && btn.dataset.house === savedHouse) btn.classList.add('active');
        });
        if (savedHouse && houseData[savedHouse]) {
            if (currentHouseName) currentHouseName.textContent = houseData[savedHouse].name;
        }
        document.body.style.overflow = 'hidden';
    }

    function closeSortingHat() {
        if (!sortingHatModal) return;
        sortingHatModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sortingHatBtn) sortingHatBtn.addEventListener('click', openSortingHat);
    if (dockSortingBtn) dockSortingBtn.addEventListener('click', openSortingHat);
    if (sortingClose) sortingClose.addEventListener('click', closeSortingHat);
    if (sortingHatModal) {
        sortingHatModal.addEventListener('click', (e) => {
            if (e.target === sortingHatModal) closeSortingHat();
        });
    }

    houseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const house = btn.dataset.house;
            const data = houseData[house];
            if (!data) return;

            // Remove all previous house classes
            houseClasses.forEach(c => document.body.classList.remove(c));
            document.body.classList.add(data.class);
            localStorage.setItem('hogwarts-house', house);
            savedHouse = house;

            // Animate hat speech
            if (hatSpeech) {
                hatSpeech.style.opacity = '0';
                setTimeout(() => {
                    hatSpeech.textContent = data.speech;
                    hatSpeech.style.transition = 'opacity 0.5s ease';
                    hatSpeech.style.opacity = '1';
                }, 200);
            }

            // Update active state
            houseBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update display name
            if (currentHouseName) currentHouseName.textContent = data.name;

            // Fire spell burst from button
            const rect = btn.getBoundingClientRect();
            fireWandBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#d4af37');

            // Close after 2.4s
            setTimeout(closeSortingHat, 2400);

            // Show glass toast
            showGlassToast(data.toast.substring(0, 30), data.toast.substring(30));
        });
    });

    // Restore house on page load
    if (savedHouse && houseData[savedHouse]) {
        houseClasses.forEach(c => document.body.classList.remove(c));
        document.body.classList.add(houseData[savedHouse].class);
        if (currentHouseName) currentHouseName.textContent = houseData[savedHouse].name;
    }

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

});

