// Main Application Controller
class PersonalWebsite {
    constructor() {
        this.settingsModal = document.getElementById('settingsModal');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeSettings = document.getElementById('closeSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.resetSettingsBtn = document.getElementById('resetSettings');
        
        this.snowToggle = document.getElementById('snowToggle');
        this.glassEffectToggle = document.getElementById('glassEffectToggle');
        this.lowPerfToggle = document.getElementById('lowPerfToggle');
        
        this.themeButtons = document.querySelectorAll('.theme-btn');
        
        this.snowAnimation = null;
        this.musicManager = null;
        
        this.settings = {
            snowEnabled: true,
            glassEffectEnabled: true,
            lowPerformanceMode: false,
            theme: 'default',
            volume: 0.5,
            musicPlaying: false
        };
        
        this.init();
    }

    init() {
        // Initialize components
        this.initEventListeners();
        this.loadSettings();
        this.initComponents();
        this.applySettings();
        
        // Performance optimizations
        this.optimizePerformance();
        
        // Check for updates
        this.checkForUpdates();
    }

    initEventListeners() {
        // Settings modal
        this.settingsBtn?.addEventListener('click', () => this.openSettings());
        this.closeSettings?.addEventListener('click', () => this.closeSettingsModal());
        
        // Close modal when clicking outside
        this.settingsModal?.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });

        // Save and reset buttons
        this.saveSettingsBtn?.addEventListener('click', () => this.saveCurrentSettings());
        this.resetSettingsBtn?.addEventListener('click', () => this.resetSettings());

        // Toggle switches
        this.snowToggle?.addEventListener('change', (e) => {
            this.settings.snowEnabled = e.target.checked;
            this.toggleSnowEffect(this.settings.snowEnabled);
        });

        this.glassEffectToggle?.addEventListener('change', (e) => {
            this.settings.glassEffectEnabled = e.target.checked;
            this.toggleGlassEffect(this.settings.glassEffectEnabled);
        });

        this.lowPerfToggle?.addEventListener('change', (e) => {
            this.settings.lowPerformanceMode = e.target.checked;
            this.togglePerformanceMode(this.settings.lowPerformanceMode);
        });

