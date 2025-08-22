// Performance Components for Roger's Restaurant
// This file contains optimized React components for better performance

// Loading Spinner Component
const LoadingSpinner = ({ message = 'Loading delicious food...' }) => {
    return React.createElement('div', { className: 'loading-spinner' }, [
        React.createElement('div', { className: 'spinner', key: 'spinner' }),
        React.createElement('p', { key: 'text' }, message)
    ]);
};

// Skeleton Loading Component for Menu Items
const MenuItemSkeleton = () => {
    return React.createElement('div', { className: 'menu-item-skeleton' }, [
        React.createElement('div', { className: 'skeleton-image', key: 'image' }),
        React.createElement('div', { className: 'skeleton-content', key: 'content' }, [
            React.createElement('div', { className: 'skeleton-title', key: 'title' }),
            React.createElement('div', { className: 'skeleton-description', key: 'desc' }),
            React.createElement('div', { className: 'skeleton-footer', key: 'footer' })
        ])
    ]);
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error for debugging
        console.error('Error caught by boundary:', error, errorInfo);
        
        // You could send this to an error reporting service
        // logErrorToService(error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return React.createElement('div', { className: 'error-fallback' }, [
                React.createElement('div', { className: 'error-icon', key: 'icon' }, '⚠️'),
                React.createElement('h2', { key: 'title' }, 'Oops! Something went wrong'),
                React.createElement('p', { key: 'message' }, 'We encountered an unexpected error. Please refresh the page to try again.'),
                React.createElement('button', {
                    key: 'refresh',
                    className: 'error-refresh-btn',
                    onClick: () => window.location.reload()
                }, 'Refresh Page'),
                React.createElement('button', {
                    key: 'home',
                    className: 'error-home-btn',
                    onClick: () => window.location.href = '/'
                }, 'Go to Home')
            ]);
        }
        return this.props.children;
    }
}

// Memoized Menu Item Component for better performance
const MemoizedMenuItem = React.memo(({ item, onAddToCart, onQuickView, index }) => {
    const handleAddToCart = React.useCallback(() => {
        onAddToCart(item);
    }, [onAddToCart, item]);
    
    const handleQuickView = React.useCallback(() => {
        onQuickView(item);
    }, [onQuickView, item]);
    
    return React.createElement('div', { 
        className: 'menu-item',
        key: item.name,
        'data-index': index
    }, [
        React.createElement('div', { className: 'menu-item-image', key: 'image' }, [
            React.createElement('img', {
                src: item.image,
                alt: item.name,
                loading: 'lazy',
                decoding: 'async',
                onError: (e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                },
                key: 'img'
            }),
            React.createElement('div', { 
                className: 'fallback-image',
                style: { display: 'none' },
                key: 'fallback'
                         }, '🍽️')
        ]),
        React.createElement('div', { className: 'menu-item-content', key: 'content' }, [
            React.createElement('h3', { key: 'name' }, item.name),
            React.createElement('p', { className: 'menu-item-description', key: 'desc' }, item.description),
            React.createElement('div', { className: 'menu-item-footer', key: 'footer' }, [
                React.createElement('span', { className: 'price', key: 'price' }, item.price),
                React.createElement('button', {
                    className: 'btn-add-to-cart',
                    onClick: handleAddToCart,
                    key: 'add-btn'
                }, 'Add to Cart')
            ])
        ])
    ]);
});

// Virtual Scrolling Component for large menus
const VirtualizedMenuList = ({ items, itemHeight = 200, containerHeight = 600 }) => {
    const [scrollTop, setScrollTop] = React.useState(0);
    const containerRef = React.useRef(null);
    
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);
    
    const visibleItems = items.slice(startIndex, endIndex);
    const totalHeight = items.length * itemHeight;
    const offsetY = startIndex * itemHeight;
    
    const handleScroll = React.useCallback((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);
    
    React.useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);
    
    return React.createElement('div', {
        ref: containerRef,
        className: 'virtualized-container',
        style: { height: containerHeight, overflow: 'auto' }
    }, [
        React.createElement('div', {
            key: 'spacer',
            style: { height: offsetY }
        }),
        ...visibleItems.map((item, index) => 
            React.createElement(MemoizedMenuItem, {
                key: item.name,
                item: item,
                onAddToCart: () => {}, // Pass your handler here
                onQuickView: () => {}, // Pass your handler here
                index: startIndex + index
            })
        ),
        React.createElement('div', {
            key: 'bottom-spacer',
            style: { height: totalHeight - offsetY - (visibleItems.length * itemHeight) }
        })
    ]);
};

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.startTime = Date.now();
        this.metrics = {
            pageLoad: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            interactions: []
        };
        this.init();
    }
    
    init() {
        // Measure page load time
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.pageLoad = Date.now() - this.startTime;
                this.logMetric('Page Load', this.metrics.pageLoad);
            });
        } else {
            this.metrics.pageLoad = Date.now() - this.startTime;
            this.logMetric('Page Load', this.metrics.pageLoad);
        }
        
        // Measure paint times
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                        this.logMetric('First Paint', this.metrics.firstPaint);
                    }
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                        this.logMetric('First Contentful Paint', this.metrics.firstContentfulPaint);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }
    
    logInteraction(action, duration) {
        this.metrics.interactions.push({ action, duration, timestamp: Date.now() });
        this.logMetric(action, duration);
    }
    
    logMetric(name, value) {
        console.log(`📊 ${name}: ${value}ms`);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                metric_name: name,
                metric_value: value
            });
        }
    }
    
    getSummary() {
        return {
            ...this.metrics,
            totalInteractions: this.metrics.interactions.length,
            averageInteractionTime: this.metrics.interactions.reduce((sum, i) => sum + i.duration, 0) / this.metrics.interactions.length || 0
        };
    }
}

// Lazy Loading Hook
const useLazyLoad = (items, itemsPerPage = 10) => {
    const [visibleItems, setVisibleItems] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    
    React.useEffect(() => {
        const startIndex = 0;
        const endIndex = currentPage * itemsPerPage;
        const newItems = items.slice(startIndex, endIndex);
        
        setVisibleItems(newItems);
        setHasMore(endIndex < items.length);
    }, [items, currentPage, itemsPerPage]);
    
    const loadMore = React.useCallback(() => {
        if (hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    }, [hasMore]);
    
    return { visibleItems, hasMore, loadMore, currentPage };
};

// Throttle Hook for performance
const useThrottle = (callback, delay) => {
    const lastRun = React.useRef(Date.now());
    
    return React.useCallback((...args) => {
        if (Date.now() - lastRun.current >= delay) {
            callback(...args);
            lastRun.current = Date.now();
        }
    }, [callback, delay]);
};

// Debounce Hook for search
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
};

// Export all components and utilities
window.PerformanceComponents = {
    LoadingSpinner,
    MenuItemSkeleton,
    ErrorBoundary,
    MemoizedMenuItem,
    VirtualizedMenuList,
    PerformanceMonitor,
    useLazyLoad,
    useThrottle,
    useDebounce
};

console.log('🚀 Performance Components loaded successfully');
