// Performance Utilities for Roger's Restaurant
// This file contains utility functions for optimizing performance

// Image Optimization Utilities
const ImageOptimizer = {
    // Lazy load images with Intersection Observer
    initLazyLoading: () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            ImageOptimizer.fallbackLazyLoading();
        }
    },

    // Fallback lazy loading for older browsers
    fallbackLazyLoading: () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        let lazyImageThrottle;

        const lazyLoad = () => {
            if (lazyImageThrottle) {
                clearTimeout(lazyImageThrottle);
            }

            lazyImageThrottle = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                lazyImages.forEach(img => {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy');
                    }
                });
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationchange', lazyLoad);
                }
            }, 20);
        };

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
        lazyLoad();
    },

    // Preload critical images
    preloadImages: (imageUrls) => {
        imageUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    },

    // Optimize image quality based on device
    optimizeImageQuality: (imageUrl, devicePixelRatio = 1) => {
        if (devicePixelRatio > 2) {
            // High DPI devices - serve higher quality
            return imageUrl.replace(/w=\d+/, 'w=800').replace(/h=\d+/, 'h=600');
        } else if (devicePixelRatio > 1) {
            // Medium DPI devices
            return imageUrl.replace(/w=\d+/, 'w=600').replace(/h=\d+/, 'h=450');
        } else {
            // Standard DPI devices
            return imageUrl.replace(/w=\d+/, 'w=400').replace(/h=\d+/, 'h=300');
        }
    }
};

// Performance Monitoring Utilities
const PerformanceUtils = {
    // Measure time for functions
    measureTime: (fn, name = 'Function') => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`⏱️ ${name} took ${(end - start).toFixed(2)}ms`);
        return result;
    },

    // Debounce function calls
    debounce: (func, wait, immediate) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function calls
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get device performance tier
    getDeviceTier: () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        
        if (connection && connection.effectiveType === '4g' && memory >= 4 && cores >= 4) {
            return 'high';
        } else if (connection && connection.effectiveType === '3g' && memory >= 2 && cores >= 2) {
            return 'medium';
        } else {
            return 'low';
        }
    },

    // Adaptive loading based on device performance
    adaptiveLoading: () => {
        const tier = PerformanceUtils.getDeviceTier();
        
        switch (tier) {
            case 'high':
                // Load everything
                return { 
                    imageQuality: 'high',
                    animations: true,
                    preload: true,
                    lazyLoad: false
                };
            case 'medium':
                // Balanced approach
                return {
                    imageQuality: 'medium',
                    animations: true,
                    preload: false,
                    lazyLoad: true
                };
            case 'low':
                // Minimal loading
                return {
                    imageQuality: 'low',
                    animations: false,
                    preload: false,
                    lazyLoad: true
                };
        }
    }
};

// Cache Management Utilities
const CacheManager = {
    // Set item in localStorage with expiration
    setWithExpiry: (key, value, ttl) => {
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    // Get item from localStorage with expiration check
    getWithExpiry: (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    },

    // Clear expired cache items
    clearExpired: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
                CacheManager.getWithExpiry(key);
            }
        });
    },

    // Cache API wrapper
    cacheAPI: {
        async set(key, response, options = {}) {
            if ('caches' in window) {
                const cache = await caches.open('rogers-dynamic');
                await cache.put(key, response);
            }
        },

        async get(key) {
            if ('caches' in window) {
                const cache = await caches.open('rogers-dynamic');
                return await cache.match(key);
            }
            return null;
        }
    }
};

// Network Utilities
const NetworkUtils = {
    // Check online status
    isOnline: () => navigator.onLine,

    // Get connection info
    getConnectionInfo: () => {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    },

    // Adaptive image loading based on connection
    getOptimalImageSize: (connectionInfo) => {
        if (!connectionInfo) return 'medium';
        
        if (connectionInfo.effectiveType === '4g' && connectionInfo.downlink > 10) {
            return 'high';
        } else if (connectionInfo.effectiveType === '3g' && connectionInfo.downlink > 5) {
            return 'medium';
        } else {
            return 'low';
        }
    },

    // Retry failed requests
    retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }
};

// Memory Management Utilities
const MemoryManager = {
    // Monitor memory usage
    getMemoryInfo: () => {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    },

    // Check if memory usage is high
    isMemoryHigh: () => {
        const memory = MemoryManager.getMemoryInfo();
        if (memory) {
            return (memory.used / memory.limit) > 0.8;
        }
        return false;
    },

    // Clean up memory
    cleanup: () => {
        // Clear any stored references
        if (window.gc) {
            window.gc();
        }
        
        // Clear image cache if memory is high
        if (MemoryManager.isMemoryHigh()) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!ImageOptimizer.isInViewport(img)) {
                    img.src = '';
                }
            });
        }
    }
};

// Animation Utilities
const AnimationUtils = {
    // Smooth scroll to element
    smoothScrollTo: (element, duration = 500) => {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    // Fade in element
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    },

    // Stagger animation for multiple elements
    staggerAnimation: (elements, animationFn, delay = 100) => {
        elements.forEach((element, index) => {
            setTimeout(() => {
                animationFn(element);
            }, index * delay);
        });
    }
};

// Export all utilities
window.PerformanceUtils = {
    ImageOptimizer,
    PerformanceUtils,
    CacheManager,
    NetworkUtils,
    MemoryManager,
    AnimationUtils
};

// Initialize utilities when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    ImageOptimizer.initLazyLoading();
    
    // Clear expired cache items
    CacheManager.clearExpired();
    
    // Set up memory cleanup interval
    setInterval(MemoryManager.cleanup, 30000); // Every 30 seconds
    
    console.log('🚀 Performance Utilities loaded successfully');
});

console.log('📦 Performance Utilities module loaded');
