// Wedding Invitation JavaScript
// Robust, accessible, and optimized for performance

class WeddingInvitation {
    constructor() {
        this.music = document.getElementById('bgMusic');
        this.musicBtn = document.getElementById('musicBtn');
        this.flowersContainer = document.getElementById('fallingFlowers');
        this.isPlaying = false;
        this.isInitialized = false;
        this.flowersInterval = null;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupErrorHandling();
        this.setupPerformanceOptimizations();
        this.loadAssets();
    }

    setupEventListeners() {
        // Music control
        if (this.music && this.musicBtn) {
            this.musicBtn.addEventListener('click', this.toggleMusic.bind(this));
            
            // Audio event listeners
            this.music.addEventListener('loadstart', () => this.updateMusicStatus('Loading...'));
            this.music.addEventListener('canplay', () => this.updateMusicStatus('Ready'));
            this.music.addEventListener('error', this.handleMusicError.bind(this));
            this.music.addEventListener('ended', () => this.updateMusicStatus('🎵 Play Music'));
        }

        // Network status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showStatus('Back online', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showStatus('You are offline', 'warning');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Initialize music on first user interaction
        document.addEventListener('click', this.initMusic.bind(this), { once: true });
        document.addEventListener('touchstart', this.initMusic.bind(this), { once: true });
    }

    setupAccessibility() {
        // Add ARIA live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Enhanced button accessibility
        if (this.musicBtn) {
            this.musicBtn.setAttribute('aria-describedby', 'music-description');
            const description = document.createElement('div');
            description.id = 'music-description';
            description.className = 'sr-only';
            description.textContent = 'Toggle background music for the wedding invitation';
            document.body.appendChild(description);
        }

        // Add focus management for dynamic content
        this.setupFocusManagement();
    }

    setupFocusManagement() {
        // Ensure focus goes to first interactive element
        const firstFocusable = document.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.setAttribute('tabindex', '0');
        }

        // Trap focus in modals (if any added later)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }

