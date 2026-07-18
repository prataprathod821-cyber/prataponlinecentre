/**
 * ============================================================================
 * PRATAP ONLINE CENTRE - PREMIUM DIGITAL SERVICES
 * CORE JAVASCRIPT ARCHITECTURE
 * ============================================================================
 * Author: Pratap Rathod (Owner) / Architecture: Senior Frontend Engineer
 * Version: 1.0.0
 * Language: ES2022+ (Strict Mode)
 * Description: Modular, performant, accessible, and future-ready JS handling.
 * UI Language: Marathi
 * ============================================================================
 */

'use strict';

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================
const APP_CONFIG = {
    websiteName: 'प्रताप ऑनलाईन सेंटर',
    language: 'mr',
    debugMode: false,
    typingWords: [
        'आधार सेवा', 'पॅन कार्ड', 'सरकारी योजना', 'महाबॉकव', 
        'पीएम किसान', 'ऑनलाईन सेवा', 'बँकिंग सेवा', 'डिजिटल सेवा', 'पासपोर्ट सेवा'
    ],
    workingHours: {
        weekdays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        sunday: [0], // Sunday
        morning: { start: 6, end: 10 },
        evening: { start: 16, end: 22 },
        sundayFull: { start: 6, end: 22 }
    },
    storageKeys: {
        theme: 'pratap_theme',
        popupSeen: 'pratap_welcome_popup_seen',
        festivalSeen: 'pratap_festival_seen'
    }
};

// ============================================================================
// UTILITIES
// ============================================================================
const Utils = {
    log: (...args) => {
        if (APP_CONFIG.debugMode) console.log('[Pratap Online Center]', ...args);
    },
    warn: (...args) => {
        if (APP_CONFIG.debugMode) console.warn('[Pratap Online Center WARNING]', ...args);
    },
    error: (...args) => {
        console.error('[Pratap Online Center ERROR]', ...args);
    },
    getElement: (selector) => document.querySelector(selector),
    getAllElements: (selector) => document.querySelectorAll(selector),
    
    // Performance wrappers
    debounce: (func, wait = 100) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    throttle: (func, limit = 100) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },
    
    // Safe Event Listener Assignment
    addEvent: (element, event, handler, options = false) => {
        if (element) {
            element.addEventListener(event, handler, options);
        } else {
            Utils.warn(`Element not found for event: ${event}`);
        }
    }
};

// ============================================================================
// MODULES
// ============================================================================

/**
 * LOADER MODULE
 */
const LoaderModule = {
    init() {
        try {
            const loader = Utils.getElement('#premium-loader');
            if (!loader) return;
            
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.transition = 'opacity 0.6s ease-out';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        loader.setAttribute('aria-hidden', 'true');
                        document.body.classList.remove('no-scroll');
                    }, 600);
                }, 800); // Minimum delay for premium feel
            });
        } catch (e) {
            Utils.error('Loader Initialization Failed:', e);
        }
    }
};

/**
 * POPUP & NOTIFICATION MODULE
 */
const PopupModule = {
    init() {
        this.initWelcomePopup();
        this.initAnnouncementBar();
    },

    initWelcomePopup() {
        try {
            const popup = Utils.getElement('#welcome-popup');
            if (!popup) return;

            const isSeen = localStorage.getItem(APP_CONFIG.storageKeys.popupSeen);
            if (isSeen) {
                popup.style.display = 'none';
                return;
            }

            // Show popup with slight delay after load
            setTimeout(() => {
                if(typeof popup.showModal === 'function') {
                    popup.showModal();
                } else {
                    popup.classList.add('active'); // Fallback
                }
            }, 2500);

            const closeBtn = popup.querySelector('.close-btn');
            const continueBtn = popup.querySelector('.continue-btn');
            const rememberCheckbox = popup.querySelector('#remember-popup');

            const closePopup = () => {
                if (rememberCheckbox && rememberCheckbox.checked) {
                    localStorage.setItem(APP_CONFIG.storageKeys.popupSeen, 'true');
                }
                if(typeof popup.close === 'function') {
                    popup.close();
                } else {
                    popup.classList.remove('active');
                }
            };

            Utils.addEvent(closeBtn, 'click', closePopup);
            Utils.addEvent(continueBtn, 'click', closePopup);
            
            // ESC key to close
            Utils.addEvent(popup, 'keydown', (e) => {
                if (e.key === 'Escape') closePopup();
            });

        } catch (e) {
            Utils.error('Popup Logic Error:', e);
        }
    },

    initAnnouncementBar() {
        const bar = Utils.getElement('#announcement-bar');
        const closeBtn = Utils.getElement('.close-announcement');
        if (bar && closeBtn) {
            Utils.addEvent(closeBtn, 'click', () => {
                bar.style.display = 'none';
            });
        }
    }
};

