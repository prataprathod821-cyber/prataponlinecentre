/**
 * PRATAP ONLINE CENTRE - Core Interactive JavaScript System
 * Version: 2.1.0
 * Author: Senior Full Stack Developer & UI/UX Expert
 * Features: High-Performance, Modular, Highly Accessible, Error-Free Execution
 */

// Global App State Management Object
const AppState = {
    isDarkMode: false,
    pwaPromptEvent: null,
    searchDebounceTimer: null,
    servicesData: {},
    activeModal: null,
    toastContainer: null
};

// Main Initialization Entry Point
document.addEventListener('DOMContentLoaded', () => {
    initPerformanceOptimizations();
    initThemeSystem();
    initAosAndAnimations();
    initNavbarAndMenu();
    initTickerAndSliders();
    initDatabase();
    initServicesEngine();
    initModalSystem();
    initFaqAccordion();
    initContactForm();
    initUtilities();
    initNetworkMonitoring();
    initPwaSupport();
});

/**
 * 1. Performance Optimizations & Global Configurations
 */
function initPerformanceOptimizations() {
    // Inject global styles needed for JavaScript states securely without modifying structural CSS files
    const style = document.createElement('style');
    style.textContent = `
        .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.4); transform: scale(0); animation: rippleEffect 0.6s linear; pointer-events: none; }
        @keyframes rippleEffect { to { transform: scale(4); opacity: 0; } }
        .toast-container { position: fixed; bottom: 20px; left: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .toast-msg { background: rgba(10, 25, 49, 0.95); color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); pointer-events: auto; animation: slideInLeft 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-left: 4px solid #ff9933; }
        .toast-msg.success { border-left-color: #128c7e; }
        .toast-msg.error { border-left-color: #d9534f; }
        @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .no-results-msg { text-align: center; grid-column: 1 / -1; padding: 40px; font-weight: 600; font-size: 1.2rem; color: var(--text-dark); opacity: 0.7; }
    `;
    document.head.appendChild(style);

    // Setup Toast Container Root Element
    AppState.toastContainer = document.createElement('div');
    AppState.toastContainer.className = 'toast-container';
    document.body.appendChild(AppState.toastContainer);

    // Hide Preloader Safely if it lingers beyond execution time
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 800);
    }
}

/**
 * 2. Theme Management System (Dark / Light Mode & LocalStorage)
 */
function initThemeSystem() {
    const modeToggle = document.getElementById('modeToggle');
    if (!modeToggle) return;

    // Check System Preferences & LocalStorage Cache
    const savedTheme = localStorage.getItem('themePreference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        AppState.isDarkMode = true;
        updateThemeToggleIcon(true);
    }

    modeToggle.addEventListener('click', () => {
        AppState.isDarkMode = !AppState.isDarkMode;
        if (AppState.isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('themePreference', 'dark');
            updateThemeToggleIcon(true);
            showToast("डार्क मोड ऑन केला", "success");
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('themePreference', 'light');
            updateThemeToggleIcon(false);
            showToast("लाईट मोड ऑन केला", "success");
        }
    });
}

function updateThemeToggleIcon(isDark) {
    const icon = document.getElementById('modeToggle')?.querySelector('i');
    if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

/**
 * 3. Navigation Controls & Header Interactions
 */
function initNavbarAndMenu() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const btt = document.getElementById('backToTop');

    // Sticky Navbar & Back-To-Top Button Controller via Scroll Monitor
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('navbar-scrolled');
        } else {
            navbar?.classList.remove('navbar-scrolled');
        }

        if (btt) {
            btt.style.display = window.scrollY > 300 ? 'flex' : 'none';
        }

        updateActiveNavigationHighlight();
    }, { passive: true });

    // Mobile Navigation Sidebar Mechanics
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close Sidebar on Document Click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling & Interactive Anchors Selection
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                navMenu?.classList.remove('active');
                hamburger?.classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 85,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveNavigationHighlight() {
    const sections = document.querySelectorAll('section, header, footer');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height && id) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * 4. Micro-interactions, Sliders, & UI Tickers
 */