    trapFocus(e) {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showStatus('Something went wrong. Please refresh the page.', 'error');
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showStatus('A network error occurred.', 'error');
        });
    }

    setupPerformanceOptimizations() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        }

        // Reduce motion support
        this.respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Connection aware loading
        if ('connection' in navigator) {
            this.connectionType = navigator.connection.effectiveType;
            if (this.connectionType === 'slow-2g' || this.connectionType === '2g') {
                this.disableAnimations();
            }
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements for animation
        document.querySelectorAll('.couple-illustration, .btn').forEach(el => {
            observer.observe(el);
        });
    }

    loadAssets() {
        // Preload critical assets
        this.preloadAssets([
            'assets/background.png',
            'assets/wedding-music.mp3',
            'assets/couple-illustration.png'
        ]);
    }

    preloadAssets(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            if (url.endsWith('.mp3')) {
                link.as = 'audio';
            } else if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) {
                link.as = 'image';
            }
            document.head.appendChild(link);
        });
    }

    initMusic() {
        if (this.isInitialized) return;
        
        this.isInitialized = true;
        
        if (this.music && this.isOnline) {
            this.music.play().then(() => {
                this.isPlaying = true;
                this.updateMusicButton('🎵 Music Playing');
                this.announceToScreenReader('Background music started');
            }).catch(e => {
                console.log('Autoplay prevented:', e);
                this.updateMusicButton('🎵 Play Music');
            });
        }
    }

    toggleMusic() {
        if (!this.music) return;

        if (this.isPlaying) {
            this.music.pause();
            this.isPlaying = false;
            this.updateMusicButton('🎵 Play Music');
            this.announceToScreenReader('Music paused');
        } else {
            this.music.play().then(() => {
                this.isPlaying = true;
                this.updateMusicButton('🎵 Music Playing');
                this.announceToScreenReader('Music playing');
            }).catch(e => {
                console.error('Music play failed:', e);
                this.showStatus('Unable to play music. Please check your connection.', 'error');
                this.announceToScreenReader('Unable to play music');
            });
        }
    }

    updateMusicButton(text) {
        if (this.musicBtn) {
            this.musicBtn.textContent = text;
        }
    }

    updateMusicStatus(status) {
        if (this.musicBtn) {
            this.musicBtn.title = `Music: ${status}`;
        }
    }

    handleMusicError(e) {
        console.error('Music error:', e);
        this.showStatus('Music file not available', 'warning');
        if (this.musicBtn) {
            this.musicBtn.disabled = true;
            this.musicBtn.textContent = '🎵 Music Unavailable';
        }
    }

    handleKeyboardShortcuts(e) {
        // Alt + M for music toggle
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            this.toggleMusic();
        }
        
        // Alt + D for download
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            this.downloadCard();
        }
    }

    startFlowersAnimation() {
        if (this.respectsReducedMotion || !this.flowersContainer) return;

        // Clear existing interval
        if (this.flowersInterval) {
            clearInterval(this.flowersInterval);
        }

        this.flowersInterval = setInterval(() => {
            this.createFlower();
        }, 300);

        // Create initial batch of flowers
        for (let i = 0; i < 15; i++) {
            setTimeout(() => this.createFlower(), i * 200);
        }
    }

    createFlower() {
        if (!this.flowersContainer || this.respectsReducedMotion) return;

        const flower = document.createElement('div');
        flower.className = 'flower-petal';
        flower.setAttribute('aria-hidden', 'true');
        
        // Random positioning and styling
        flower.style.left = Math.random() * 100 + '%';
        flower.style.animationDuration = (Math.random() * 3 + 3) + 's';
        flower.style.animationDelay = Math.random() * 2 + 's';
        flower.style.width = (Math.random() * 8 + 10) + 'px';
        flower.style.height = (Math.random() * 8 + 10) + 'px';
        
        // Vary red shades
        const redShades = ['#dc143c', '#ff0000', '#cc0000', '#b22222', '#8b0000'];
        flower.style.background = `radial-gradient(circle, ${redShades[Math.floor(Math.random() * redShades.length)]}, #ff4444)`;
        
        this.flowersContainer.appendChild(flower);
        
        // Remove flower after animation
        setTimeout(() => {
            if (flower.parentNode) {
                flower.remove();
            }
        }, 8000);
    }

    disableAnimations() {
        this.respectsReducedMotion = true;
        if (this.flowersInterval) {
            clearInterval(this.flowersInterval);
        }
    }

    downloadCard() {
        const button = event.target;
        button.classList.add('loading');
        button.textContent = 'Preparing...';
        button.disabled = true;

        try {
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = 'assets/invitation-card.pdf';
            link.download = 'Wedding-Invitation-Mohammed-Umme.pdf';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.announceToScreenReader('Download started');
            
            setTimeout(() => {
                button.classList.remove('loading');
                button.textContent = 'Download Card';
                button.disabled = false;
                this.showStatus('Download started', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('Download failed:', error);
            button.classList.remove('loading');
            button.textContent = 'Download Card';
            button.disabled = false;
            this.showStatus('Download failed. Please try again.', 'error');
            this.announceToScreenReader('Download failed');
        }
    }

    showStatus(message, type = 'info') {
        // Remove existing status messages
        const existingStatus = document.querySelectorAll('.status-message');
        existingStatus.forEach(status => status.remove());

        // Create new status message
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message status-${type}`;
        statusDiv.textContent = message;
        statusDiv.setAttribute('role', 'alert');
        statusDiv.setAttribute('aria-live', 'assertive');
        
        // Style the message
        Object.assign(statusDiv.style, {
            position: 'fixed',
            top: '60px',
            right: '10px',
            padding: '10px 15px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                statusDiv.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                statusDiv.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                statusDiv.style.backgroundColor = '#ff9800';
                break;
            default:
                statusDiv.style.backgroundColor = '#2196F3';
        }

        document.body.appendChild(statusDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.style.opacity = '0';
                statusDiv.style.transform = 'translateX(100%)';
                setTimeout(() => statusDiv.remove(), 300);
            }
        }, 5000);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Public method to get current status
    getStatus() {
        return {
            musicPlaying: this.isPlaying,
            isOnline: this.isOnline,
            flowersActive: !!this.flowersInterval,
            reducedMotion: this.respectsReducedMotion
        };
    }

    // Cleanup method
    destroy() {
        if (this.flowersInterval) {
            clearInterval(this.flowersInterval);
        }
        if (this.music) {
            this.music.pause();
        }
        document.removeEventListener('click', this.initMusic);
        document.removeEventListener('touchstart', this.initMusic);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weddingInvitation = new WeddingInvitation();
    
    // Start flowers animation after a short delay
    setTimeout(() => {
        if (window.weddingInvitation) {
            window.weddingInvitation.startFlowersAnimation();
        }
    }, 1000);
});

// Service Worker registration for offline capability
if ('serviceWorker' in navigator) {
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

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeddingInvitation;
}
