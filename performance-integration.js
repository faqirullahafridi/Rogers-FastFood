// Performance Integration for Roger's Restaurant
// This file integrates all performance optimizations into the main application

// Wait for all performance modules to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if all required modules are loaded
    if (!window.PerformanceComponents || !window.PerformanceUtils) {
        console.warn('Performance modules not fully loaded, some optimizations may not work');
        return;
    }

    console.log('🚀 Starting performance integration...');

    try {
        // Initialize Service Worker (will skip if file:// protocol)
        initializeServiceWorker();
        
        // Initialize Performance Monitoring
        initializePerformanceMonitoring();
        
        // Initialize Image Error Handling (CRITICAL FIX)
        initializeImageErrorHandling();
        
        // Initialize Image Optimizations
        initializeImageOptimizations();
        
        // Initialize Memory Management
        initializeMemoryManagement();
        
        // Initialize Adaptive Loading
        initializeAdaptiveLoading();
        
        // Initialize Error Boundaries
        initializeErrorBoundaries();
        
        console.log('✅ Performance integration completed successfully');
    } catch (error) {
        console.log('ℹ️ Performance integration failed:', error.message);
    }
});

// Service Worker Initialization
function initializeServiceWorker() {
    // Check if we're running from a supported protocol (https or localhost)
    if (location.protocol === 'file:' || location.protocol === 'null') {
        console.log('ℹ️ Service Worker not supported in file:// protocol. Use a local server for full functionality.');
        return;
    }
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully:', registration.scope);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            // showUpdateNotification(); // Commented out to hide update notification
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ Service Worker registration failed:', error);
            });
    } else {
        console.warn('⚠️ Service Worker not supported in this browser');
    }
}

// Performance Monitoring Initialization
function initializePerformanceMonitoring() {
    try {
        // Check if PerformanceComponents is available
        if (!window.PerformanceComponents || !window.PerformanceComponents.PerformanceMonitor) {
            console.log('ℹ️ Performance monitoring components not available');
            return;
        }
        
        const monitor = new window.PerformanceComponents.PerformanceMonitor();
        
        // Monitor key user interactions
        const interactions = [
            { element: '.menu-item', action: 'Menu Item View' },
            { element: '.btn-add-to-cart', action: 'Add to Cart' },
            { element: '.nav-item', action: 'Navigation Click' },
            { element: '.search-input', action: 'Search Input' }
        ];
        
        interactions.forEach(({ element, action }) => {
            document.addEventListener('click', (e) => {
                if (e.target.closest(element)) {
                    try {
                        monitor.logInteraction(action, Date.now());
                    } catch (error) {
                        console.log('ℹ️ Performance monitoring interaction failed:', error.message);
                    }
                }
            });
        });
        
        // Add performance dashboard to page (hidden by default)
        // addPerformanceDashboard(monitor); // Commented out - not visible to users
    } catch (error) {
        console.log('ℹ️ Performance monitoring initialization failed:', error.message);
    }
}

// Performance Dashboard
function addPerformanceDashboard(monitor) {
    const dashboard = document.createElement('div');
    dashboard.className = 'performance-dashboard';
    dashboard.innerHTML = `
        <h4>Performance Monitor</h4>
        <div class="performance-metric">
            <span>Page Load:</span>
            <span id="page-load-time">-</span>
        </div>
        <div class="performance-metric">
            <span>First Paint:</span>
            <span id="first-paint-time">-</span>
        </div>
        <div class="performance-metric">
            <span>Interactions:</span>
            <span id="interaction-count">0</span>
        </div>
        <div class="performance-metric">
            <span>Memory:</span>
            <span id="memory-usage">-</span>
        </div>
        <button onclick="this.parentElement.style.display='none'" style="margin-top: 10px; padding: 5px 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Hide</button>
    `;
    
    document.body.appendChild(dashboard);
    
    // Update metrics periodically
    setInterval(() => {
        updatePerformanceMetrics(monitor);
    }, 2000);
}