function initTickerAndSliders() {
    // Ripple Effect Logic Attached to Interactive Element Events
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, .service-card, .faq-trigger, .float-btn');
        if (!target) return;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        target.style.position = 'relative';
        target.style.overflow = 'hidden';
        
        target.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });

    // Lazy Loading Images Engine implementation
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(image => imageObserver.observe(image));
    } else {
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

/**
 * 5. Structured Local Services Knowledge Base
 */
function initDatabase() {
    const commonMsg = "नमस्कार, मला आपल्या सेवेबद्दल माहिती हवी आहे.";
    
    // Categorized Master Service Registry Map Data Store
    AppState.servicesData = {
        aadhaar: {
            title: "आधार कार्ड सेवा (Aadhaar Services)",
            category: "documents",
            desc: "नवीन आधार कार्ड नोंदणी, पत्ता अपडेट, मोबाईल नंबर जोडणे, बायोमेट्रिक अपडेट आणि पीव्हीसी प्लास्टिक कार्ड ऑर्डर करण्याची अधिकृत प्रक्रिया.",
            docs: "ओळखपत्राचा पुरावा (पॅन/वोटर आयडी), रहिवासी पुरावा (वीज बिल/रेशन कार्ड), चालू मोबाईल क्रमांक.",
            charges: "सरकारी शुल्कानुसार (₹५० ते ₹१०० मधील बदल)",
            time: "७ ते १५ कामकाजाचे दिवस"
        },
        pan: {
            title: "पॅन कार्ड (PAN Card)",
            category: "documents",
            desc: "नवीन पॅन कार्ड काढणे, हरवलेले पॅन कार्ड शोधणे किंवा विद्यमान कार्डमधील नावाची व जन्मतारखेची दुरुस्ती करणे.",
            docs: "आधार कार्ड (मोबाईल लिंक अनिवार्य असल्यास जलद ई-केवायसी), २ पासपोर्ट आकाराचे फोटो.",
            charges: "₹१५० ते ₹२०० साधारणतः",
            time: "ई-पॅन कार्ड ३ दिवसांत, फिजिकल प्लास्टिक कार्ड १० दिवसांत घरपोच"
        },
        passport: {
            title: "पासポート सेवा (Passport)",
            category: "documents",
            desc: "नवीन फ्रेश पासपोर्ट अर्ज प्रक्रिया, कागदपत्र पडताळणी व पीएसके (PSK) केंद्र अपॉइंटमेंट बुकिंग व्यवस्थापन.",
            docs: "आधार कार्ड, पॅन कार्ड, शाळा सोडल्याचा दाखला (LC) किंवा १०वी बोर्ड प्रमाणपत्र, चालू बँक पासबुक.",
            charges: "शासकीय चलन फी ₹१५०० + केंद्र ऑनलाइन प्रक्रिया शुल्क",
            time: "पोलीस व्हेरिफिकेशननंतर १५ ते २५ दिवस"
        },
        voter: {
            title: "मतदान कार्ड (Voter ID)",
            category: "documents",
            desc: "नवीन मतदार यादी नाव नोंदणी, डिजिटल निवडणूक ओळखपत्र डाउनलोड आणि मतदार ओळखपत्रातील पत्ता बदल दुरुस्ती कामे.",
            docs: "आधार कार्ड, वयाचा पुरावा (टीसी किंवा जन्माचा दाखला), १ पासपोर्ट फोटो, कुटुंबातील एका सदस्याचे मतदार कार्ड.",
            charges: "रास्त सेवा शुल्क",
            time: "१५ ते ३० दिवस (शासकीय मंजुरीनुसार)"
        },
        pmkisan: {
            title: "पीएम किसान योजना (PM Kisan)",
            category: "government",
            desc: "शेतकरी सन्मान निधी योजना नवीन नाव नोंदणी, बँक खाते आधार लिंकिंग पडताळणी आणि अनिवार्य बायोमेट्रिक ई-केवायसी सेवा.",
            docs: "नवीन ७/१२ आणि ८-अ उतारा, आधार कार्ड, बँक पासबुक, मोबाईल क्रमांक.",
            charges: "अतिशय नाममात्र दर",
            time: "त्वरित ऑनलाइन सबमिशन"
        },
        ayushman: {
            title: "आयुष्मान भारत कार्ड (Ayushman Health Card)",
            category: "government",
            desc: "५ लाख रुपयांपर्यंत मोफत उपचार देणारे केंद्र सरकारचे गोल्डन हेल्थ इन्शुरन्स कार्ड डाउनलोड आणि व्हेरिफिकेशन.",
            docs: "रेशन कार्ड (पिवळे/केशर), आधार कार्ड, आधार लिंक मोबाईल.",
            charges: "शासकीय दराप्रमाणे",
            time: "१ ते २ दिवस मंजुरी"
        },
        mahabocw: {
            title: "बांधकाम कामगार नोंदणी (MAHABOCW)",
            category: "government",
            desc: "महाराष्ट्र इमारत व इतर बांधकाम कामगार कल्याणकारी मंडळांतर्गत नवीन नोंदणी, वार्षिक नूतनीकरण आणि पेटी/शैक्षणिक योजना अर्ज.",
            docs: "आधार कार्ड, बँक पासबुक, रेशन कार्ड, ९० दिवस काम केल्याचे प्रमाणपत्र (ठेकेदार दाखला), बँक स्टेटमेंट.",
            charges: "शासकीय फी + ऑनलाईन प्रक्रिया शुल्क",
            time: "१५ ते २० दिवस पडताळणी"
        },
        labourcard: {
            title: "लेबर कार्ड योजना (Labour Card)",
            category: "government",
            desc: "असंघटित क्षेत्रातील मजुरांसाठी विविध कल्याणकारी योजनांचे लाभ मिळवून देण्यासाठी असणारा अधिकृत ऑनलाईन अर्ज व नोंदणी.",
            docs: "आधार कार्ड, बँक पासबुक, रेशन कार्ड, मोबाईल क्रमांक.",
            charges: "वाजवी दर",
            time: "७ ते १० कामकाजाचे दिवस"
        },
        driving: {
            title: "ड्रायव्हिंग लायसन्स (Driving Licence RTO)",
            category: "documents",
            desc: "सर्व प्रकारच्या दुचाकी व चारचाकी वाहनांचे ऑनलाईन लर्निंग लायसन्स अर्ज आणि पक्क्या लायसन्स करिता आरटीओ स्लॉट बुकिंग.",
            docs: "आधार कार्ड, शाळा सोडल्याचा दाखला, जन्माचा दाखला, रक्ताचा गट (Blood Group) रिपोर्ट, फोटो.",
            charges: "आरटीओ शासकीय फी संरचना + प्रोसेसिंग फी",
            time: "लर्निंग लायसन्स २४ तासांत, पक्के लायसन्स चाचणीनंतर"
        },
        birthcert: {
            title: "जन्म प्रमाणपत्र (Birth Certificate)",
            category: "documents",
            desc: "ग्रामपंचायत किंवा नगरपरिषद दप्तरातून अधिकृत डिजिटल प्रमाणित जन्म दाखला ऑनलाईन शोधणे व डाऊनलोड करणे.",
            docs: "रुग्णालय डिस्चार्ज कार्ड, पालकांचे आधार कार्ड, जुनी नोंद असल्यास तारीख व वर्ष माहिती.",
            charges: "नाममात्र शुल्क",
            time: "५ ते ७ दिवस"
        },
        incomecert: {
            title: "उत्पन्नाचा दाखला (Income Certificate)",
            category: "documents",
            desc: "१ वर्ष किंवा ३ वर्षांचा सक्षम प्राधिकारी (तहसीलदार) यांच्या स्वाक्षरीचा अधिकृत शासकीय उत्पन्नाचा दाखला.",
            docs: "तलाठी उत्पन्न अहवाल, रेशन कार्ड, आधार कार्ड, स्वयंघोषणा पत्र, मागील वर्षाचा कोणताही पुरावा.",
            charges: "शासकीय फी प्रमाणे वाजवी",
            time: "७ ते १० कामकाजाचे दिवस"
        },
        castecert: {
            title: "जातीचा दाखला (Caste Certificate)",
            category: "documents",
            desc: "सर्व प्रवर्गातील (SC, ST, OBC, VJNT, EWS) नागरिकांसाठी आणि विद्यार्थ्यांसाठी डिजिटल स्वरूपातील अधिकृत जातीचा दाखला.",
            docs: "शाळा सोडल्याचा दाखला, वडिलांचा/आजोबांचा जातीचा जुना पुरावा, १९५०/१९६७ चा महसुली पुरावा, आधार कार्ड.",
            charges: "रास्त शासकीय दर",
            time: "१५ ते २१ दिवस"
        },
        residencecert: {
            title: "रहिवासी दाखला (Residence Certificate)",
            category: "documents",
            desc: "शासकीय योजना, नोकऱ्या व शैक्षणिक ॲडमिशनसाठी आवश्यक असणारे अधिवास व रहिवासी प्रमाणपत्र (Domicile).",
            docs: "रेशन कार्ड, आधार कार्ड, शाळा सोडल्याचा दाखला, मतदार यादीतील नाव किंवा वीज बिल उतारा.",
            charges: "नियमाप्रमाणे रास्त फी",
            time: "७ ते १० कामकाजाचे दिवस"
        },
        aeps: {
            title: "आधारद्वारे पैसे काढणे (AEPS Cash Withdrawal)",
            category: "banking",
            desc: "कोणत्याही बँकेचे खाते असलेल्या नागरिकांना बँक किंवा एटीएमला न जाता केवळ बोटाचे ठसे लावून सुरक्षित पैसे काढण्याची सोय.",
            docs: "आधार कार्ड क्रमांक आणि लिंक असणारे बँक खाते नाव.",
            charges: "१००% मोफत सेवा (कोणतेही अतिरिक्त शुल्क नाही)",
            time: "त्वरित एका मिनिटात रोख रक्कम प्रदान"
        },
        moneytransfer: {
            title: "मनी ट्रान्सफर (Money Transfer)",
            category: "banking",
            desc: "भारतातील कोणत्याही बँकेच्या कोणत्याही खात्यामध्ये त्वरित सुरक्षित पैसे पाठवण्याची अत्याधुनिक आयएमपीएस (IMPS) व्यवस्था.",
            docs: "पैसे पाठवायचे असणाऱ्या बँकेचे नाव, खाते क्रमांक (Account No) आणि आयएफएससी कोड (IFSC Code).",
            charges: "बँक नियमांनुसार नाममात्र ट्रान्सफर चार्जेस",
            time: "त्वरित रिअल-टाइम जमा"
        },
        print: {
            title: "कॉम्प्युटर प्रिंट (Digital Document Print Out)",
            category: "printing",
            desc: "सर्व प्रकारच्या फाईल्स जसे की PDF, Word, प्रतिमा यांची उत्कृष्ट आणि स्पष्ट लेझर प्रिंटिंग (कलर आणि ब्लॅक-व्हाईट).",
            docs: "मोबाईल, व्हॉट्सॲप, ईमेल किंवा पेनड्राईव्ह मधील डिजिटल दस्तऐवज.",
            charges: "₹५ ते ₹२० प्रती पेज (प्रकारानुसार)",
            time: "त्वरित जागेवर"
        },
        xerox: {
            title: "हाय-स्पीड झेरॉक्स (Xerox Services)",
            category: "printing",
            desc: "महत्त्वाच्या कागदपत्रांच्या स्पष्ट प्रति तयार करण्यासाठी अत्याधुनिक मशीनद्वारे हाय-क्वालिटी झेरॉक्स कामे.",
            docs: "तुमचे मूळ दस्तऐवज (Original Documents).",
            charges: "₹२ ते ₹५ प्रती पेज",
            time: "त्वरित ऑन द स्पॉट"
        },
        scan: {
            title: "डॉक्युमेंट स्कॅनिंग (High Quality Scanning)",
            category: "printing",
            desc: "नोकरी अर्ज किंवा ईमेलवर पाठवण्यासाठी तुमचे दस्तऐवज हाय-रिझोल्यूशन (DPI) डिजिटल पीडीएफ किंवा इमेज स्वरूपात स्कॅन करणे.",
            docs: "स्कॅन करायचे असणारे मूळ कागदपत्र.",
            charges: "नाममात्र प्रति पेज",
            time: "त्वरित एका मिनिटात"
        },
        passportphoto: {
            title: "पासपोर्ट फोटो (Instant Passport Photo)",
            category: "printing",
            desc: "शासकीय अर्ज, शाळा-कॉलेज फॉर्मसाठी लागणारे तात्काळ पासपोर्ट आकाराचे रंगीत फोटो पाठीमागे पांढऱ्या किंवा निळ्या बॅकग्राउंडसह.",
            docs: "थेट फोटो काढण्यासाठी व्यक्ती उपस्थित असणे गरजेचे.",
            charges: "वाजवी पॅकेज दर",
            time: "५ मिनिटांत रेडी"
        },
        lamination: {
            title: "लॅमिनेशन सेवा (Document Lamination)",
            category: "printing",
            desc: "तुमचे महत्त्वाचे दस्तऐवज, दाखले पाणी, धूळ आणि फाटण्यापासून वाचवण्यासाठी हेवी प्लास्टिक पाऊचसह दर्जेदार लॅमिनेशन.",
            docs: "लॅमिनेशन करायचे असणारे तुमचे मूळ प्रमाणपत्र.",
            charges: "₹२० ते ₹५० (आकारानुसार)",
            time: "२ मिनिटांत तयार"
        },
        scholarship: {
            title: "महाडीबीटी स्कॉलरशिप अर्ज (MahaDBT Scholarship)",
            category: "other",
            desc: "सर्व कॉलेज विद्यार्थ्यांसाठी असणारे शासकीय महाडीबीटी स्कॉलरशिप, फ्री-शिप ऑनलाईन फॉर्म भरणे आणि त्रुटी सुधारणे.",
            docs: "मागील वर्षाची गुणपत्रिका, जातीचा दाखला, उत्पन्नाचा दाखला, कॉलेज फी पावती, हॉस्टेल दाखला (लागू असल्यास).",
            charges: "वाजवी ऑनलाईन प्रक्रिया दर",
            time: "त्वरित अचूक अर्ज प्रक्रिया"
        },
        onlineforms: {
            title: "सर्व शासकीय ऑनलाईन नोकरी फॉर्म",
            category: "other",
            desc: "पोलीस भरती, तलाठी, रेल्वे, आर्मी, बँकिंग तसेच विविध राज्य व केंद्र सरकारच्या सरळसेवा भरतीचे फॉर्म चुकांशिवाय भरणे.",
            docs: "शैक्षणिक पात्रता कागदपत्रे, ओळखपत्र, फोटो, सही, चालू मोबाईल आणि ईमेल आयडी.",
            charges: "फॉर्म प्रकारानुसार नाममात्र शुल्क",
            time: "अचूकतेची पूर्ण खात्री देऊन सबमिशन"
        },
        electricitybill: {
            title: "महावितरण वीज बिल भरणा (Electricity Bill)",
            category: "banking",
            desc: "घरगुती किंवा शेती पंपाचे लाईट बिल ऑनलाईन स्वीकारले जाईल आणि तात्काळ अधिकृत शासकीय भरणा पावती दिली जाईल.",
            docs: "चालू वीज बिल (Electricity Bill Copy) किंवा ग्राहकाचा ग्राहक क्रमांक (Consumer ID).",
            charges: "मोफत किंवा अगदी नाममात्र शुल्क",
            time: "त्वरित भरणा ट्रान्झॅक्शन संपन्न"
        }
    };
}

/**
 * 6. Dynamic Services Search & Advanced Filtering Engine
 */
function initServicesEngine() {
    const searchInput = document.getElementById('serviceSearch');
    const gridContainer = document.getElementById('servicesGrid');
    
    if (!gridContainer) return;

    // Create Category Filter Navbar Component Layout Inline Dynamically
    const filterNav = document.createElement('div');
    filterNav.className = 'filter-nav';
    filterNav.style.cssText = `
        display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 30px auto; max-width: 800px;
    `;
    
    const categories = [
        { id: 'all', name: 'सर्व सेवा' },
        { id: 'government', name: 'शासकीय योजना' },
        { id: 'banking', name: 'बँकिंग व बिल' },
        { id: 'documents', name: 'कागदपत्रे व दाखले' },
        { id: 'printing', name: 'प्रिंट व फोटो' },
        { id: 'other', name: 'इतर ऑनलाईन फॉर्म्स' }
    ];

    categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = index === 0 ? 'btn btn-saffron filter-btn' : 'btn btn-blue filter-btn';
        btn.textContent = cat.name;
        btn.setAttribute('data-filter', cat.id);
        btn.style.padding = '8px 18px';
        btn.style.fontSize = '0.9rem';
        filterNav.appendChild(btn);
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('btn-saffron');
                b.classList.add('btn-blue');
            });
            btn.classList.remove('btn-blue');
            btn.classList.add('btn-saffron');
            executeFilteringSystem();
        });
    });

    gridContainer.parentNode.insertBefore(filterNav, gridContainer);

    // Attach Debounced Live Event Listener on Search Input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(AppState.searchDebounceTimer);
            AppState.searchDebounceTimer = setTimeout(() => {
                executeFilteringSystem();
            }, 250);
        });
    }
}

