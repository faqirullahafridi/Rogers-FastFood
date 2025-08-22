// ===== RESPONSIVE COMPONENTS FOR ROGER'S RESTAURANT =====
// Ultimate responsive experience for all devices!

class ResponsiveManager {
    constructor() {
        this.currentBreakpoint = 'mobile';
        this.breakpoints = {
            mobile: 0,
            tablet: 768,
            desktop: 1024,
            large: 1440
        };
        this.init();
    }

    init() {
        try {
            this.detectBreakpoint();
            this.setupEventListeners();
            this.setupMobileNavigation();
            this.setupTouchOptimizations();
            this.setupResponsiveImages();
            this.setupOrientationHandling();
            console.log('🚀 Responsive Manager initialized');
        } catch (error) {
            console.error('❌ Error initializing Responsive Manager:', error);
            // Fallback to basic responsive behavior
            this.setupBasicResponsiveness();
        }
    }

    setupBasicResponsiveness() {
        // Fallback method if main initialization fails
        console.log('🔄 Setting up basic responsive behavior...');
        this.detectBreakpoint();
        this.setupEventListeners();
    }

    detectBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= this.breakpoints.large) {
            this.currentBreakpoint = 'large';
        } else if (width >= this.breakpoints.desktop) {
            this.currentBreakpoint = 'desktop';
        } else if (width >= this.breakpoints.tablet) {
            this.currentBreakpoint = 'tablet';
        } else {
            this.currentBreakpoint = 'mobile';
        }

        document.documentElement.setAttribute('data-breakpoint', this.currentBreakpoint);
        this.updateLayout();
    }

    updateLayout() {
        const body = document.body;
        body.className = body.className.replace(/breakpoint-\w+/g, '');
        body.classList.add(`breakpoint-${this.currentBreakpoint}`);
        
        // Update CSS custom properties based on breakpoint
        this.updateResponsiveProperties();
    }

    updateResponsiveProperties() {
        const root = document.documentElement;
        
        switch (this.currentBreakpoint) {
            case 'mobile':
                root.style.setProperty('--grid-columns', '1');
                root.style.setProperty('--menu-height', '180px');
                break;
            case 'tablet':
                root.style.setProperty('--grid-columns', '2');
                root.style.setProperty('--menu-height', '220px');
                break;
            case 'desktop':
                root.style.setProperty('--grid-columns', '3');
                root.style.setProperty('--menu-height', '250px');
                break;
            case 'large':
                root.style.setProperty('--grid-columns', '4');
                root.style.setProperty('--menu-height', '280px');
                break;
        }
    }

    setupEventListeners() {
        try {
            window.addEventListener('resize', this.debounce(() => {
                this.detectBreakpoint();
            }, 250));

            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.detectBreakpoint();
                    this.handleOrientationChange();
                }, 100);
            });

            // Performance optimization: passive scroll listener
            window.addEventListener('scroll', () => {
                this.handleScroll();
            }, { passive: true });
        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
        }
    }

    setupMobileNavigation() {
        const mobileToggle = document.querySelector('.nav-mobile-toggle');
        const mobileNav = document.querySelector('.nav-mobile');
        const body = document.body;

        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu(mobileNav, body);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                    this.closeMobileMenu(mobileNav, body);
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu(mobileNav, body);
                }
            });
        }
    }

    toggleMobileMenu(mobileNav, body) {
        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu(mobileNav, body);
        } else {
            this.openMobileMenu(mobileNav, body);
        }
    }

    openMobileMenu(mobileNav, body) {
        mobileNav.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstLink = mobileNav.querySelector('a, button');
        if (firstLink) firstLink.focus();
    }

    closeMobileMenu(mobileNav, body) {
        mobileNav.classList.remove('active');
        body.style.overflow = '';
        
        // Return focus to toggle button
        const toggle = document.querySelector('.nav-mobile-toggle');
        if (toggle) toggle.focus();
    }

    setupTouchOptimizations() {
        // Detect touch device
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouch) {
            document.body.classList.add('touch-device');
            this.optimizeForTouch();
        } else {
            document.body.classList.add('mouse-device');
        }
    }

    optimizeForTouch() {
        // Increase touch targets
        const touchTargets = document.querySelectorAll('.btn, .nav-item, .menu-item');
        touchTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        });

        // Add touch feedback
        this.addTouchFeedback();
    }

    addTouchFeedback() {
        const touchElements = document.querySelectorAll('.btn, .menu-item, .nav-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-srcset]');
        
        images.forEach(img => {
            this.createResponsiveImage(img);
        });
    }

    createResponsiveImage(img) {
        const srcset = img.dataset.srcset;
        if (!srcset) return;

        // Create responsive image based on breakpoint
        const sizes = {
            mobile: '100vw',
            tablet: '50vw',
            desktop: '33vw',
            large: '25vw'
        };

        img.sizes = sizes[this.currentBreakpoint] || '100vw';
        
        // Update srcset for current breakpoint
        this.updateImageSrcset(img);
    }

    updateImageSrcset(img) {
        const breakpoint = this.currentBreakpoint;
        const srcset = img.dataset.srcset;
        
        if (!srcset) return;

        // Parse srcset and select appropriate size
        const srcsetParts = srcset.split(',').map(part => part.trim());
        let selectedSrc = srcsetParts[0]; // Default to first

        // Select based on breakpoint
        switch (breakpoint) {
            case 'mobile':
                selectedSrc = srcsetParts.find(part => part.includes('320w') || part.includes('480w')) || selectedSrc;
                break;
            case 'tablet':
                selectedSrc = srcsetParts.find(part => part.includes('768w') || part.includes('1024w')) || selectedSrc;
                break;
            case 'desktop':
                selectedSrc = srcsetParts.find(part => part.includes('1024w') || part.includes('1200w')) || selectedSrc;
                break;
            case 'large':
                selectedSrc = srcsetParts.find(part => part.includes('1440w') || part.includes('1920w')) || selectedSrc;
                break;
        }

        // Update image source
        const src = selectedSrc.split(' ')[0];
        if (src && img.src !== src) {
            img.src = src;
        }
    }

    setupOrientationHandling() {
        // Handle landscape/portrait changes
        this.handleOrientationChange();
    }

    handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const body = document.body;
        
        if (isLandscape) {
            body.classList.add('landscape');
            body.classList.remove('portrait');
        } else {
            body.classList.add('portrait');
            body.classList.remove('landscape');
        }

        // Adjust layout for orientation
        this.adjustLayoutForOrientation(isLandscape);
    }

    adjustLayoutForOrientation(isLandscape) {
        const hero = document.querySelector('.hero');
        const menuGrid = document.querySelector('.menu-grid');
        
        if (isLandscape && window.innerHeight < 500) {
            // Compact layout for landscape mobile
            if (hero) {
                hero.style.minHeight = '100vh';
                hero.style.padding = 'var(--space-lg) var(--space-md)';
            }
            
            if (menuGrid) {
                menuGrid.style.gap = 'var(--grid-gap-sm)';
            }
        } else {
            // Normal layout
            if (hero) {
                hero.style.minHeight = '';
                hero.style.padding = '';
            }
            
            if (menuGrid) {
                menuGrid.style.gap = '';
            }
        }
    }

    handleScroll() {
        // Add scroll-based optimizations
        const scrolled = window.pageYOffset > 100;
        const header = document.querySelector('header');
        
        if (header) {
            if (scrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Lazy load images on scroll
        this.lazyLoadOnScroll();
    }

    lazyLoadOnScroll() {
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            if (this.isElementInViewport(img)) {
                this.loadImage(img);
            }
        });
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Get current breakpoint
    getBreakpoint() {
        return this.currentBreakpoint;
    }

    // Check if current breakpoint matches
    isBreakpoint(breakpoint) {
        return this.currentBreakpoint === breakpoint;
    }

    // Check if current breakpoint is at least
    isAtLeast(breakpoint) {
        const breakpointOrder = ['mobile', 'tablet', 'desktop', 'large'];
        const currentIndex = breakpointOrder.indexOf(this.currentBreakpoint);
        const targetIndex = breakpointOrder.indexOf(breakpoint);
        return currentIndex >= targetIndex;
    }

    // Get device capabilities
    getDeviceCapabilities() {
        return {
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            isMobile: this.currentBreakpoint === 'mobile',
            isTablet: this.currentBreakpoint === 'tablet',
            isDesktop: this.currentBreakpoint === 'desktop' || this.currentBreakpoint === 'large',
            hasHighDPI: window.devicePixelRatio > 1,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        };
    }
}

