// DOM Elements
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};
const masonryGrid = document.getElementById('masonryGrid');
const rsvpForm = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const guestDetailsGroup = document.getElementById('guestDetailsGroup');
const additionalGuestsGroup = document.getElementById('additionalGuestsGroup');
const navBrandLink = document.querySelector('.nav-brand-link');
// Wedding date - October 17, 2025
const weddingDate = new Date('2025-10-17T16:00:00');

// Device detection
const isMobile = window.innerWidth <= 768;
const isTouch = 'ontouchstart' in window;

// Navigation functionality
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Enhanced Mobile menu functionality
function initMobileMenu() {
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
        
        // Add haptic feedback on supported devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });
    
    // Close mobile menu and smoothly scroll when clicking on a link
    mobileNavLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            mobileMenuToggle.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Delayed scroll for smooth menu close animation
                setTimeout(() => {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
    
    // Close mobile menu when clicking outside
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            mobileMenuToggle.classList.remove('active');
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Enhanced scroll effects with mobile optimizations
function handleScroll() {
    const scrolled = window.scrollY > 100; // Changed threshold for better effect
    nav.classList.toggle('scrolled', scrolled);
    updateActiveNavLink();
    
    // Enhanced parallax and transform effects
    if (window.innerWidth >= 768) {
        // Desktop parallax effects
        handleDesktopParallax();
    } else {
        // Mobile parallax effects
        handleMobileParallax();
    }
    
    // Enhanced fade in animations
    handleFadeAnimations();
}

// Desktop parallax effects
function handleDesktopParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    parallaxSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            const scrolled = window.pageYOffset - section.offsetTop;
            const rate = scrolled * -0.2;
            section.style.backgroundPositionY = `${50 + rate * 0.1}%`;
        }
    });

    // Hero image parallax
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const scrollPercent = window.scrollY / window.innerHeight;
        heroImage.style.transform = `scale(${1.1 + scrollPercent * 0.1}) translateY(${scrollPercent * 30}px)`;
    }
}

// Enhanced mobile parallax effects
// REPLACE the old handleMobileParallax function with this one

function handleMobileParallax() {
    // Handle hero image parallax first
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const scrollPercent = Math.min(window.scrollY / window.innerHeight, 1);
        const scaleValue = 1.05 + (scrollPercent * 0.1);
        const translateValue = scrollPercent * 20;
        heroImage.style.transform = `scale(${scaleValue}) translateY(${translateValue}px)`;
    }
    
    // Handle the parallax sections
    const parallaxSections = document.querySelectorAll('.parallax-section');
    parallaxSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the section is in the viewport
        if (rect.top < windowHeight && rect.bottom >= 0) {
            
            // Calculate how far the top of the section is from the bottom of the viewport.
            const distance = windowHeight - rect.top;
            
            // Adjust this speed for more or less parallax effect.
            // A smaller number (e.g., 0.2) makes the effect more pronounced.
            const parallaxSpeed = 0.25;
            
            // We move the background UP as the user scrolls DOWN.
            // A negative Y value moves the background up.
            const yPos = -(distance * parallaxSpeed);

            // Apply the new position using the full 'background-position' property
            // for maximum browser compatibility.
            section.style.backgroundPosition = `center ${yPos}px`;
        }
    });
}

// Enhanced fade animations
function handleFadeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-section, .fade-in-item, .fade-in, .slide-in-left, .slide-in-right');
    const threshold = isMobile ? 50 : 100;
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < window.innerHeight - threshold) {
            element.classList.add('visible');
        }
    });
}

// Countdown timer with enhanced mobile display
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Animated number changes on mobile
        animateCountdownChange(countdownElements.days, days.toString().padStart(3, '0'));
        animateCountdownChange(countdownElements.hours, hours.toString().padStart(2, '0'));
        animateCountdownChange(countdownElements.minutes, minutes.toString().padStart(2, '0'));
        animateCountdownChange(countdownElements.seconds, seconds.toString().padStart(2, '0'));
    } else {
        countdownElements.days.textContent = '000';
        countdownElements.hours.textContent = '00';
        countdownElements.minutes.textContent = '00';
        countdownElements.seconds.textContent = '00';
    }
}

// Animated countdown changes for mobile
function animateCountdownChange(element, newValue) {
    if (element.textContent !== newValue) {
        if (isMobile) {
            element.style.transform = 'scale(1.1)';
            element.style.color = '#fff';
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 150);
        } else {
            element.textContent = newValue;
        }
    }
}

// Enhanced gallery interactions with mobile optimizations
function initMasonryGallery() {
    if (!masonryGrid) return;
    
    const galleryItems = document.querySelectorAll('.masonry-item');
    
    if (isMobile) {
        // Mobile-specific gallery interactions
        initMobileGallery(galleryItems);
    } else {
        // Desktop gallery interactions
        initDesktopGallery(galleryItems);
    }
}