function executeFilteringSystem() {
    const searchInput = document.getElementById('serviceSearch');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const activeFilterBtn = document.querySelector('.filter-btn.btn-saffron');
    const selectedCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    
    const cards = document.querySelectorAll('.service-card');
    let visibleCount = 0;

    cards.forEach(card => {
        // Safe mapping lookup logic detection fallback path
        const onClickAttr = card.getAttribute('onclick') || '';
        const matchKey = onClickAttr.match(/'([^']+)'/);
        const serviceKey = matchKey ? matchKey[1] : '';
        const sData = AppState.servicesData[serviceKey];
        
        const tags = card.getAttribute('data-tags')?.toLowerCase() || '';
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';

        const matchesSearch = tags.includes(query) || title.includes(query);
        const matchesCategory = selectedCategory === 'all' || (sData && sData.category === selectedCategory);

        if (matchesSearch && matchesCategory) {
            card.style.display = 'flex';
            visibleCount++;
            if (query !== '') {
                card.style.border = '2px solid var(--accent-saffron)';
            } else {
                card.style.border = '1px solid var(--glass-border)';
            }
        } else {
            card.style.display = 'none';
        }
    });

    // Handle "No Service Found" layout display state
    let noResultsMsg = document.getElementById('noServicesFoundMsg');
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noServicesFoundMsg';
            noResultsMsg.className = 'no-results-msg';
            noResultsMsg.innerHTML = `<i class="fa-solid fa-magnifying-glass-blur" style="font-size: 2rem; color: var(--accent-saffron); margin-bottom:10px; display:block;"></i> शोधलेली सेवा उपलब्ध नाही. कृपया इतर शब्द वापरून पहा.`;
            document.getElementById('servicesGrid').appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

