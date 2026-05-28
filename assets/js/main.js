/**
 * Vivek Gupta - Master Portfolio JavaScript Actions
 * Coordinates all interactive behaviors, custom animations, and layout triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DYNAMIC THEME SYSTEM (LOCALSTORAGE PRESERVING)
    // ==========================================
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    
    // Read cached preference or default to dark
    const cachedTheme = localStorage.getItem('vivek-portfolio-theme') || 'dark';
    setTheme(cachedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(targetTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('vivek-portfolio-theme', theme);
        
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-moon';
            themeBtn.setAttribute('aria-label', 'Switch to light theme');
        } else {
            themeIcon.className = 'fa-solid fa-sun';
            themeBtn.setAttribute('aria-label', 'Switch to dark theme');
        }
    }

    // ==========================================
    // 2. LOADING SCREEN FADEOUT
    // ==========================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 500); // Smooth buffer delay
    });

    // Fallback if load takes too long
    setTimeout(() => {
        if (!loader.classList.contains('loaded')) {
            loader.classList.add('loaded');
        }
    }, 3000);

    // ==========================================
    // 3. RESPONSIVE MOBILE NAVIGATION DRAWER
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const menuList = document.getElementById('menu-list');
    const navLinks = document.querySelectorAll('.nav-link-item');

    mobileMenuBtn.addEventListener('click', () => {
        const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !expanded);
        menuList.classList.toggle('active');
        
        // Toggle hamburger icon animation
        const icon = mobileMenuBtn.querySelector('i');
        if (menuList.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close mobile drawer when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuList.classList.contains('active')) {
                menuList.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars-staggered';
            }
        });
    });

    // ==========================================
    // 4. STICKY NAV HEADER & ACTIVE SCROLL TRACKING
    // ==========================================
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky Header Transition
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight Active Link on Scroll
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 150;
            const secHeight = sec.offsetHeight;
            const secId = sec.getAttribute('id');
            
            if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${secId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ==========================================
    // 5. ANIMATED TYPING EFFECT (HERO SECTION)
    // ==========================================
    const words = ["Teenlancer.", "AI Enthusiast.", "Web Developer.", "Robotics Explorer."];
    let i = 0; // Current word index
    let timer;
    const typingSpan = document.getElementById('typewriter-text');

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                typingSpan.innerHTML += word.shift();
            } else {
                // Wait after full word is written before deleting
                timer = setTimeout(deletingEffect, 2000);
                return false;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                typingSpan.innerHTML = word.join("");
            } else {
                // Increment word index and cycle back to zero
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                timer = setTimeout(typingEffect, 500);
                return false;
            }
            timer = setTimeout(loopDeleting, 60);
        };
        loopDeleting();
    }

    if (typingSpan) {
        typingEffect();
    }

    // ==========================================
    // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 7. SKILLS LOADING fill TRANSITION
    // ==========================================
    const skillsSection = document.getElementById('skills');
    const skillFills = document.querySelectorAll('.skill-level-fill');

    if (skillsSection && skillFills.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach(fill => {
                        const targetVal = fill.getAttribute('data-percent');
                        fill.style.width = `${targetVal}%`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillsObserver.observe(skillsSection);
    }

    // ==========================================
    // 8. PROJECT FILTER SYSTEM & ANIMATIONS
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Manage Active Class
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add an elegant exit-scale animation before toggling display state
                card.style.transform = 'scale(0.85)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || filterValue === category) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 250);
            });
        });
    });

    // ==========================================
    // 9. DYNAMIC NUMERICAL COUNTERS (ACHIEVEMENTS)
    // ==========================================
    const achievementsSection = document.getElementById('achievements');
    const statNumbers = document.querySelectorAll('.achievement-number');

    if (achievementsSection && statNumbers.length > 0) {
        const countersObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'), 10);
                        const duration = 2000; // Counter total duration in ms
                        const startTime = performance.now();

                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            // Cubic-out easing function
                            const easedProgress = 1 - Math.pow(1 - progress, 3);
                            const currentVal = Math.floor(easedProgress * target);
                            
                            stat.innerText = currentVal + (target >= 10 ? '+' : '');

                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                stat.innerText = target + '+';
                            }
                        }
                        
                        requestAnimationFrame(updateCounter);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        countersObserver.observe(achievementsSection);
    }

    // ==========================================
    // 10. BACK-TO-TOP BUTTON VISIBILITY & ANCHOR
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // 11. CONTACT FORM INTERCEPTION & DISPATCH MOCK
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page refresh
            
            const submitBtn = document.getElementById('form-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Collect Form Values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            // Clean Status Message
            statusMsg.className = 'form-status';
            statusMsg.style.display = 'none';

            // Local Basic Validation
            if (!name || !email || !message) {
                statusMsg.innerText = 'Please complete all required form fields.';
                statusMsg.classList.add('error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                statusMsg.innerText = 'Please provide a valid email format.';
                statusMsg.classList.add('error');
                return;
            }

            // Animate Loading State on Button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Dispatched Loading...';

            // Simulate Asynchronous SMTP / Email Server Dispatch
            setTimeout(() => {
                // Success Simulation
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                statusMsg.innerText = `Thank you, ${name}! Your transmission has been successfully sent.`;
                statusMsg.classList.add('success');
                
                // Clear Form Fields
                contactForm.reset();
                
                // Fade out success notification after 5 seconds
                setTimeout(() => {
                    statusMsg.style.transition = 'opacity 0.8s ease';
                    statusMsg.style.opacity = '0';
                    setTimeout(() => {
                        statusMsg.style.display = 'none';
                        statusMsg.style.opacity = '1';
                        statusMsg.className = 'form-status';
                    }, 800);
                }, 5000);

            }, 1500); // 1.5 seconds network delay representation
        });
    }

});
