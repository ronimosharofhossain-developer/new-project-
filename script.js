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
                
                // Reset errors and styles
                inputs.forEach(input => input.classList.remove('invalid'));
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