/**
 * TYPING EFFECT MODULE
 */
const TypingModule = {
    init() {
        const typingElement = Utils.getElement('.typing-animation-placeholder');
        if (!typingElement) return;

        const words = APP_CONFIG.typingWords;
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeDelay = 100;
        const deleteDelay = 50;
        const nextWordDelay = 2000;

        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? deleteDelay : typeDelay;

            if (!isDeleting && charIndex === currentWord.length) {
                speed = nextWordDelay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                speed = 500;
            }

            setTimeout(type, speed);
        };

        type();
    }
};

/**
 * THEME (DARK/LIGHT) MODULE
 */
const ThemeModule = {
    init() {
        const toggleBtn = Utils.getElement('.dark-mode-toggle');
        const root = document.documentElement;
        
        const getPreferredTheme = () => {
            const savedTheme = localStorage.getItem(APP_CONFIG.storageKeys.theme);
            if (savedTheme) return savedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };

        const setTheme = (theme) => {
            root.setAttribute('data-theme', theme);
            document.body.className = `${theme}-theme`;
            localStorage.setItem(APP_CONFIG.storageKeys.theme, theme);
            if(toggleBtn) {
                toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'लाईट मोड चालू करा' : 'डार्क मोड चालू करा');
            }
        };

        setTheme(getPreferredTheme());

        Utils.addEvent(toggleBtn, 'click', () => {
            const currentTheme = root.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(APP_CONFIG.storageKeys.theme)) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
};

/**
 * DATE, TIME & WORKING STATUS MODULE
 */
const TimeStatusModule = {
    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    },

    updateTime() {
        try {
            const now = new Date();
            const timeElement = Utils.getElement('#current-time-placeholder');
            const statusElement = Utils.getElement('.status-indicator');
            const statusContainer = Utils.getElement('.today-status-placeholder');
            
            // Format Time (Marathi Locale)
            if (timeElement) {
                timeElement.textContent = now.toLocaleTimeString('mr-IN', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                });
            }

            const day = now.getDay();
            const hours = now.getHours();
            
            let isOpen = false;
            let statusText = '';
            let statusClass = '';

            if (APP_CONFIG.workingHours.weekdays.includes(day)) {
                // Monday - Saturday
                const isMorning = hours >= APP_CONFIG.workingHours.morning.start && hours < APP_CONFIG.workingHours.morning.end;
                const isEvening = hours >= APP_CONFIG.workingHours.evening.start && hours < APP_CONFIG.workingHours.evening.end;
                
                if (isMorning || isEvening) {
                    isOpen = true;
                    statusText = 'आमचे केंद्र सध्या सुरू आहे (Open)';
                    statusClass = 'status-open';
                } else if (hours < APP_CONFIG.workingHours.morning.start) {
                    statusText = 'सकाळी ६ वाजता सुरू होईल (Closed)';
                    statusClass = 'status-closed';
                } else if (hours >= APP_CONFIG.workingHours.morning.end && hours < APP_CONFIG.workingHours.evening.start) {
                    statusText = 'सायंकाळी ४ वाजता पुन्हा सुरू होईल (Closed)';
                    statusClass = 'status-closed';
                } else {
                    statusText = 'आमचे केंद्र सध्या बंद आहे (Closed)';
                    statusClass = 'status-closed';
                }
            } else if (APP_CONFIG.workingHours.sunday.includes(day)) {
                // Sunday
                if (hours >= APP_CONFIG.workingHours.sundayFull.start && hours < APP_CONFIG.workingHours.sundayFull.end) {
                    isOpen = true;
                    statusText = 'आमचे केंद्र सध्या सुरू आहे (Open)';
                    statusClass = 'status-open';
                } else {
                    statusText = 'आमचे केंद्र सध्या बंद आहे (Closed)';
                    statusClass = 'status-closed';
                }
            }

            if (statusElement) {
                statusElement.textContent = isOpen ? 'Open' : 'Closed';
                statusElement.className = `status-indicator ${statusClass}`;
            }

            if (statusContainer) {
                statusContainer.innerHTML = `<span class="${statusClass}">${statusText}</span>`;
            }

        } catch (e) {
            Utils.error('Time Update Error:', e);
        }
    }
};

/**
 * NAVIGATION & SCROLL MODULE
 */