// Update Performance Metrics
function updatePerformanceMetrics(monitor) {
    const summary = monitor.getSummary();
    
    // Update dashboard
    const pageLoadEl = document.getElementById('page-load-time');
    const firstPaintEl = document.getElementById('first-paint-time');
    const interactionEl = document.getElementById('interaction-count');
    const memoryEl = document.getElementById('memory-usage');
    
    if (pageLoadEl && summary.pageLoad) {
        pageLoadEl.textContent = `${summary.pageLoad}ms`;
    }
    
    if (firstPaintEl && summary.firstPaint) {
        firstPaintEl.textContent = `${summary.firstPaint}ms`;
    }
    
    if (interactionEl) {
        interactionEl.textContent = summary.totalInteractions;
    }
    
    if (memoryEl) {
        const memory = window.PerformanceUtils.MemoryManager.getMemoryInfo();
        if (memory) {
            const usagePercent = ((memory.used / memory.limit) * 100).toFixed(1);
            memoryEl.textContent = `${usagePercent}%`;
        }
    }
}

// Image Optimizations Initialization
function initializeImageOptimizations() {
    try {
        // Check if PerformanceUtils is available
        if (!window.PerformanceUtils || !window.PerformanceUtils.ImageOptimizer) {
            console.log('ℹ️ Image optimization components not available');
            return;
        }
        
        const { ImageOptimizer, PerformanceUtils } = window.PerformanceUtils;
        
        // Optimize existing images
        document.querySelectorAll('img').forEach(img => {
            try {
                if (img.src.includes('pexels.com')) {
                    // Optimize Pexels images based on device
                    const deviceTier = PerformanceUtils.getDeviceTier();
                    const optimizedUrl = ImageOptimizer.optimizeImageQuality(img.src, window.devicePixelRatio);
                    
                    if (optimizedUrl !== img.src) {
                        img.dataset.src = optimizedUrl;
                        img.classList.add('lazy');
                        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Placeholder
                    }
                }
            } catch (error) {
                console.log('ℹ️ Image optimization failed for:', img.src, error.message);
            }
        });
        
        // Initialize lazy loading
        ImageOptimizer.initLazyLoading();
        
        // Preload critical images
        const criticalImages = [
            'images/logo.jpg',
            'images/ovenwings.jpg'
        ];
        ImageOptimizer.preloadImages(criticalImages);
    } catch (error) {
        console.log('ℹ️ Image optimization initialization failed:', error.message);
    }
}

