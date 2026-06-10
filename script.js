// Language Toggle Functionality
const langBtns = document.querySelectorAll('.lang-btn');
const body = document.getElementById('body');
const translatableElements = document.querySelectorAll('.trans');

// Set default language to English or saved preference
let currentLang = localStorage.getItem('language') || 'en';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setLanguage(currentLang);
    setupLanguageButtons();
    setupFormPlaceholders();
    initMobileNav();
    initGalleryFilter();
    initLightbox();
    initStatsCounter();
    animateOnScroll();
});

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update body class and direction
    if (lang === 'ur') {
        body.classList.add('urdu');
        document.documentElement.setAttribute('lang', 'ur');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        body.classList.remove('urdu');
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
    }
    
    // Update all translatable elements
    translatableElements.forEach(el => {
        if (lang === 'ur' && el.getAttribute('data-ur')) {
            el.textContent = el.getAttribute('data-ur');
        } else if (lang === 'en' && el.getAttribute('data-en')) {
            el.textContent = el.getAttribute('data-en');
        }
    });
    
    // Update active button
    langBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update form placeholders
    setupFormPlaceholders();

    // Update lightbox caption if open
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        updateLightboxImage();
    }
}

function setupLanguageButtons() {
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

function setupFormPlaceholders() {
    const inputs = document.querySelectorAll('input[data-placeholder-en]');
    const textareas = document.querySelectorAll('textarea[data-placeholder-en]');
    
    inputs.forEach(input => {
        if (currentLang === 'ur') {
            input.placeholder = input.getAttribute('data-placeholder-ur');
        } else {
            input.placeholder = input.getAttribute('data-placeholder-en');
        }
    });
    
    textareas.forEach(textarea => {
        if (currentLang === 'ur') {
            textarea.placeholder = textarea.getAttribute('data-placeholder-ur');
        } else {
            textarea.placeholder = textarea.getAttribute('data-placeholder-en');
        }
    });
}

// Mobile navigation menu toggle
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
}

// Gallery Filter
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }
}

// Lightbox Modal Functionality
let activeGalleryItems = [];
let currentImageIndex = 0;

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    if (activeGalleryItems[currentImageIndex] && lightboxImg && lightboxCaption) {
        const img = activeGalleryItems[currentImageIndex].querySelector('img');
        const captionEl = activeGalleryItems[currentImageIndex].querySelector('.gallery-caption');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (captionEl) {
            if (currentLang === 'ur') {
                lightboxCaption.textContent = captionEl.getAttribute('data-ur') || captionEl.textContent;
            } else {
                lightboxCaption.textContent = captionEl.getAttribute('data-en') || captionEl.textContent;
            }
        } else {
            lightboxCaption.textContent = img.alt;
        }
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (lightbox && galleryItems.length > 0) {
        // Open lightbox when item is clicked
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                activeGalleryItems = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
                currentImageIndex = activeGalleryItems.indexOf(this);
                
                lightbox.classList.add('active');
                updateLightboxImage();
                document.body.style.overflow = 'hidden'; // Disable scroll on body
            });
        });
        
        // Close Lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close on click outside image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Prev Button
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function(e) {
                e.stopPropagation();
                if (activeGalleryItems.length > 0) {
                    currentImageIndex = (currentImageIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
                    updateLightboxImage();
                }
            });
        }
        
        // Next Button
        if (lightboxNext) {
            lightboxNext.addEventListener('click', function(e) {
                e.stopPropagation();
                if (activeGalleryItems.length > 0) {
                    currentImageIndex = (currentImageIndex + 1) % activeGalleryItems.length;
                    updateLightboxImage();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            } else if (e.key === 'ArrowLeft') {
                if (activeGalleryItems.length > 0) {
                    currentImageIndex = (currentImageIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
                    updateLightboxImage();
                }
            } else if (e.key === 'ArrowRight') {
                if (activeGalleryItems.length > 0) {
                    currentImageIndex = (currentImageIndex + 1) % activeGalleryItems.length;
                    updateLightboxImage();
                }
            }
        });
    }
}

// Animated Stats Counter
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 30);
        let current = 0;
        
        const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = current;
            }
        }, stepTime);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// Smooth scrolling functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToGallery() {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const phone = document.getElementById('form-phone').value;
            const message = document.getElementById('form-message').value;
            
            // Show success message based on language
            const successMsg = currentLang === 'ur' 
                ? 'شکریہ! آپ کا پیغام بھیج دیا گیا ہے۔\n\nہم جلد ہی آپ سے رابطہ کریں گے۔'
                : 'Thank you! Your message has been sent.\n\nWe will contact you soon.';
            
            alert(successMsg);
            form.reset();
        });
    }
});

// Add scroll animation to elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .stat-box, .testimonial-card, .gallery-item, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section, header');
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollTop >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Console branding
console.log('%cHaleem Private Limited', 'font-size: 24px; font-weight: bold; color: #B91C1C;');
console.log('%cAuthorized Millat Tractor Dealer in Khanewal', 'font-size: 14px; color: #F59E0B;');
