/* =============================================
   MeloVibe - Utility Functions
   ============================================= */

const Utils = {
    /**
     * Format duration from seconds to mm:ss
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Format duration from seconds to hours and minutes
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted string like "1 hr 23 min"
     */
    formatDuration(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0 min';

        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours} hr ${mins} min`;
        }
        return `${mins} min`;
    },

    /**
     * Format a number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength - 3) + '...';
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
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
    },

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Generate a unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Get greeting based on time of day
     * @returns {string} Time-appropriate greeting
     */
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    },

    /**
     * Shuffle an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Parse hash from URL
     * @returns {Object} Parsed hash parameters
     */
    parseHash() {
        const hash = window.location.hash.slice(1);
        const parts = hash.split('/');
        return {
            page: parts[0] || 'home',
            id: parts[1] || null
        };
    },

    /**
     * Create element with classes and attributes
     * @param {string} tag - HTML tag name
     * @param {Object} options - Element options
     * @returns {HTMLElement} Created element
     */
    createElement(tag, options = {}) {
        const element = document.createElement(tag);

        if (options.classes) {
            element.classList.add(...options.classes);
        }

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        if (options.text) {
            element.textContent = options.text;
        }

        if (options.html) {
            element.innerHTML = options.html;
        }

        return element;
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    showToast(message, duration = 3000) {
        let container = document.querySelector('.toast-container');

        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Get random color for category cards
     * @returns {string} Random hex color
     */
    getRandomColor() {
        const colors = [
            '#8c67ac', '#1e3264', '#e8115b', '#148a08',
            '#bc5900', '#0d73ec', '#e1118c', '#777777',
            '#509bf5', '#e13300', '#1db954', '#7856ff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * Extract dominant color from image (placeholder)
     * @param {string} imageUrl - Image URL
     * @returns {Promise<string>} Dominant color
     */
    async getDominantColor(imageUrl) {
        // Placeholder - would use canvas or library
        return '#535353';
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Local storage wrapper with JSON parsing
     */
    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch {
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
