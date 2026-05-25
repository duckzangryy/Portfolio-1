// Background Music Manager with Performance Optimization
class MusicManager {
    constructor() {
        this.audio = document.getElementById('backgroundMusic');
        this.playBtn = document.getElementById('playMusic');
        this.pauseBtn = document.getElementById('pauseMusic');
        this.nextBtn = document.getElementById('nextMusic');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        
        this.musicTracks = [
            { name: 'Too Close', url: '../music/TooCLose.mp3' },
            { name: 'Chan Tinh', url: '../music/ChanTinh.mp3' },
            { name: 'Tinh Ho', url: '../music/TinhHo.mp3' }
        ];
        
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.volume = 0.5;
        this.isMuted = false;
        this.previousVolume = 0.5;
        
        this.init();
    }

    init() {
        // Set initial volume
        this.audio.volume = this.volume;
        this.volumeSlider.value = this.volume * 100;
        this.updateVolumeDisplay();

        // Event listeners
        this.playBtn?.addEventListener('click', () => this.play());
        this.pauseBtn?.addEventListener('click', () => this.pause());
        this.nextBtn?.addEventListener('click', () => this.nextTrack());
        
        this.volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        // Audio event listeners
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('error', (e) => this.handleAudioError(e));
        
        // Load first track
        this.loadTrack(this.currentTrackIndex);
        
        // Check for autoplay restrictions
        this.checkAutoplay();
        
        // Initialize from localStorage
        this.loadSettings();
    }

    loadTrack(index) {
        if (index < 0 || index >= this.musicTracks.length) {
            index = 0;
        }
        
        this.currentTrackIndex = index;
        const track = this.musicTracks[index];
        
        // Use CDN URL for better performance
        this.audio.src = track.url;
        
        // Preload metadata for better UX
        this.audio.load();
        
        // Update UI if track name display exists
        this.updateTrackInfo();
    }

    play() {
        if (!this.audio.src) {
            this.loadTrack(this.currentTrackIndex);
        }

        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayButtons();
                    this.saveSettings();
                })
                .catch(error => {
                    console.log('Autoplay prevented:', error);
                    // Show play button as clickable
                    this.isPlaying = false;
                    this.updatePlayButtons();
                });
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButtons();
        this.saveSettings();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicTracks.length;
        this.loadTrack(this.currentTrackIndex);
        
        if (this.isPlaying) {
            this.play();
        }
        
        this.saveSettings();
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        
        if (this.volume === 0) {
            this.isMuted = true;
        } else {
            this.isMuted = false;
        }
        
        this.updateVolumeDisplay();
        this.saveSettings();
    }

    toggleMute() {
        if (this.isMuted) {
            this.setVolume(this.previousVolume);
        } else {
            this.previousVolume = this.volume;
            this.setVolume(0);
        }
    }

    updateVolumeDisplay() {
        if (this.volumeValue) {
            this.volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
        }
    }

    updatePlayButtons() {
        if (this.playBtn && this.pauseBtn) {
            if (this.isPlaying) {
                this.playBtn.style.display = 'none';
                this.pauseBtn.style.display = 'flex';
            } else {
                this.playBtn.style.display = 'flex';
                this.pauseBtn.style.display = 'none';
            }
        }
    }

    updateTrackInfo() {
        // You can add track info display here if needed
        const trackInfo = document.getElementById('trackInfo');
        if (trackInfo) {
            const track = this.musicTracks[this.currentTrackIndex];
            trackInfo.textContent = `Đang phát: ${track.name}`;
        }
    }

    checkAutoplay() {
        // Check if autoplay is allowed
        const autoplayAllowed = localStorage.getItem('musicAutoplay') === 'true';
        
        if (autoplayAllowed) {
            // Small delay to ensure page is loaded
            setTimeout(() => {
                this.play();
            }, 1000);
        }
    }

    handleAudioError(error) {
        console.error('Audio error:', error);
        
        // Try next track on error
        setTimeout(() => {
            this.nextTrack();
        }, 1000);
    }

    // Settings persistence
    saveSettings() {
        const settings = {
            volume: this.volume,
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrackIndex,
            isMuted: this.isMuted
        };
        
        try {
            localStorage.setItem('musicSettings', JSON.stringify(settings));
        } catch (e) {
            console.log('Could not save music settings:', e);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('musicSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                this.setVolume(settings.volume || 0.5);
                this.currentTrackIndex = settings.currentTrack || 0;
                this.isMuted = settings.isMuted || false;
                
                // Load the saved track
                this.loadTrack(this.currentTrackIndex);
                
                // Restore play state
                if (settings.isPlaying) {
                    setTimeout(() => this.play(), 500);
                }
            }
        } catch (e) {
            console.log('Could not load music settings:', e);
        }
    }

    // Performance optimization
    optimizeForPerformance() {
        // Reduce audio quality for mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Lower default volume on mobile
            this.setVolume(0.3);
            
            // Use lower quality tracks for mobile if available
            // This is just a placeholder - in production you'd have different quality tracks
        }
    }

    destroy() {
        this.pause();
        this.audio.src = '';
        this.audio.load();
        
        // Remove event listeners
        this.playBtn?.removeEventListener('click', () => this.play());
        this.pauseBtn?.removeEventListener('click', () => this.pause());
        this.nextBtn?.removeEventListener('click', () => this.nextTrack());
        this.volumeSlider?.removeEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
    }
}

// Initialize music manager
let musicManager = null;

function initMusicManager() {
    if (!musicManager) {
        musicManager = new MusicManager();
    }
    return musicManager;
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MusicManager, initMusicManager };
}