// Image Error Handling Initialization (CRITICAL FIX)
function initializeImageErrorHandling() {
    console.log('🖼️ Initializing comprehensive image error handling...');
    
    // Handle all existing images
    document.querySelectorAll('img').forEach(img => {
        setupImageErrorHandling(img);
    });
    
    // Handle dynamically added images
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    setupImageErrorHandling(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(img => {
                        setupImageErrorHandling(img);
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

function setupImageErrorHandling(img) {
    // Skip if already handled
    if (img.dataset.errorHandled) return;
    
    img.dataset.errorHandled = 'true';
    
    // Add loading state
    img.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
    img.style.minHeight = '200px';
    
    // Handle load success
    img.addEventListener('load', () => {
        img.style.background = 'transparent';
        img.classList.add('loaded');
    });
    
    // Handle load error
    img.addEventListener('error', () => {
        console.log('🖼️ Image failed to load:', img.src);
        
        // Create fallback content
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.style.cssText = `
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px solid #dee2e6;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #6c757d;
            font-size: 0.875rem;
            text-align: center;
            padding: 1rem;
        `;
        
        fallback.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🍽️</div>
            <div>Menu Item Image</div>
            ${img.alt ? `<div style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.7;">${img.alt}</div>` : ''}
        `;
        
        // Replace image with fallback
        img.parentNode.replaceChild(fallback, img);
    });
    
    // Force reload if external image
    if (img.src.includes('pexels.com') || img.src.includes('unsplash.com')) {
        // Add timeout to trigger error if image doesn't load quickly
        setTimeout(() => {
            if (!img.complete || !img.naturalHeight) {
                img.dispatchEvent(new Event('error'));
            }
        }, 5000);
    }
}

// Memory Management Initialization
function initializeMemoryManagement() {
    const { MemoryManager } = window.PerformanceUtils;
    
    // Monitor memory usage
    setInterval(() => {
        if (MemoryManager.isMemoryHigh()) {
            console.warn('⚠️ High memory usage detected, cleaning up...');
            MemoryManager.cleanup();
        }
    }, 10000); // Check every 10 seconds
    
    // Clean up on page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, clean up memory
            MemoryManager.cleanup();
        }
    });
}

// Adaptive Loading Initialization
function initializeAdaptiveLoading() {
    const { PerformanceUtils: PerfUtils } = window.PerformanceUtils;
    
    // Get device capabilities
    const deviceTier = PerfUtils.getDeviceTier();
    const connectionInfo = window.PerformanceUtils.NetworkUtils.getConnectionInfo();
    
    console.log(`📱 Device Tier: ${deviceTier}`);
    console.log(`🌐 Connection: ${connectionInfo ? connectionInfo.effectiveType : 'Unknown'}`);
    
    // Apply adaptive settings
    const settings = PerfUtils.adaptiveLoading();
    
    if (!settings.animations) {
        // Disable animations for low-end devices
        document.documentElement.style.setProperty('--animation-duration', '0ms');
        document.documentElement.style.setProperty('--transition-duration', '0ms');
    }
    
    if (settings.imageQuality === 'low') {
        // Use lower quality images
        document.querySelectorAll('img[src*="pexels.com"]').forEach(img => {
            img.src = img.src.replace(/w=\d+/, 'w=300').replace(/h=\d+/, 'h=225');
        });
    }
}

// Error Boundaries Initialization
function initializeErrorBoundaries() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('🚨 Global error caught:', event.error);
        
        // Send to error reporting service if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: event.error.message,
                fatal: false
            });
        }
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        
        // Send to error reporting service if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: 'Unhandled Promise Rejection',
                fatal: false
            });
        }
    });
}

// Update Notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        font-family: 'Inter', sans-serif;
    `;
    
    notification.innerHTML = `
        <h4 style="margin: 0 0 10px 0;">🔄 Update Available</h4>
        <p style="margin: 0 0 15px 0; font-size: 14px;">A new version of the website is available. Refresh to update.</p>
        <button onclick="window.location.reload()" style="background: white; color: var(--primary); border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">Refresh Now</button>
        <button onclick="this.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Dismiss</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// Performance Testing Functions
window.PerformanceTest = {
    // Test image loading performance
    testImageLoading: () => {
        const start = performance.now();
        const images = document.querySelectorAll('img');
        let loadedCount = 0;
        
        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        const end = performance.now();
                        console.log(`📊 All images loaded in ${(end - start).toFixed(2)}ms`);
                    }
                });
            }
        });
        
        if (loadedCount === images.length) {
            const end = performance.now();
            console.log(`📊 All images loaded in ${(end - start).toFixed(2)}ms`);
        }
    },
    
    // Test scroll performance
    testScrollPerformance: () => {
        const start = performance.now();
        let frameCount = 0;
        
        const testScroll = () => {
            frameCount++;
            if (frameCount < 60) {
                window.scrollBy(0, 1);
                requestAnimationFrame(testScroll);
            } else {
                const end = performance.now();
                const fps = (frameCount / (end - start)) * 1000;
                console.log(`📊 Scroll performance: ${fps.toFixed(1)} FPS`);
            }
        };
        
        requestAnimationFrame(testScroll);
    },
    
    // Test memory usage
    testMemoryUsage: () => {
        const memory = window.PerformanceUtils.MemoryManager.getMemoryInfo();
        if (memory) {
            console.log(`📊 Memory Usage: ${(memory.used / 1024 / 1024).toFixed(2)}MB / ${(memory.limit / 1024 / 1024).toFixed(2)}MB`);
        } else {
            console.log('📊 Memory information not available');
        }
    }
};

// Export integration functions
window.PerformanceIntegration = {
    initializeServiceWorker,
    initializePerformanceMonitoring,
    initializeImageOptimizations,
    initializeMemoryManagement,
    initializeAdaptiveLoading,
    initializeErrorBoundaries
};

console.log('🔗 Performance Integration module loaded');
