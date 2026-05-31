/**
 * Portfolio Interactive Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }


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
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor-typing");

    if (typedTextSpan && cursorSpan) {
        if (prefersReducedMotion) {
            typedTextSpan.textContent = "Python Full Stack Developer";
            cursorSpan.classList.remove("typing");
        } else {
            const textArray = ["Python Full Stack Developer", "Data Analyst", "Software Developer Engineer", "Problem Solver"];
            const typingDelay = 90;
            const erasingDelay = 45;
            const newTextDelay = 1500; // Pause after full word is typed
            let textArrayIndex = 0;
            let charIndex = 0;

            function type() {
                if (charIndex < textArray[textArrayIndex].length) {
                    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingDelay);
                } 
                else {
                    cursorSpan.classList.remove("typing");
                    setTimeout(erase, newTextDelay);
                }
            }

            function erase() {
                if (charIndex > 0) {
                    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
                    charIndex--;
                    setTimeout(erase, erasingDelay);
                } 
                else {
                    cursorSpan.classList.remove("typing");
                    textArrayIndex++;
                    if(textArrayIndex >= textArray.length) textArrayIndex = 0;
                    setTimeout(type, 600); // Fast next word start
                }
            }

            if(textArray.length) setTimeout(type, 800); // Start sooner
        }
    }


    // --- 10. Particles.js ---
    if (!prefersReducedMotion && window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#d4af37", "#b8860b"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": true },
                "size": { "value": 2, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#d4af37",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
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
            'help': 'Available commands: <br>- <span class="cmd-highlight">whoami</span>: About me<br>- <span class="cmd-highlight">skills</span>: My expertise<br>- <span class="cmd-highlight">projects</span>: View my work<br>- <span class="cmd-highlight">contact</span>: Get in touch<br>- <span class="cmd-highlight">clear</span>: Clear terminal',
            'whoami': 'Selvakumar - Python Full Stack Developer. I build robust Django applications with clean backend architecture.',
            'skills': 'Python, Django, REST APIs, SQL, JavaScript, HTML/CSS, Git.',
            'projects': '1. Enterprise Complaint Management System<br>2. Vetsphere Pet Care Management<br>3. Zomato India Restaurant Analytics',
            'contact': 'Email: contact.s.selvakumar@gmail.com<br>LinkedIn: https://www.linkedin.com/in/contact-selvakumar'
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

                const responseLine = document.createElement('p');
                responseLine.innerHTML = commands[cmd] || `bash: ${cmd}: command not found. Type <span class="cmd-highlight">help</span>`;
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
    
});