/**
 * 7. Premium Custom Modal System & Dialog Controller
 */
function initModalSystem() {
    // Accessibility Feature: Close popup using Keyboard Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.activeModal) {
            closeServiceModal();
        }
    });
}

function openServiceModal(key) {
    const data = AppState.servicesData[key];
    if (!data) return;

    AppState.activeModal = key;
    const overlay = document.getElementById('serviceModalOverlay');
    const dynamicContainer = document.getElementById('modalDynamicContent');

    if (!overlay || !dynamicContainer) return;

    // Numbers & Contacts Config Data
    const primaryPhone = "7719984464";
    const waText = encodeURIComponent("नमस्कार, मला आपल्या " + data.title + " सेवेबद्दल माहिती हवी आहे.");

    dynamicContainer.innerHTML = `
        <h3 class="modal-header-title">${data.title}</h3>
        <div class="modal-section" style="margin-bottom: 18px;">
            <h4 style="color: var(--accent-saffron); font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-circle-info"></i> सेवेबद्दल माहिती:
            </h4>
            <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.9;">${data.desc}</p>
        </div>
        <div class="modal-section" style="margin-bottom: 18px;">
            <h4 style="color: var(--accent-saffron); font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-file-signature"></i> आवश्यक कागदपत्रे:
            </h4>
            <p style="background: rgba(255,153,51,0.06); border-left: 3px solid var(--accent-saffron); padding: 12px; border-radius: 4px; font-weight: 500; font-size: 0.95rem;">${data.docs}</p>
        </div>
        <div class="modal-section" style="margin-bottom: 22px;">
            <h4 style="color: var(--accent-saffron); font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-clock-rotate-left"></i> कामाचा गोषवारा:
            </h4>
            <table class="modal-table" style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.9rem;">
                <thead>
                    <tr style="background: rgba(21, 48, 91, 0.06); color: var(--primary-blue);">
                        <th style="padding: 10px; text-align: left; border: 1px solid var(--glass-border);">अंदाजित वेळ</th>
                        <th style="padding: 10px; text-align: left; border: 1px solid var(--glass-border);">अंदाजित शुल्क</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--glass-border); font-weight: 500;">${data.time}</td>
                        <td style="padding: 10px; border: 1px solid var(--glass-border); font-weight: 500;">${data.charges}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="modal-actions" style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 15px;">
            <a href="tel:${primaryPhone}" class="btn btn-blue" style="padding: 10px 22px; font-size: 0.9rem;"><i class="fa-solid fa-phone"></i> कॉल करा</a>
            <a href="https://wa.me/91${primaryPhone}?text=${waText}" target="_blank" class="btn btn-green" style="padding: 10px 22px; font-size: 0.9rem;"><i class="fa-brands fa-whatsapp"></i> व्हॉट्सॲप</a>
            <button onclick="closeServiceModal()" class="btn" style="background: #e0e0e0; color: #333; padding: 10px 22px; font-size: 0.9rem;"><i class="fa-solid fa-xmark"></i> बंद करा</button>
        </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling safely
}

function closeServiceModal() {
    const overlay = document.getElementById('serviceModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        AppState.activeModal = null;
    }
}

// Map globally accessible modal triggers safely to prevent structural script missing scope errors
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;

/**
 * 8. FAQ Accordion Component Engine
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (trigger) {
            // Unbind existing nodes to prevent potential accidental multi-trigger leaks
            const newTrigger = trigger.cloneNode(true);
            trigger.parentNode.replaceChild(newTrigger, trigger);

            newTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = item.classList.contains('active');
                
                // Close all sibling sections safely
                faqItems.forEach(sib => sib.classList.remove('active'));
                
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/**
 * 9. Form Validation & Submissions Engine
 */
function initContactForm() {
    const contactCard = document.querySelector('.contact-info-card');
    if (!contactCard) return;

    // Create Dynamic Contact Form Block for Premium Architecture UI Upgrade
    const formContainer = document.createElement('div');
    formContainer.className = 'contact-form-wrapper';
    formContainer.style.cssText = `
        margin-top: 30px; border-top: 1px solid var(--glass-border); padding-top: 25px;
    `;
    formContainer.innerHTML = `
        <h4 style="margin-bottom:15px; font-family:'Yatra One', cursive; color:var(--primary-blue)">थेट संदेश पाठवा</h4>
        <form id="centerContactForm" novalidate>
            <div style="margin-bottom:12px">
                <input type="text" id="cName" placeholder="तुमचे नाव" style="width:100%; padding:10px 15px; border-radius:8px; border:1px solid var(--glass-border); outline:none; font-size:0.9rem">
            </div>
            <div style="margin-bottom:12px">
                <input type="tel" id="cPhone" placeholder="मोबाईल नंबर" style="width:100%; padding:10px 15px; border-radius:8px; border:1px solid var(--glass-border); outline:none; font-size:0.9rem">
            </div>
            <div style="margin-bottom:15px">
                <textarea id="cMessage" rows="3" placeholder="तुम्हाला कोणती माहिती हवी आहे?" style="width:100%; padding:10px 15px; border-radius:8px; border:1px solid var(--glass-border); outline:none; font-size:0.9rem; resize:none"></textarea>
            </div>
            <button type="submit" class="btn btn-saffron" style="width:100%; justify-content:center; padding:10px; font-size:0.95rem">
                <i class="fa-solid fa-paper-plane"></i> संदेश पाठवा
            </button>
        </form>
    `;

    contactCard.appendChild(formContainer);

    const form = document.getElementById('centerContactForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('cName').value.trim();
        const phone = document.getElementById('cPhone').value.trim();
        const msg = document.getElementById('cMessage').value.trim();

        if (!name || !phone || !msg) {
            showToast("कृपया सर्व रकाने अचूक भरा!", "error");
            return;
        }

        if (phone.length < 10 || isNaN(phone)) {
            showToast("कृपया वैध १० अंकी मोबाईल नंबर टाका!", "error");
            return;
        }

        // Redirect safely to WhatsApp API using customized structured template format
        const waUrl = `https://wa.me/917719984464?text=${encodeURIComponent("नाव: " + name + "\nमोबाईल: " + phone + "\nसंदेश: " + msg)}`;
        window.open(waUrl, '_blank');
        showToast("संदेश व्हॉट्सॲपवर पाठवला जात आहे...", "success");
        form.reset();
    });
}

