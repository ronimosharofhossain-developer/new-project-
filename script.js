document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open on mobile
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* ==========================================================================
       THEME TOGGLE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Get preferred theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Trigger custom animations or event details if needed
            showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'success');
        });
    }

    /* ==========================================================================
       HEADER SCROLL EFFECT
       ========================================================================== */
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once initially to set correct state

    /* ==========================================================================
       HERO TYPING CAROUSEL
       ========================================================================== */
    const typingTextElement = document.getElementById('typing-text');
    const roles = ["Full-Stack Developer", "Creative UI/UX Designer", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeAnimation = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Delete characters
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deletion
        } else {
            // Write characters
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing
        }

        // Handle states transition
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of role
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before starting next role
        }

        setTimeout(typeAnimation, typingSpeed);
    };

    if (typingTextElement) {
        setTimeout(typeAnimation, 1000);
    }

    /* ==========================================================================
       INTERACTIVE SKILLS TAG PREVIEW
       ========================================================================== */
    const skillTags = document.querySelectorAll('.skill-tag');
    const skillPreviewWidget = document.getElementById('skill-preview-widget');
    const widgetPercentage = document.getElementById('widget-percentage');
    const widgetBarFill = document.getElementById('widget-bar-fill');
    const widgetTitle = skillPreviewWidget ? skillPreviewWidget.querySelector('.widget-title') : null;

    if (skillTags.length > 0 && skillPreviewWidget && widgetPercentage && widgetBarFill) {
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Remove active class from all other tags
                skillTags.forEach(t => t.classList.remove('active-tag'));
                
                // Add active class to clicked tag
                tag.classList.add('active-tag');
                
                const skillName = tag.textContent.trim();
                const skillLevel = tag.getAttribute('data-level');
                
                // Animate progress bar fill and update text
                widgetTitle.textContent = `${skillName} Competency`;
                widgetPercentage.textContent = skillLevel;
                widgetBarFill.style.width = skillLevel;
            });
        });
        
        // Auto-select first skill on load
        skillTags[0].click();
    }

    /* ==========================================================================
       PROJECTS FILTERING SYSTEM
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state on buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hidden');
                        // Small timeout to allow transition to trigger
                        setTimeout(() => {
                            card.style.transform = 'scale(1) translateY(0)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.transform = 'scale(0.85) translateY(20px)';
                        card.style.opacity = '0';
                        // Wait for transition before hiding layout element
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       INTERACTIVE 3D CARD TILT EFFECT (Hero)
       ========================================================================== */
    const tiltCard = document.getElementById('hero-tilt-card');
    
    if (tiltCard) {
        const cardGlow = tiltCard.querySelector('.card-glow');
        
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the card
            const y = e.clientY - rect.top;  // y coordinate inside the card
            
            const cardWidth = rect.width;
            const cardHeight = rect.height;
            
            // Calculate rotate degrees based on position (max 12 deg tilt)
            const rotateY = ((x - cardWidth / 2) / (cardWidth / 2)) * 12;
            const rotateX = -((y - cardHeight / 2) / (cardHeight / 2)) * 12;
            
            // Update card CSS transform properties
            tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Update light glow reflection coordinates
            if (cardGlow) {
                const glowX = (x / cardWidth) * 100;
                const glowY = (y / cardHeight) * 100;
                cardGlow.style.background = `radial-gradient(600px circle at ${glowX}% ${glowY}%, var(--glow-color), transparent 40%)`;
            }
        });
        
        tiltCard.addEventListener('mouseleave', () => {
            // Reset to default coordinates
            tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (cardGlow) {
                cardGlow.style.background = `radial-gradient(800px circle at 50% 50%, var(--glow-color), transparent 40%)`;
            }
        });
    }

    /* ==========================================================================
       SCROLL REVEAL (FADE IN UP)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger initial check on load

    /* ==========================================================================
       SCROLL SPY (ACTIVE NAVIGATION HIGHLIGHT)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navMenuLinks = document.querySelectorAll('.nav-link');

    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // offset matches header heights

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navMenuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Call initially

    /* ==========================================================================
       CONTACT FORM VALIDATION & MOCK SUBMIT
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                // Clear existing error states
                input.classList.remove('invalid');
                
                // Standard checks
                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    isFormValid = false;
                } else if (input.type === 'email') {
                    // Basic email pattern verification
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        input.classList.add('invalid');
                        isFormValid = false;
                    }
                }
            });

            if (isFormValid) {
                // Capture data to log
                const formData = {
                    name: document.getElementById('form-name').value,
                    email: document.getElementById('form-email').value,
                    subject: document.getElementById('form-subject').value,
                    message: document.getElementById('form-message').value
                };
                
                console.log('Form submission received:', formData);
                
                // Show success visual feedback
                showToast("Thank you! Your message was sent successfully.", "success");
                
                // Reset fields
                contactForm.reset();
                
                // Reset floating labels by blurring elements
                inputs.forEach(input => input.blur());
            } else {
                showToast("Please correct the errors in the form.", "error");
            }
        });

        // Add real-time change validation clearing
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid') && input.value.trim()) {
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(input.value.trim())) {
                            input.classList.remove('invalid');
                        }
                    } else {
                        input.classList.remove('invalid');
                    }
                }
            });
        });
    }

    /* ==========================================================================
       TOAST NOTIFICATION TRIGGER
       ========================================================================== */
    window.showToast = function(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Define appropriate Lucide icons
        const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
        
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Render icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                attrs: {
                    class: ['toast-icon']
                },
                nameAttr: 'data-lucide'
            });
        }
        
        // Trigger show animation transition
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            // Remove from DOM after transition completes
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    };
});
