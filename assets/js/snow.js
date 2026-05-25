// Snow Animation with Performance Optimization
class SnowAnimation {
    constructor() {
        this.container = document.getElementById('snow-container');
        this.snowflakes = [];
        this.isActive = true;
        this.maxFlakes = 100; // Reduced for better performance
        this.performanceMode = false;
        this.windDirection = 0; // -1: left, 0: none, 1: right
        this.windStrength = 0;
        
        this.init();
        this.startAnimation();
    }

    init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isActive = false;
            return;
        }

        // Create initial snowflakes
        this.createSnowflakes();
        
        // Listen for performance mode changes
        this.checkPerformance();
        window.addEventListener('resize', () => this.checkPerformance());
    }

    createSnowflakes() {
        if (!this.isActive || !this.container) return;

        const currentCount = this.snowflakes.length;
        const targetCount = this.performanceMode ? 30 : this.maxFlakes;
        
        if (currentCount >= targetCount) return;

        for (let i = currentCount; i < targetCount; i++) {
            this.createSnowflake();
        }
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Random size
        const size = Math.random();
        if (size < 0.3) {
            snowflake.classList.add('small');
        } else if (size < 0.7) {
            snowflake.classList.add('medium');
        } else {
            snowflake.classList.add('large');
        }

        // Random speed
        const speed = Math.random();
        if (speed < 0.3) {
            snowflake.classList.add('slow');
        } else if (speed < 0.7) {
            snowflake.classList.add('medium-speed');
        } else {
            snowflake.classList.add('fast');
        }

        // Random wind effect
        if (this.windDirection !== 0) {
            if (this.windDirection === -1) {
                snowflake.classList.add('wind-left');
            } else {
                snowflake.classList.add('wind-right');
            }
        }

        // Apply performance mode
        if (this.performanceMode) {
            snowflake.classList.add('performance');
        }

        // Random position
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.top = `${Math.random() * -100}px`;

        // Random opacity
        snowflake.style.opacity = (0.5 + Math.random() * 0.3).toString();

        this.container.appendChild(snowflake);
        this.snowflakes.push(snowflake);
    }

    updateSnowflakes() {
        if (!this.isActive) return;

        // Remove snowflakes that have fallen out of view
        this.snowflakes = this.snowflakes.filter(snowflake => {
            const rect = snowflake.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                snowflake.remove();
                return false;
            }
            return true;
        });

        // Create new snowflakes to maintain count
        this.createSnowflakes();
    }

    startAnimation() {
        const animate = () => {
            this.updateSnowflakes();
            requestAnimationFrame(animate);
        };
        animate();
    }

    checkPerformance() {
        // Check device capabilities
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEndDevice = navigator.hardwareConcurrency <= 4;
        
        this.performanceMode = isMobile || isLowEndDevice;
        
        // Update existing snowflakes
        this.snowflakes.forEach(snowflake => {
            if (this.performanceMode) {
                snowflake.classList.add('performance');
            } else {
                snowflake.classList.remove('performance');
            }
        });

        // Adjust max flakes based on performance
        this.maxFlakes = this.performanceMode ? 50 : 100;
    }

    toggleSnow(enabled) {
        this.isActive = enabled;
        
        if (enabled) {
            this.container.style.display = 'block';
            this.createSnowflakes();
        } else {
            this.container.style.display = 'none';
            this.snowflakes.forEach(snowflake => snowflake.remove());
            this.snowflakes = [];
        }
    }

    setWind(direction, strength) {
        this.windDirection = direction;
        this.windStrength = strength;
        
        // Update existing snowflakes
        this.snowflakes.forEach(snowflake => {
            snowflake.classList.remove('wind-left', 'wind-right');
            
            if (direction !== 0) {
                if (direction === -1) {
                    snowflake.classList.add('wind-left');
                } else {
                    snowflake.classList.add('wind-right');
                }
            }
        });
    }

    setPerformanceMode(enabled) {
        this.performanceMode = enabled;
        this.maxFlakes = enabled ? 30 : 100;
        
        // Update existing snowflakes
        this.snowflakes.forEach(snowflake => {
            if (enabled) {
                snowflake.classList.add('performance');
            } else {
                snowflake.classList.remove('performance');
            }
        });

        // Adjust snowflake count
        if (enabled && this.snowflakes.length > 30) {
            const excess = this.snowflakes.slice(30);
            excess.forEach(snowflake => snowflake.remove());
            this.snowflakes = this.snowflakes.slice(0, 30);
        } else if (!enabled) {
            this.createSnowflakes();
        }
    }

    destroy() {
        this.isActive = false;
        this.snowflakes.forEach(snowflake => snowflake.remove());
        this.snowflakes = [];
    }
}

// Initialize snow animation
let snowAnimation = null;

function initSnowAnimation() {
    if (!snowAnimation) {
        snowAnimation = new SnowAnimation();
    }
    return snowAnimation;
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SnowAnimation, initSnowAnimation };
}