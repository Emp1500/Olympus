/* =============================================
   Olympus - Ambient Color Controller
   Apple Music Style Dynamic Backgrounds
   ============================================= */

class AmbientController {
    constructor() {
        this.currentColors = ['#1a1a2e', '#16213e', '#0f3460', '#e94560'];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.canvas.width = 50;
        this.canvas.height = 50;
        this.isEnabled = true;
        this.transitionDuration = 1500;

        this.init();
    }

    /**
     * Initialize the controller
     */
    init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.transitionDuration = 300;
        }

        // Listen for visibility changes to pause animations
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    /**
     * Update ambient colors based on track data
     * @param {Object} track - Track object with colors array
     */
    updateColors(track) {
        if (!this.isEnabled || !track) return;

        // Use predefined colors from track data if available
        if (track.colors && track.colors.length >= 2) {
            this.applyColors(track.colors);
        } else if (track.cover) {
            // Extract colors from album art
            this.extractColorsFromImage(track.cover).then(colors => {
                this.applyColors(colors);
            });
        }
    }

    /**
     * Apply colors to CSS variables with smooth transition
     * @param {Array} colors - Array of color hex codes
     */
    applyColors(colors) {
        if (!colors || colors.length < 2) return;

        const root = document.documentElement;

        // Ensure we have 4 colors
        const normalizedColors = this.normalizeColors(colors);

        // Apply colors to CSS variables
        root.style.setProperty('--ambient-color-1', normalizedColors[0]);
        root.style.setProperty('--ambient-color-2', normalizedColors[1]);
        root.style.setProperty('--ambient-color-3', normalizedColors[2]);
        root.style.setProperty('--ambient-color-4', normalizedColors[3]);

        // Store current colors
        this.currentColors = normalizedColors;

        // Update specific elements
        this.updatePlayerBar(normalizedColors);
        this.updateHeroGradient(normalizedColors);
        this.updateNowPlayingPage(normalizedColors);
    }

    /**
     * Normalize colors array to always have 4 colors
     * @param {Array} colors - Input colors
     * @returns {Array} Normalized 4 colors
     */
    normalizeColors(colors) {
        const result = [...colors];

        while (result.length < 4) {
            // Generate variations if we don't have enough colors
            const baseColor = result[result.length - 1] || result[0];
            result.push(this.adjustBrightness(baseColor, -20));
        }

        return result.slice(0, 4);
    }

    /**
     * Update player bar ambient colors
     * @param {Array} colors - Color array
     */
    updatePlayerBar(colors) {
        const playerBar = document.getElementById('playerBar');
        if (playerBar) {
            playerBar.style.setProperty('--player-ambient-1', colors[0]);
            playerBar.style.setProperty('--player-ambient-2', colors[1]);
        }
    }

    /**
     * Update hero gradient colors
     * @param {Array} colors - Color array
     */
    updateHeroGradient(colors) {
        const heroGradient = document.querySelector('.hero-gradient');
        if (heroGradient) {
            heroGradient.style.background = `linear-gradient(180deg, ${colors[0]}cc 0%, var(--bg-primary) 100%)`;
        }
    }

    /**
     * Update now playing page ambient
     * @param {Array} colors - Color array
     */
    updateNowPlayingPage(colors) {
        const npPage = document.getElementById('nowPlayingPage');
        if (npPage) {
            npPage.style.setProperty('--np-ambient-1', colors[0]);
            npPage.style.setProperty('--np-ambient-2', colors[1]);
        }

        // Update album art glow
        const artwork = document.querySelector('.now-playing-artwork');
        if (artwork) {
            artwork.style.setProperty('--glow-color', colors[0]);
        }
    }

    /**
     * Extract dominant colors from an image
     * @param {string} imageUrl - URL of the image
     * @returns {Promise<Array>} Array of color hex codes
     */
    extractColorsFromImage(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            img.onload = () => {
                try {
                    // Draw image to canvas
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

                    // Get image data
                    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    const colors = this.extractColorsFromData(imageData.data);

                    resolve(colors);
                } catch (e) {
                    console.log('Color extraction failed, using fallback colors');
                    resolve(this.getFallbackColors());
                }
            };

            img.onerror = () => {
                resolve(this.getFallbackColors());
            };

            img.src = imageUrl;
        });
    }

    /**
     * Extract colors from image data using color quantization
     * @param {Uint8ClampedArray} data - Image pixel data
     * @returns {Array} Array of color hex codes
     */
    extractColorsFromData(data) {
        const colorCounts = {};
        const colors = [];

        // Sample pixels
        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Skip very dark or very light pixels
            const brightness = (r + g + b) / 3;
            if (brightness < 20 || brightness > 235) continue;

            // Quantize colors to reduce palette
            const qr = Math.round(r / 32) * 32;
            const qg = Math.round(g / 32) * 32;
            const qb = Math.round(b / 32) * 32;

            const key = `${qr},${qg},${qb}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Sort by frequency
        const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        // Convert to hex
        for (const [color] of sortedColors) {
            const [r, g, b] = color.split(',').map(Number);
            colors.push(this.rgbToHex(r, g, b));
        }

        // Ensure we have distinct colors
        const distinctColors = this.ensureDistinctColors(colors);

        return distinctColors.length >= 2 ? distinctColors : this.getFallbackColors();
    }

    /**
     * Ensure colors are visually distinct
     * @param {Array} colors - Input colors
     * @returns {Array} Distinct colors
     */
    ensureDistinctColors(colors) {
        const distinct = [colors[0]];

        for (let i = 1; i < colors.length; i++) {
            const isDifferent = distinct.every(c => this.colorDistance(c, colors[i]) > 50);
            if (isDifferent) {
                distinct.push(colors[i]);
            }
        }

        return distinct;
    }

    /**
     * Calculate color distance
     * @param {string} hex1 - First color
     * @param {string} hex2 - Second color
     * @returns {number} Distance value
     */
    colorDistance(hex1, hex2) {
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);

        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        );
    }

    /**
     * Convert RGB to Hex
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    /**
     * Convert Hex to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    /**
     * Adjust color brightness
     * @param {string} hex - Hex color
     * @param {number} amount - Amount to adjust (-100 to 100)
     * @returns {string} Adjusted hex color
     */
    adjustBrightness(hex, amount) {
        const rgb = this.hexToRgb(hex);
        const adjusted = {
            r: Math.max(0, Math.min(255, rgb.r + amount)),
            g: Math.max(0, Math.min(255, rgb.g + amount)),
            b: Math.max(0, Math.min(255, rgb.b + amount))
        };
        return this.rgbToHex(adjusted.r, adjusted.g, adjusted.b);
    }

    /**
     * Get fallback colors when extraction fails
     */
    getFallbackColors() {
        return ['#1a1a2e', '#16213e', '#0f3460', '#e94560'];
    }

    /**
     * Handle visibility change to pause/resume animations
     */
    handleVisibilityChange() {
        const blobs = document.querySelectorAll('.ambient-blob');
        blobs.forEach(blob => {
            blob.style.animationPlayState = document.hidden ? 'paused' : 'running';
        });
    }

    /**
     * Set playing state
     * @param {boolean} isPlaying - Whether music is playing
     */
    setPlayingState(isPlaying) {
        const playerBar = document.getElementById('playerBar');
        if (playerBar) {
            playerBar.classList.toggle('playing', isPlaying);
        }

        // Adjust ambient intensity when playing
        const root = document.documentElement;
        root.style.setProperty('--ambient-intensity', isPlaying ? '0.7' : '0.5');
    }

    /**
     * Enable/disable ambient effects
     * @param {boolean} enabled - Whether to enable
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        const ambient = document.getElementById('ambientBackground');
        if (ambient) {
            ambient.style.display = enabled ? 'block' : 'none';
        }
    }

    /**
     * Reset to default colors
     */
    reset() {
        this.applyColors(this.getFallbackColors());
    }

    /**
     * Create pulsing effect synced to beat (called externally)
     * @param {number} bpm - Beats per minute
     */
    syncToBeat(bpm) {
        if (!bpm || bpm <= 0) return;

        const interval = (60 / bpm) * 1000;
        const root = document.documentElement;

        // Pulse animation
        let intensity = 0.6;
        const pulse = () => {
            intensity = intensity === 0.6 ? 0.8 : 0.6;
            root.style.setProperty('--ambient-intensity', intensity.toString());
        };

        // Clear any existing interval
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
        }

        this.beatInterval = setInterval(pulse, interval);
    }

    /**
     * Stop beat sync
     */
    stopBeatSync() {
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = null;
        }
    }
}

// Initialize ambient controller
let ambientController;
document.addEventListener('DOMContentLoaded', () => {
    ambientController = new AmbientController();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmbientController;
}
