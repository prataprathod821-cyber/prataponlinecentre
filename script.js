/**
 * @fileoverview Production-ready Vanilla JavaScript for Pratap Online Centre
 * @version 1.0.0
 * @author Senior JavaScript Engineer
 * @description Handles UI interactions, accessibility, performance, and state management.
 */

"use strict";

// ==========================================================================
// 1. GLOBAL FUNCTIONS (For inline HTML event handlers)
// ==========================================================================

/**
 * Opens a modal by its ID and traps focus/disables body scroll.
 * @param {string} id - The ID of the modal to open.
 */
window.openModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus management: shift focus to close button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) closeBtn.focus();
    } else {
        alert('या सेवेची सविस्तर माहिती लवकरच अपडेट केली जाईल. कृपया संपर्क करा.');
    }
};

/**
 * Closes a modal if the background overlay is clicked.
 * @param {Event} e - The click event.
 * @param {string} id - The ID of the modal.
 */
window.closeModal = function (e, id) {
    if (e.target.id === id) {
        window.closeModalForce(id);
    }
};

/**
 * Force closes a modal via the close button or escape key.
 * @param {string} id - The ID of the modal.
 */
window.closeModalForce = function (id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modal.setAttribute('aria-hidden', 'true');
    }
};

/**
 * Triggers the native Web Share API or falls back to clipboard.
 */
window.shareWebsite = async function () {
    const shareData = {
        title: 'प्रताप ऑनलाइन सेंटर',
        text: 'आमला खुर्द मधील सर्वोत्तम डिजिटल सेवा आणि शासकीय योजनांचे केंद्र! संचालक: प्रताप रामदास राठोड.',
        url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.warn('Share cancelled or failed:', err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('लिंक कॉपी केली आहे! (Link Copied!)');
        } catch (err) {
            alert('तुमच्या ब्राउझर मध्ये शेअर सपोर्ट नाही. कृपया मॅन्युअली लिंक कॉपी करा.');
        }
    }
};