/**
 * 10. Peripheral Utilities (Link Copy, Share API & Toasts)
 */
function initUtilities() {
    window.copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast("वेबसाईट लिंक यशस्वीरित्या कॉपी केली!", "success"))
            .catch(() => showToast("लिंक कॉपी करण्यात अडचण आली", "error"));
    };

    window.shareWebsite = (platform) => {
        const text = "प्रताप ऑनलाइन केंद्र - सर्व डिजिटल व शासकीय सेवा एकाच ठिकाणी मिळवा: ";
        const url = window.location.href;

        if (platform === 'wa') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank');
        } else if (navigator.share) {
            navigator.share({
                title: 'प्रताप ऑनलाइन केंद्र',
                text: text,
                url: url
            }).catch(() => {});
        } else {
            window.copyLink();
        }
    };

    window.downloadRateCard = () => {
        showToast("रेट लिस्ट पीडीएफ फाईल डाऊनलोड होत आहे...", "success");
        setTimeout(() => {
            window.print();
        }, 1000);
    };
}

function showToast(message, type = "success") {
    if (!AppState.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.innerHTML = `<i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}"></i> ${message}`;
    
    AppState.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/**
 * 11. Network Management Control (Online/Offline Detection)
 */
function initNetworkMonitoring() {
    window.addEventListener('online', () => {
        showToast("कनेक्शन रिस्टोअर झाले! तुम्ही ऑनलाइन आहात.", "success");
    });
    
    window.addEventListener('offline', () => {
        showToast("इंटरनेट कनेक्शन उपलब्ध नाही. कृपया नेटवर्क तपासा!", "error");
    });
}

/**
 * 12. Progressive Web App (PWA) Client Management Systems
 */
function initPwaSupport() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        AppState.pwaPromptEvent = e;
        
        // Render discrete top premium operational upgrade install floating notification widget
        const installBadge = document.createElement('div');
        installBadge.id = 'pwaInstallBadge';
        installBadge.style.cssText = `
            position: fixed; bottom: 100px; left: 30px; z-index: 1400; background: var(--primary-blue); color: #fff; padding: 10px 16px; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight:600; box-shadow: 0 4px 12px rgba(0,0,0,0.2); animation: bounce 2s infinite; border: 1px solid var(--accent-gold);
        `;
        installBadge.innerHTML = `<i class="fa-solid fa-circle-down" style="color:var(--accent-gold)"></i> ॲप इन्स्टॉल करा`;
        document.body.appendChild(installBadge);

        installBadge.addEventListener('click', () => {
            AppState.pwaPromptEvent.prompt();
            AppState.pwaPromptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    showToast("ॲप यशस्वीरित्या इन्स्टॉल झाले!", "success");
                    installBadge.remove();
                }
                AppState.pwaPromptEvent = null;
            });
        });
    });
}

/**
 * 13. Dynamic External Animation Core Adapters
 */
function initAosAndAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false
        });
    }
}