// ===== RESPONSIVE UTILITY FUNCTIONS =====

// Responsive image loader
function loadResponsiveImage(img, breakpoint) {
    const sizes = {
        mobile: '320w',
        tablet: '768w',
        desktop: '1024w',
        large: '1440w'
    };
    
    const size = sizes[breakpoint] || '320w';
    const srcset = img.dataset.srcset;
    
    if (srcset) {
        const src = srcset.split(',').find(part => part.includes(size));
        if (src) {
            img.src = src.split(' ')[0];
        }
    }
}

// Responsive grid system
function updateGridColumns(container, breakpoint) {
    const columns = {
        mobile: 1,
        tablet: 2,
        desktop: 3,
        large: 4
    };
    
    const columnCount = columns[breakpoint] || 1;
    container.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
}

// Responsive spacing
function updateSpacing(element, breakpoint) {
    const spacing = {
        mobile: 'var(--space-sm)',
        tablet: 'var(--space-md)',
        desktop: 'var(--space-lg)',
        large: 'var(--space-xl)'
    };
    
    const space = spacing[breakpoint] || 'var(--space-sm)';
    element.style.padding = space;
}

// ===== INITIALIZE RESPONSIVE SYSTEM =====

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize responsive manager
        window.responsiveManager = new ResponsiveManager();
        
        // Add responsive classes to body
        document.body.classList.add('responsive-enabled');
        
        console.log('🎯 Responsive system ready for all devices!');
    } catch (error) {
        console.error('❌ Error initializing responsive system:', error);
        // Fallback: add basic responsive classes
        document.body.classList.add('responsive-enabled', 'breakpoint-mobile');
        console.log('🔄 Basic responsive system enabled');
    }
});

// Export for use in other modules
window.ResponsiveManager = ResponsiveManager;
window.loadResponsiveImage = loadResponsiveImage;
window.updateGridColumns = updateGridColumns;
window.updateSpacing = updateSpacing;