// Mobile gallery with vertical layout enhancements
function initMobileGallery(galleryItems) {
    // Enhanced touch interactions for gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        item.addEventListener('touchend', function(e) {
            this.style.transform = '';
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        }, { passive: true });
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Could add lightbox functionality here
            console.log(`Gallery item ${index + 1} clicked`);
        });
    });
}

// Desktop gallery interactions
function initDesktopGallery(galleryItems) {
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
}

// FAQ Accordion Functionality with mobile enhancements
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Haptic feedback on mobile
            if (isMobile && navigator.vibrate) {
                navigator.vibrate(40);
            }
            
            // Smooth accordion animation
            const isActive = item.classList.contains('active');
            
            if (isMobile) {
                // On mobile, close other items for better UX
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            }
            
            item.classList.toggle('active');
            
            // Scroll into view on mobile
            if (isMobile && !isActive) {
                setTimeout(() => {
                    item.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            }
        });
    });
}

// Enhanced RSVP Form handling
function initRSVPForm() {
    if (!rsvpForm) return;

    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const guestCountSelect = document.getElementById('guestCount');
    
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const isAttending = this.value === 'yes';
            
            // Smooth animations for form changes
            if (isAttending) {
                guestDetailsGroup.style.display = 'block';
                setTimeout(() => {
                    guestDetailsGroup.style.opacity = '1';
                    guestDetailsGroup.style.transform = 'translateY(0)';
                }, 10);
            } else {
                guestDetailsGroup.style.opacity = '0';
                guestDetailsGroup.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    guestDetailsGroup.style.display = 'none';
                }, 300);
                additionalGuestsGroup.style.display = 'none';
            }
            
            if (isAttending) {
                checkAdditionalGuests();
            }
            
            // Haptic feedback
            if (isMobile && navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
    });
    
    function checkAdditionalGuests() {
        const guestCount = parseInt(guestCountSelect.value);
        const additionalGuestFields = document.getElementById('additionalGuestFields');
        
        if (guestCount > 1) {
            additionalGuestsGroup.style.display = 'block';
            setTimeout(() => {
                additionalGuestsGroup.style.opacity = '1';
                additionalGuestsGroup.style.transform = 'translateY(0)';
            }, 10);
        } else {
            additionalGuestsGroup.style.opacity = '0';
            additionalGuestsGroup.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                additionalGuestsGroup.style.display = 'none';
            }, 300);
        }
        
        additionalGuestFields.innerHTML = '';
        
        for (let i = 2; i <= guestCount; i++) {
            const guestField = document.createElement('div');
            guestField.className = 'guest-field fade-in';
            guestField.style.animationDelay = `${(i - 2) * 0.1}s`;
            guestField.innerHTML = `
                <label for="guest${i}" class="form-label">Guest ${i} Full Name</label>
                <input type="text" id="guest${i}" name="guest${i}" class="form-input" placeholder="Enter full name" required>
            `;
            additionalGuestFields.appendChild(guestField);
            
            // Trigger fade-in animation
            setTimeout(() => {
                guestField.classList.add('visible');
            }, 50);
        }
    }
    
    guestCountSelect.addEventListener('change', checkAdditionalGuests);
    
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        if (isMobile && navigator.vibrate) {
            navigator.vibrate([50, 100, 50]);
        }

        const formData = new FormData(rsvpForm);
        const rawData = Object.fromEntries(formData.entries());

        if (!rawData.fullName || !rawData.contactNumber || !rawData.attendance) {
            showMobileAlert('Please fill out all required fields.');
            resetSubmitButton();
            return;
        }

        // Construct the data object in the format the backend expects
        const submissionData = {
            fullName: rawData.fullName,
            contactNumber: rawData.contactNumber,
            attendance: rawData.attendance,
            guestCount: rawData.guestCount,
            message: rawData.message,
            submittedAt: new Date().toLocaleString(),
            additionalGuests: []
        };

        // Collect additional guest names into the array
        if (rawData.guestCount > 1) {
            for (let i = 2; i <= rawData.guestCount; i++) {
                if (rawData[`guest${i}`]) {
                    submissionData.additionalGuests.push(rawData[`guest${i}`]);
                }
            }
        }

        try {
            // IMPORTANT: Replace with your Google Apps Script URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxG4X1w7HyZW07DhS0eXy754aKrYSXxM5m-OIEYMEufPlRF_blBBjt_NG2t4ToqxxFD/exec';
            
            // The backend expects the data as a JSON string in a 'postData' parameter
            const postableFormData = new FormData();
            postableFormData.append('postData', JSON.stringify(submissionData));

            const response = await fetch(scriptURL, {
                method: 'POST',
                body: postableFormData
            });

            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorResult = await response.json();
                    errorMsg += ` - ${errorResult.message || errorResult.error}`;
                } catch (jsonError) {
                    errorMsg += ` - ${response.statusText}`;
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log("Success:", result);

            if (isMobile && navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 100]);
            }
            
            rsvpForm.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Error:', error);
            showMobileAlert('There was an error submitting your RSVP. Please try again or contact us directly.');
        } finally {
            resetSubmitButton();
        }
    });
    
    function resetSubmitButton() {
        submitBtn.disabled = false;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
    
    function showMobileAlert(message) {
        if (isMobile) {
            // Create custom mobile-friendly alert
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #8c7851;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                z-index: 10000;
                font-family: inherit;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
            `;
            alertDiv.textContent = message;
            document.body.appendChild(alertDiv);
            
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        } else {
            alert(message);
        }
    }
}

// Smooth scroll for navigation links with mobile optimizations
function initSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - (isMobile ? 70 : 80);
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize brand link scroll
function initBrandLinkScroll() {
    if (navBrandLink) {
        navBrandLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Haptic feedback on mobile
            if (isMobile && navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
    }
}
// Performance optimizations
function optimizePerformance() {
    // Throttled scroll handler
    let ticking = false;
    function throttledScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Intersection Observer for fade animations (more performant)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in-section, .fade-in-item, .fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }
    
    return throttledScrollHandler;
}

// Mobile-specific touch enhancements
function initMobileTouchEnhancements() {
    if (!isMobile) return;
    
    // Prevent zoom on double tap for better UX
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Add touch ripple effects to interactive elements
    const touchElements = document.querySelectorAll('.countdown-item, .masonry-item, .faq-question, .submit-btn');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            createRippleEffect(this, e);
        }, { passive: true });
    });
    
    function createRippleEffect(element, e) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.touches[0].clientX - rect.left - size / 2;
        const y = e.touches[0].clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// DELETED: The initMobileSwipeGallery() function was here.
// It was causing the scroll-hijacking issue and is no longer needed.

// Responsive image loading for mobile
function initResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Mobile-specific countdown enhancements
function initMobileCountdown() {
    if (!isMobile) return;
    
    const countdownItems = document.querySelectorAll('.countdown-item');
    countdownItems.forEach((item, index) => {
        item.addEventListener('touchstart', function() {
            this.style.transform = 'scale(1.15)';
            this.style.textShadow = '3px 3px 12px rgba(0, 0, 0, 0.5)';
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        }, { passive: true });
        
        item.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
            this.style.textShadow = '';
        }, { passive: true });
    });
}

// Dress Code Tabs Functionality
function initDressCodeTabs() {
    const tabs = document.querySelectorAll('.dress-code-tab');
    const galleries = document.querySelectorAll('.dress-code-grid');

    if (!tabs.length || !galleries.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Don't do anything if the tab is already active
            if (tab.classList.contains('active')) {
                return;
            }

            // Remove active state from all tabs and galleries
            tabs.forEach(t => t.classList.remove('active'));
            galleries.forEach(g => g.classList.remove('active'));

            // Add active state to the clicked tab
            tab.classList.add('active');

            // Get the target gallery
            const targetId = `dressCode${tab.dataset.tab}`;
            const targetGallery = document.getElementById(targetId);

            if (targetGallery) {
                targetGallery.classList.add('active');
            }
            
            // Haptic feedback on mobile
            if (isMobile && navigator.vibrate) {
                navigator.vibrate(30);
            }
        });
    });
}

// Initialize all functionality
function init() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    initMobileMenu();
    initMasonryGallery();
    initFAQAccordion();
    initRSVPForm();
    initSmoothScroll();
    initBrandLinkScroll();
    initDressCodeTabs();
    initMobileTouchEnhancements();
    // DELETED: initMobileSwipeGallery(); // This call was causing the scroll issue.
    initResponsiveImages();
    initMobileCountdown();
    
    // Initialize optimized scroll handler
    const throttledScroll = optimizePerformance();
    
    // Initial call to set up animations
    handleScroll();
    
    // Staggered fade-in animations
    const fadeInItems = document.querySelectorAll('.fade-in-item');
    fadeInItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Mobile-specific initializations
    if (isMobile) {
        // Add smooth scrolling class to body
        document.body.classList.add('mobile-optimized');
        
        // Optimize touch scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Add viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }
    
    // Add gallery subtitle for mobile
    if (isMobile && masonryGrid) {
        const gallery = document.querySelector('.gallery');
        const subtitle = document.createElement('p');
        subtitle.className = 'gallery-subtitle';
        subtitle.textContent = 'Swipe through our beautiful moments';
        gallery.insertBefore(subtitle, masonryGrid.parentNode);
    }
}

// Event listeners with passive options for better performance
window.addEventListener('scroll', optimizePerformance(), { passive: true });
window.addEventListener('resize', () => {
    // Reinitialize on orientation change
    if (isMobile) {
        setTimeout(() => {
            initMasonryGallery();
            handleScroll();
        }, 100);
    }
}, { passive: true });

// Handle orientation change for mobile
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        handleScroll();
        // Recalculate gallery scroll positions
        if (masonryGrid && isMobile) {
            masonryGrid.scrollLeft = 0;
        }
    }, 100);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Service Worker registration for better mobile performance (optional)
if ('serviceWorker' in navigator && isMobile) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateCountdown,
        handleScroll,
        initMobileMenu,
        initMasonryGallery
    };
}