// ==========================================================================
// 2. MAIN APPLICATION LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration & Selectors ---
    const DOM = {
        preloader: document.getElementById('preloader'),
        welcomePopup: document.getElementById('welcomePopup'),
        closePopupBtn: document.getElementById('closePopup'),
        darkModeToggles: document.querySelectorAll('#darkModeToggle'),
        langSelects: document.querySelectorAll('.lang-select'),
        hamburger: document.getElementById('hamburger'),
        navMenu: document.getElementById('nav-menu'),
        navbar: document.getElementById('navbar'),
        backToTop: document.getElementById('backToTop'),
        searchInput: document.getElementById('searchInput'),
        faqItems: document.querySelectorAll('.faq-item'),
        navLinks: document.querySelectorAll('.nav-link'),
        sections: document.querySelectorAll('section[id]'),
        galleryItems: document.querySelectorAll('.gallery-item img')
    };

    // ==========================================================================
    // PRELOADER & WELCOME POPUP
    // ==========================================================================
    const initPreloaderAndPopup = () => {
        if (!DOM.preloader) return;

        // Ensure smooth transition out
        setTimeout(() => {
            DOM.preloader.style.opacity = '0';
            setTimeout(() => {
                DOM.preloader.style.display = 'none';
                checkWelcomePopup();
            }, 500);
        }, 800); // Minimum view time for branding
    };

    const checkWelcomePopup = () => {
        if (!DOM.welcomePopup) return;
        
        const popupShown = localStorage.getItem('pratap_popup_shown');
        // Show popup if not shown in current session/local storage
        if (!popupShown) {
            setTimeout(() => {
                DOM.welcomePopup.classList.add('show');
            }, 600);
        }

        // Close logic
        const closePopup = () => {
            DOM.welcomePopup.classList.remove('show');
            localStorage.setItem('pratap_popup_shown', 'true');
        };

        if (DOM.closePopupBtn) DOM.closePopupBtn.addEventListener('click', closePopup);
        DOM.welcomePopup.addEventListener('click', (e) => {
            if (e.target.id === 'welcomePopup') closePopup();
        });

        // Escape key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.welcomePopup.classList.contains('show')) {
                closePopup();
            }
        });
    };

    // ==========================================================================
    // DARK MODE MANAGEMENT
    // ==========================================================================
    const initDarkMode = () => {
        const body = document.body;
        const savedTheme = localStorage.getItem('pratap_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        const applyTheme = (dark) => {
            if (dark) {
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
            }
            
            DOM.darkModeToggles.forEach(btn => {
                btn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                btn.setAttribute('aria-label', dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            });
        };

        // Initial application
        applyTheme(isDark);

        // Toggle Event Listener
        DOM.darkModeToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                isDark = !body.classList.contains('dark-mode');
                applyTheme(isDark);
                localStorage.setItem('pratap_theme', isDark ? 'dark' : 'light');
            });
        });
    };

    // ==========================================================================
    // LANGUAGE SELECTION
    // ==========================================================================
    const initLanguageToggle = () => {
        const savedLang = localStorage.getItem('pratap_language') || 'mr';
        
        DOM.langSelects.forEach(select => {
            select.value = savedLang;
            select.addEventListener('change', (e) => {
                const lang = e.target.value;
                localStorage.setItem('pratap_language', lang);
                // Sync all language dropdowns
                DOM.langSelects.forEach(s => s.value = lang);
                // Future integration: reload page or fetch translated JSON here
            });
        });
    };

    // ==========================================================================
    // NAVIGATION & SCROLL BEHAVIORS
    // ==========================================================================
    const initNavigation = () => {
        // Mobile Menu Toggle
        if (DOM.hamburger && DOM.navMenu) {
            DOM.hamburger.addEventListener('click', () => {
                const isActive = DOM.navMenu.classList.toggle('active');
                DOM.hamburger.setAttribute('aria-expanded', isActive);
            });

            // Close mobile menu when clicking a link
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    DOM.navMenu.classList.remove('active');
                    DOM.hamburger.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Throttle scroll for performance
        let isScrolling;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    };

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        // Sticky Navbar
        if (DOM.navbar) {
            if (currentScroll > 50) {
                DOM.navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                DOM.navbar.style.padding = '5px 0';
            } else {
                DOM.navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                DOM.navbar.style.padding = '0';
            }
        }

        // Back to Top Button
        if (DOM.backToTop) {
            if (currentScroll > 400) {
                DOM.backToTop.classList.add('show');
            } else {
                DOM.backToTop.classList.remove('show');
            }
        }

        // ScrollSpy (Active Section Highlight)
        let currentSectionId = '';
        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // ==========================================================================
    // SMART INSTANT SEARCH (DEBOUNCED)
    // ==========================================================================
    const initSearch = () => {
        if (!DOM.searchInput) return;

        // Debounce utility
        const debounce = (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(null, args), delay);
            };
        };

        const performSearch = debounce((e) => {
            const term = e.target.value.trim().toLowerCase();
            const searchableCards = document.querySelectorAll('.service-card, .faq-item, .update-card, .wcu-card');
            
            searchableCards.forEach(card => {
                const textContent = card.textContent.toLowerCase();
                if (textContent.includes(term)) {
                    card.style.display = ''; // Fallback to CSS rules
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        }, 300); // 300ms delay for performance

        DOM.searchInput.addEventListener('input', performSearch);
    };

    // ==========================================================================
    // FAQ ACCORDION LOGIC
    // ==========================================================================
    const initFAQ = () => {
        if (!DOM.faqItems.length) return;

        DOM.faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            if (!questionBtn) return;

            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs (Accordion style)
                DOM.faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                
                // Open clicked if it wasn't already open
                if (!isActive) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    // ==========================================================================
    // DYNAMIC GALLERY LIGHTBOX
    // ==========================================================================
    const initLightbox = () => {
        if (!DOM.galleryItems.length) return;

        // Create overlay elements dynamically
        const overlay = document.createElement('div');
        overlay.id = 'dynamicLightbox';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 100000;
            display: none; justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.3s ease; backdrop-filter: blur(5px);
        `;

        const imgElement = document.createElement('img');
        imgElement.style.cssText = `
            max-width: 90%; max-height: 90vh; border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute; top: 20px; right: 30px; background: transparent;
            border: none; color: white; font-size: 3rem; cursor: pointer;
            transition: color 0.3s ease;
        `;
        closeBtn.onmouseover = () => closeBtn.style.color = '#ff9933';
        closeBtn.onmouseleave = () => closeBtn.style.color = 'white';

        overlay.appendChild(imgElement);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        const openLightbox = (src) => {
            imgElement.src = src;
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            // Trigger reflow for animation
            void overlay.offsetWidth;
            overlay.style.opacity = '1';
            imgElement.style.transform = 'scale(1)';
        };

        const closeLightbox = () => {
            overlay.style.opacity = '0';
            imgElement.style.transform = 'scale(0.9)';
            setTimeout(() => {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        // Attach events
        DOM.galleryItems.forEach(item => {
            item.parentNode.addEventListener('click', () => openLightbox(item.src));
        });

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.style.display === 'flex') {
                closeLightbox();
            }
        });
    };

    // ==========================================================================
    // GLOBAL ACCESSIBILITY & UTILITIES
    // ==========================================================================
    const initAccessibility = () => {
        // Global Escape key handler for Modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close active modals
                const activeModals = document.querySelectorAll('.modal-overlay.active');
                activeModals.forEach(modal => window.closeModalForce(modal.id));
                
                // Close mobile menu
                if (DOM.navMenu && DOM.navMenu.classList.contains('active')) {
                    DOM.navMenu.classList.remove('active');
                    DOM.hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Add proper target blanks defensively to external links
        document.querySelectorAll('a[href^="http"]').forEach(anchor => {
            if (!anchor.hasAttribute('target')) {
                anchor.setAttribute('target', '_blank');
                anchor.setAttribute('rel', 'noopener noreferrer');
            }
        });
    };

    // ==========================================================================
    // INITIALIZATION RUNNER
    // ==========================================================================
    const runInitialization = () => {
        initPreloaderAndPopup();
        initDarkMode();
        initLanguageToggle();
        initNavigation();
        initSearch();
        initFAQ();
        initLightbox();
        initAccessibility();
        
        // Initialize AOS (Animate on Scroll) if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 50,
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        }
    };

    // Start App
    runInitialization();
});