const NavigationModule = {
    init() {
        this.initStickyNavbar();
        this.initSmoothScroll();
        this.initScrollProgress();
        this.initBackToTop();
        this.initMobileMenu();
    },

    initStickyNavbar() {
        const header = Utils.getElement('#main-header');
        if (!header) return;

        const onScroll = Utils.throttle(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', onScroll, { passive: true });
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = Utils.getElement(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const hamburger = Utils.getElement('.mobile-hamburger');
                    if (hamburger && hamburger.getAttribute('aria-expanded') === 'true') {
                        hamburger.click();
                    }
                }
            });
        });
    },

    initScrollProgress() {
        const progressBar = Utils.getElement('#scroll-progress-placeholder .progress-bar');
        if (!progressBar) return;

        const updateProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (window.scrollY / windowHeight) * 100;
            requestAnimationFrame(() => {
                progressBar.style.width = `${progress}%`;
            });
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
    },

    initBackToTop() {
        const backToTopBtn = Utils.getElement('#back-to-top');
        const floaters = Utils.getAllElements('.floating-buttons button');
        
        if (!backToTopBtn) return;

        const toggleVisibility = Utils.throttle(() => {
            if (window.scrollY > 300) {
                floaters.forEach(btn => btn.classList.add('show'));
            } else {
                floaters.forEach(btn => btn.classList.remove('show'));
            }
        }, 150);

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        Utils.addEvent(backToTopBtn, 'click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    initMobileMenu() {
        const hamburger = Utils.getElement('.mobile-hamburger');
        const navMenu = Utils.getElement('.desktop-menu');
        
        if (!hamburger || !navMenu) return;

        Utils.addEvent(hamburger, 'click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }
};

/**
 * SERVICES INTERACTION MODULE
 */
const ServicesModule = {
    init() {
        this.initFilters();
        this.initSearch();
        this.initModals();
    },

    initFilters() {
        const filterBtns = Utils.getAllElements('.filter-chip');
        const serviceCards = Utils.getAllElements('.service-card');

        filterBtns.forEach(btn => {
            Utils.addEvent(btn, 'click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                serviceCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        this.animateReveal(card);
                    } else {
                        const categories = card.getAttribute('data-category')?.split(' ') || [];
                        if (categories.includes(filterValue)) {
                            card.style.display = 'block';
                            this.animateReveal(card);
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    },

    initSearch() {
        const searchInput = Utils.getElement('#service-search-input');
        const serviceCards = Utils.getAllElements('.service-card');

        if (!searchInput) return;

        Utils.addEvent(searchInput, 'input', Utils.debounce((e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            serviceCards.forEach(card => {
                const textContent = card.textContent.toLowerCase();
                if (textContent.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }, 300));
    },

    initModals() {
        const modalTriggers = Utils.getAllElements('[aria-haspopup="dialog"]');
        const closeBtns = Utils.getAllElements('.close-modal');

        modalTriggers.forEach(trigger => {
            Utils.addEvent(trigger, 'click', () => {
                const modalId = trigger.getAttribute('aria-controls');
                const modal = Utils.getElement(`#${modalId}`);
                if (modal) {
                    if(typeof modal.showModal === 'function') {
                        modal.showModal();
                    } else {
                        modal.classList.add('active');
                    }
                    document.body.style.overflow = 'hidden'; // Prevent bg scroll
                }
            });
        });

        const closeFunc = (modal) => {
            if(typeof modal.close === 'function') {
                modal.close();
            } else {
                modal.classList.remove('active');
            }
            document.body.style.overflow = ''; 
        };

        closeBtns.forEach(btn => {
            Utils.addEvent(btn, 'click', (e) => {
                const modal = e.target.closest('dialog, .premium-modal');
                if (modal) closeFunc(modal);
            });
        });

        // Close on clicking outside
        document.querySelectorAll('dialog').forEach(dialog => {
            Utils.addEvent(dialog, 'click', (e) => {
                if (e.target === dialog) closeFunc(dialog);
            });
        });
    },

    animateReveal(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(15px)';
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.4s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
};

/**
 * ANIMATIONS & UI OBSERVERS MODULE
 */
const AnimationsModule = {
    init() {
        this.initIntersectionObservers();
    },

    initIntersectionObservers() {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'aos-animate');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        // Elements to animate
        const animatedElements = Utils.getAllElements('.hover-lift, .glass-glow, .premium-card, .service-card, .section-header');
        animatedElements.forEach(el => {
            el.classList.add('prepare-reveal');
            revealObserver.observe(el);
        });

        this.initCounters();
    },

    initCounters() {
        const counters = Utils.getAllElements('.count-number');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    startCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target') || 1000;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counterElement.textContent = Math.ceil(current).toLocaleString('mr-IN');
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.textContent = target.toLocaleString('mr-IN') + '+';
            }
        };
        updateCounter();
    }
};

/**
 * SYSTEM & UTILITY FEATURES MODULE
 */
const SystemFeaturesModule = {
    init() {
        this.initNetworkStatus();
        this.initPageVisibility();
        this.initDocumentFinderLogic();
        this.initChargeCalculatorLogic();
    },

    initNetworkStatus() {
        const updateStatus = () => {
            if (!navigator.onLine) {
                Utils.warn('इंटरनेट कनेक्शन उपलब्ध नाही (Offline Mode).');
                const offlineBanner = Utils.getElement('#offline-mode');
                if(offlineBanner) {
                    offlineBanner.innerHTML = '<div class="offline-toast">तुम्ही सध्या ऑफलाईन आहात. काही सेवा चालणार नाहीत.</div>';
                    offlineBanner.removeAttribute('hidden');
                }
            } else {
                const offlineBanner = Utils.getElement('#offline-mode');
                if(offlineBanner) offlineBanner.setAttribute('hidden', 'true');
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
    },

    initPageVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                Utils.log('Page hidden, pausing heavy animations');
                // Hook to pause heavy GSAP/Lottie if present
            } else {
                Utils.log('Page visible, resuming animations');
            }
        });
    },

    // Dummy Logic for Future APIs / Functional Placeholders
    initDocumentFinderLogic() {
        const selectBox = Utils.getElement('#document-finder select');
        const results = Utils.getElement('.finder-results');
        
        if (selectBox && results) {
            Utils.addEvent(selectBox, 'change', (e) => {
                const val = e.target.value;
                if(val) {
                    results.innerHTML = `<p><strong>आवश्यक कागदपत्रे:</strong> माहिती लोड होत आहे...</p>`;
                    // Simulate API Fetch
                    setTimeout(() => {
                        results.innerHTML = `<p><strong>आवश्यक कागदपत्रे:</strong> आधार कार्ड, रेशन कार्ड, फोटो (डेटा उपलब्ध)</p>`;
                    }, 500);
                }
            });
        }
    },

    initChargeCalculatorLogic() {
        const selectBox = Utils.getElement('#charge-calculator select');
        const results = Utils.getElement('.calculator-results');
        
        if (selectBox && results) {
            Utils.addEvent(selectBox, 'change', (e) => {
                if(e.target.value) {
                    Utils.getElement('.calc-gov-fee').textContent = '₹...';
                    Utils.getElement('.calc-service-fee').textContent = '₹...';
                    Utils.getElement('.calc-total').textContent = '₹ लोड करत आहे...';
                }
            });
        }
    }
};

/**
 * PWA (PROGRESSIVE WEB APP) HOOKS
 */
const PWAModule = {
    init() {
        let deferredPrompt;
        const installPopup = Utils.getElement('#install-app-popup');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            // Future logic to show custom install popup
            if (installPopup && APP_CONFIG.debugMode) {
                Utils.log('PWA Install ready. Show UI to user.');
            }
        });
        
        // Register Service Worker if implemented in future
        if ('serviceWorker' in navigator && APP_CONFIG.debugMode) {
            Utils.log('Service Worker is supported. Waiting for sw.js implementation.');
        }
    }
};

/**
 * FUTURE API PLACEHOLDERS MODULE
 * To be connected with Node.js/PHP backends
 */
const ApiIntegrations = {
    async fetchGovernmentSchemes() { /* Future Implementation */ },
    async fetchWeatherUpdates() { /* Future Implementation */ },
    async fetchAgricultureMarket() { /* Future Implementation */ },
    async fetchLiveTokens() { /* Future Implementation */ },
    async submitContactForm(data) { /* Future Implementation */ },
    
    initPlaceholders() {
        Utils.log('API endpoints prepared for future integration.');
    }
};

// ============================================================================
// MAIN APPLICATION INITIALIZER
// ============================================================================
const PratapCentreApp = {
    init() {
        Utils.log('Initializing Pratap Online Centre System...');
        
        try {
            // Core Modules
            LoaderModule.init();
            PopupModule.init();
            ThemeModule.init();
            TimeStatusModule.init();
            NavigationModule.init();
            
            // UI & Interactivity
            TypingModule.init();
            ServicesModule.init();
            AnimationsModule.init();
            SystemFeaturesModule.init();
            PWAModule.init();
            
            // API Structure
            ApiIntegrations.initPlaceholders();

            Utils.log('Initialization Complete.');
        } catch (error) {
            Utils.error('Critical Failure during app initialization:', error);
        }
    }
};

// ============================================================================
// BOOTSTRAP
// ============================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PratapCentreApp.init());
} else {
    PratapCentreApp.init();
}