        // Theme buttons
        this.themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme || e.target.closest('.theme-btn').dataset.theme;
                this.changeTheme(theme);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + , to open settings
            if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                this.openSettings();
            }
            
            // Space to toggle music
            if (e.key === ' ' && !e.target.matches('input, textarea, button')) {
                e.preventDefault();
                if (this.musicManager) {
                    this.musicManager.togglePlay();
                }
            }
            
            // Escape to close settings
            if (e.key === 'Escape' && this.settingsModal?.classList.contains('active')) {
                this.closeSettingsModal();
            }
        });

        // Window events
        window.addEventListener('beforeunload', () => this.saveSettings());
        window.addEventListener('online', () => this.handleOnlineStatus());
        window.addEventListener('offline', () => this.handleOfflineStatus());
        
        // Visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleTabHidden();
            } else {
                this.handleTabVisible();
            }
        });
    }

    initComponents() {
        // Initialize snow animation
        if (typeof initSnowAnimation === 'function') {
            this.snowAnimation = initSnowAnimation();
        }

        // Initialize music manager
        if (typeof initMusicManager === 'function') {
            this.musicManager = initMusicManager();
        }

        // Initialize GitHub projects loader
        this.initGitHubLoader();
    }

    initGitHubLoader() {
        const githubLink = document.querySelector('.github-link');
        if (githubLink) {
            githubLink.addEventListener('click', (e) => {
                // You can add GitHub API integration here
                // For now, just open the link
                console.log('Opening GitHub profile...');
            });
        }
    }

    openSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Update toggle states
            if (this.snowToggle) this.snowToggle.checked = this.settings.snowEnabled;
            if (this.glassEffectToggle) this.glassEffectToggle.checked = this.settings.glassEffectEnabled;
            if (this.lowPerfToggle) this.lowPerfToggle.checked = this.settings.lowPerformanceMode;
            
            // Update theme buttons
            this.themeButtons.forEach(button => {
                button.classList.remove('active');
                if (button.dataset.theme === this.settings.theme) {
                    button.classList.add('active');
                }
            });
        }
    }

    closeSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    saveCurrentSettings() {
        this.saveSettings();
        this.closeSettingsModal();
        
        // Show save confirmation
        this.showNotification('Đã lưu cài đặt!', 'success');
    }

    resetSettings() {
        if (confirm('Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định?')) {
            this.settings = {
                snowEnabled: true,
                glassEffectEnabled: true,
                lowPerformanceMode: false,
                theme: 'default',
                volume: 0.5,
                musicPlaying: false
            };
            
            this.applySettings();
            this.saveSettings();
            
            // Update UI
            if (this.snowToggle) this.snowToggle.checked = true;
            if (this.glassEffectToggle) this.glassEffectToggle.checked = true;
            if (this.lowPerfToggle) this.lowPerfToggle.checked = false;
            
            this.themeButtons.forEach(button => {
                button.classList.remove('active');
                if (button.dataset.theme === 'default') {
                    button.classList.add('active');
                }
            });
            
            this.showNotification('Đã đặt lại cài đặt!', 'success');
        }
    }

    toggleSnowEffect(enabled) {
        if (this.snowAnimation) {
            this.snowAnimation.toggleSnow(enabled);
        }
        
        if (enabled) {
            document.body.classList.remove('no-snow');
        } else {
            document.body.classList.add('no-snow');
        }
    }

    toggleGlassEffect(enabled) {
        if (enabled) {
            document.body.classList.remove('no-glass-effect');
        } else {
            document.body.classList.add('no-glass-effect');
        }
        
        // Update glass cards
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach(card => {
            if (enabled) {
                card.style.backdropFilter = 'blur(10px)';
                card.style.webkitBackdropFilter = 'blur(10px)';
            } else {
                card.style.backdropFilter = 'none';
                card.style.webkitBackdropFilter = 'none';
            }
        });
    }

    togglePerformanceMode(enabled) {
        if (enabled) {
            document.body.classList.add('low-performance');
            
            // Reduce animations
            if (this.snowAnimation) {
                this.snowAnimation.setPerformanceMode(true);
            }
            
            // Reduce music quality if available
            if (this.musicManager) {
                this.musicManager.optimizeForPerformance();
            }
        } else {
            document.body.classList.remove('low-performance');
            
            // Restore animations
            if (this.snowAnimation) {
                this.snowAnimation.setPerformanceMode(false);
            }
        }
    }

    changeTheme(theme) {
        this.settings.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update active button
        this.themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.theme === theme) {
                button.classList.add('active');
            }
        });
        
        this.saveSettings();
    }

    applySettings() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        
        // Apply snow effect
        this.toggleSnowEffect(this.settings.snowEnabled);
        
        // Apply glass effect
        this.toggleGlassEffect(this.settings.glassEffectEnabled);
        
        // Apply performance mode
        this.togglePerformanceMode(this.settings.lowPerformanceMode);
        
        // Apply music settings
        if (this.musicManager) {
            this.musicManager.setVolume(this.settings.volume);
            if (this.settings.musicPlaying) {
                setTimeout(() => this.musicManager.play(), 1000);
            }
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('websiteSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (e) {
            console.log('Could not load settings:', e);
        }
    }

    saveSettings() {
        // Update current settings
        if (this.musicManager) {
            this.settings.volume = this.musicManager.volume;
            this.settings.musicPlaying = this.musicManager.isPlaying;
        }
        
        try {
            localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.log('Could not save settings:', e);
        }
    }

    optimizePerformance() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Defer non-critical JavaScript
        this.deferNonCriticalScripts();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Cache DOM elements
        this.cacheDomElements();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    deferNonCriticalScripts() {
        // This would be implemented if we had external scripts
        // For now, it's a placeholder for future optimization
    }

    optimizeAnimations() {
        // Use will-change for elements that will animate
        const animatedElements = document.querySelectorAll('.glass-card, .social-card, .skill-item');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }

    cacheDomElements() {
        // Cache frequently accessed elements
        this.cachedElements = {
            glassCards: document.querySelectorAll('.glass-card'),
            socialCards: document.querySelectorAll('.social-card'),
            skillItems: document.querySelectorAll('.skill-item')
        };
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            color: var(--text-color);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleOnlineStatus() {
        this.showNotification('Đã kết nối lại internet!', 'success');
        
        // Retry loading any failed resources
        if (this.musicManager && !this.musicManager.audio.src) {
            this.musicManager.loadTrack(this.musicManager.currentTrackIndex);
        }
    }

    handleOfflineStatus() {
        this.showNotification('Mất kết nối internet. Một số tính năng có thể không hoạt động.', 'warning');
    }

    handleTabHidden() {
        // Pause music when tab is hidden
        if (this.musicManager && this.musicManager.isPlaying) {
            this.musicManager.pause();
            this.tabWasPlaying = true;
        }
        
        // Reduce animation intensity
        if (this.snowAnimation) {
            this.snowAnimation.setPerformanceMode(true);
        }
    }

    handleTabVisible() {
        // Resume music if it was playing
        if (this.tabWasPlaying && this.musicManager) {
            this.musicManager.play();
            this.tabWasPlaying = false;
        }
        
        // Restore animation intensity
        if (this.snowAnimation && !this.settings.lowPerformanceMode) {
            this.snowAnimation.setPerformanceMode(false);
        }
    }

    checkForUpdates() {
        // Check for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update();
            });
        }
        
        // Check for content updates (daily)
        const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
        const now = Date.now();
        
        if (!lastUpdateCheck || now - parseInt(lastUpdateCheck) > 24 * 60 * 60 * 1000) {
            this.checkContentUpdates();
            localStorage.setItem('lastUpdateCheck', now.toString());
        }
    }

    checkContentUpdates() {
        // This would check for updates to static content
        // For now, it's a placeholder
        console.log('Checking for content updates...');
    }

    destroy() {
        // Clean up event listeners
        this.settingsBtn?.removeEventListener('click', () => this.openSettings());
        this.closeSettings?.removeEventListener('click', () => this.closeSettingsModal());
        
        // Save settings before destruction
        this.saveSettings();
        
        // Destroy components
        if (this.snowAnimation) {
            this.snowAnimation.destroy();
        }
        
        if (this.musicManager) {
            this.musicManager.destroy();
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification-warning {
            border-left: 4px solid #FF9800;
        }
        
        .notification-info {
            border-left: 4px solid #2196F3;
        }
        
        .no-snow #snow-container {
            display: none !important;
        }
        
        .no-glass-effect .glass-card {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the website
    window.website = new PersonalWebsite();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalWebsite;
}
