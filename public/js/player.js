/* =============================================
   Olympus - Music Player Controller
   ============================================= */

class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentTrack = null;
        this.queue = [];
        this.queueIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 'off'; // off, all, one
        this.volume = 0.5;
        this.isMuted = false;
        this.previousVolume = 0.5;

        this.initializeElements();
        this.bindEvents();
        this.loadSavedState();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        // Player bar elements
        this.elements = {
            // Album art and info
            albumArt: document.querySelector('#playerAlbumArt img'),
            songTitle: document.getElementById('playerSongTitle'),
            songArtist: document.getElementById('playerSongArtist'),
            likeBtn: document.getElementById('btnLikeSong'),

            // Control buttons
            playBtn: document.getElementById('btnPlayPause'),
            prevBtn: document.getElementById('btnPrev'),
            nextBtn: document.getElementById('btnNext'),
            shuffleBtn: document.getElementById('btnShuffle'),
            repeatBtn: document.getElementById('btnRepeat'),

            // Progress
            progressBar: document.getElementById('progressBar'),
            currentTime: document.getElementById('timeCurrent'),
            totalTime: document.getElementById('timeTotal'),

            // Volume
            volumeBtn: document.getElementById('btnMute'),
            volumeSlider: document.getElementById('volumeSlider'),

            // Extra controls
            nowPlayingBtn: document.getElementById('btnNowPlaying'),
            queueBtn: document.getElementById('btnQueue'),
            fullscreenBtn: document.getElementById('btnFullscreen'),

            // Now playing page elements
            npArtwork: document.getElementById('npArtwork'),
            npTitle: document.getElementById('npTitle'),
            npArtist: document.getElementById('npArtist'),
            npProgressSlider: document.getElementById('npProgressSlider'),
            npCurrentTime: document.getElementById('npCurrentTime'),
            npTotalTime: document.getElementById('npTotalTime'),
            npPlayPause: document.getElementById('npPlayPause'),
            npPrev: document.getElementById('npPrev'),
            npNext: document.getElementById('npNext'),
            npShuffle: document.getElementById('npShuffle'),
            npRepeat: document.getElementById('npRepeat'),

            // Pages
            nowPlayingPage: document.getElementById('nowPlayingPage'),

            // Queue sidebar
            queueSidebar: document.getElementById('queueSidebar'),
            queueList: document.getElementById('queueList'),
            queueCurrentSong: document.getElementById('queueCurrentSong'),
            closeQueueBtn: document.getElementById('btnCloseQueue')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
        this.audio.addEventListener('play', () => this.updatePlayState(true));
        this.audio.addEventListener('pause', () => this.updatePlayState(false));
        this.audio.addEventListener('error', (e) => this.handleError(e));

        // Control buttons
        if (this.elements.playBtn) {
            this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        }
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.previous());
        }
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.next());
        }
        if (this.elements.shuffleBtn) {
            this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }
        if (this.elements.repeatBtn) {
            this.elements.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        }

        // Progress bar
        if (this.elements.progressBar) {
            this.elements.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
            this.elements.progressBar.addEventListener('change', (e) => this.seek(e.target.value));
        }

        // Volume controls
        if (this.elements.volumeBtn) {
            this.elements.volumeBtn.addEventListener('click', () => this.toggleMute());
        }
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        }

        // Now playing page controls
        if (this.elements.npPlayPause) {
            this.elements.npPlayPause.addEventListener('click', () => this.togglePlay());
        }
        if (this.elements.npPrev) {
            this.elements.npPrev.addEventListener('click', () => this.previous());
        }
        if (this.elements.npNext) {
            this.elements.npNext.addEventListener('click', () => this.next());
        }
        if (this.elements.npShuffle) {
            this.elements.npShuffle.addEventListener('click', () => this.toggleShuffle());
        }
        if (this.elements.npRepeat) {
            this.elements.npRepeat.addEventListener('click', () => this.toggleRepeat());
        }
        if (this.elements.npProgressSlider) {
            this.elements.npProgressSlider.addEventListener('input', (e) => this.seek(e.target.value));
        }

        // Extra controls
        if (this.elements.nowPlayingBtn) {
            this.elements.nowPlayingBtn.addEventListener('click', () => this.toggleNowPlayingView());
        }
        if (this.elements.queueBtn) {
            this.elements.queueBtn.addEventListener('click', () => this.toggleQueue());
        }
        if (this.elements.closeQueueBtn) {
            this.elements.closeQueueBtn.addEventListener('click', () => this.toggleQueue());
        }
        if (this.elements.fullscreenBtn) {
            this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Album art click to expand
        const albumArt = document.getElementById('playerAlbumArt');
        if (albumArt) {
            albumArt.addEventListener('click', () => this.toggleNowPlayingView());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Media Session API
        this.setupMediaSession();
    }

    /**
     * Load saved player state from localStorage
     */
    loadSavedState() {
        const savedVolume = Utils.storage.get('playerVolume', 0.5);
        const savedShuffle = Utils.storage.get('playerShuffle', false);
        const savedRepeat = Utils.storage.get('playerRepeat', 'off');

        this.setVolume(savedVolume);
        this.isShuffle = savedShuffle;
        this.repeatMode = savedRepeat;

        this.updateShuffleUI();
        this.updateRepeatUI();
    }

    /**
     * Save player state to localStorage
     */
    saveState() {
        Utils.storage.set('playerVolume', this.volume);
        Utils.storage.set('playerShuffle', this.isShuffle);
        Utils.storage.set('playerRepeat', this.repeatMode);
    }

    /**
     * Load and play a track
     * @param {Object} track - Track object with audio info
     * @param {Array} queue - Optional queue of tracks
     * @param {number} index - Index in queue
     */
    loadTrack(track, queue = null, index = 0) {
        this.currentTrack = track;

        if (queue) {
            this.queue = queue;
            this.queueIndex = index;
        }

        // Update audio source
        if (track.audioUrl) {
            this.audio.src = track.audioUrl;
        }

        // Update UI
        this.updateNowPlayingUI();
        this.updateQueueUI();

        // Update media session
        this.updateMediaSession();

        // Update ambient colors
        if (typeof ambientController !== 'undefined') {
            ambientController.updateColors(track);
        }

        // Auto play
        this.play();
    }

    /**
     * Play the current track
     */
    play() {
        if (this.currentTrack && this.audio.src) {
            this.audio.play().catch(e => {
                console.log('Playback prevented:', e);
                // For demo, simulate playing without actual audio
                this.isPlaying = true;
                this.updatePlayState(true);
            });
        } else if (this.currentTrack) {
            // Demo mode - no actual audio
            this.isPlaying = true;
            this.updatePlayState(true);
            this.startDemoProgress();
        }
    }

    /**
     * Pause the current track
     */
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayState(false);
        this.stopDemoProgress();
    }

    /**
     * Toggle play/pause
     */
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Play previous track
     */
    previous() {
        // If more than 3 seconds in, restart current track
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }

        if (this.queueIndex > 0) {
            this.queueIndex--;
            this.loadTrack(this.queue[this.queueIndex], null, this.queueIndex);
        }
    }

    /**
     * Play next track
     */
    next() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.play();
            return;
        }

        if (this.queueIndex < this.queue.length - 1) {
            this.queueIndex++;
            this.loadTrack(this.queue[this.queueIndex], null, this.queueIndex);
        } else if (this.repeatMode === 'all') {
            this.queueIndex = 0;
            this.loadTrack(this.queue[0], null, 0);
        }
    }

    /**
     * Toggle shuffle mode
     */
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.updateShuffleUI();
        this.saveState();

        if (this.isShuffle && this.queue.length > 1) {
            // Shuffle remaining queue
            const currentTrack = this.queue[this.queueIndex];
            const remaining = this.queue.filter((_, i) => i !== this.queueIndex);
            const shuffled = Utils.shuffleArray(remaining);
            this.queue = [currentTrack, ...shuffled];
            this.queueIndex = 0;
            this.updateQueueUI();
        }
    }

    /**
     * Toggle repeat mode
     */
    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        this.updateRepeatUI();
        this.saveState();
    }

    /**
     * Seek to position
     * @param {number} percent - Position as percentage (0-100)
     */
    seek(percent) {
        const time = (percent / 100) * this.audio.duration;
        if (!isNaN(time)) {
            this.audio.currentTime = time;
        }

        // Update demo progress if in demo mode
        if (this.currentTrack && !this.audio.src) {
            this.demoProgress = percent;
            this.updateProgressUI(percent);
        }
    }

    /**
     * Set volume
     * @param {number} level - Volume level (0-1)
     */
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        this.audio.volume = this.volume;
        this.isMuted = this.volume === 0;
        this.updateVolumeUI();
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        if (this.isMuted) {
            this.setVolume(this.previousVolume || 0.5);
        } else {
            this.previousVolume = this.volume;
            this.setVolume(0);
        }
    }

    /**
     * Update progress display
     */
    updateProgress() {
        if (!this.audio.duration) return;

        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.updateProgressUI(percent);
    }

    /**
     * Update progress UI elements
     */
    updateProgressUI(percent) {
        if (this.elements.progressBar) {
            this.elements.progressBar.value = percent;
            this.elements.progressBar.style.setProperty('--progress', `${percent}%`);
        }
        if (this.elements.npProgressSlider) {
            this.elements.npProgressSlider.value = percent;
        }

        // Update time displays
        const currentTime = this.audio.duration
            ? (percent / 100) * this.audio.duration
            : (percent / 100) * (this.currentTrack?.duration || 0);

        const formattedCurrent = Utils.formatTime(currentTime);

        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = formattedCurrent;
        }
        if (this.elements.npCurrentTime) {
            this.elements.npCurrentTime.textContent = formattedCurrent;
        }

        // Update mobile progress
        document.documentElement.style.setProperty('--mobile-progress', `${percent}%`);
    }

    /**
     * Update duration display when metadata loads
     */
    updateDuration() {
        const duration = this.audio.duration || this.currentTrack?.duration || 0;
        const formatted = Utils.formatTime(duration);

        if (this.elements.totalTime) {
            this.elements.totalTime.textContent = formatted;
        }
        if (this.elements.npTotalTime) {
            this.elements.npTotalTime.textContent = formatted;
        }
    }

    /**
     * Handle track end
     */
    handleTrackEnd() {
        this.next();
    }

    /**
     * Handle playback error
     */
    handleError(error) {
        console.error('Playback error:', error);
        Utils.showToast('Unable to play this track');
    }

    /**
     * Update play/pause button state
     */
    updatePlayState(isPlaying) {
        this.isPlaying = isPlaying;
        const icon = isPlaying ? 'bi-pause-fill' : 'bi-play-fill';

        if (this.elements.playBtn) {
            this.elements.playBtn.querySelector('i').className = `bi ${icon}`;
        }
        if (this.elements.npPlayPause) {
            this.elements.npPlayPause.querySelector('i').className = `bi ${icon}`;
        }

        // Update ambient controller playing state
        if (typeof ambientController !== 'undefined') {
            ambientController.setPlayingState(isPlaying);
        }
    }

    /**
     * Update now playing UI
     */
    updateNowPlayingUI() {
        if (!this.currentTrack) return;

        const { title, artist, cover, duration } = this.currentTrack;

        // Player bar
        if (this.elements.songTitle) {
            this.elements.songTitle.textContent = title;
        }
        if (this.elements.songArtist) {
            this.elements.songArtist.textContent = artist;
        }
        if (this.elements.albumArt) {
            this.elements.albumArt.src = cover || 'assets/images/default-album.png';
        }

        // Now playing page
        if (this.elements.npTitle) {
            this.elements.npTitle.textContent = title;
        }
        if (this.elements.npArtist) {
            this.elements.npArtist.textContent = artist;
        }
        if (this.elements.npArtwork) {
            this.elements.npArtwork.src = cover || 'assets/images/default-album.png';
        }

        // Duration
        const formattedDuration = Utils.formatTime(duration);
        if (this.elements.totalTime) {
            this.elements.totalTime.textContent = formattedDuration;
        }
        if (this.elements.npTotalTime) {
            this.elements.npTotalTime.textContent = formattedDuration;
        }

        // Reset progress
        this.updateProgressUI(0);
    }

    /**
     * Update shuffle button UI
     */
    updateShuffleUI() {
        const btns = [this.elements.shuffleBtn, this.elements.npShuffle];
        btns.forEach(btn => {
            if (btn) {
                btn.classList.toggle('active', this.isShuffle);
            }
        });
    }

    /**
     * Update repeat button UI
     */
    updateRepeatUI() {
        const btns = [this.elements.repeatBtn, this.elements.npRepeat];
        btns.forEach(btn => {
            if (btn) {
                btn.classList.remove('active', 'repeat-one');
                if (this.repeatMode !== 'off') {
                    btn.classList.add('active');
                }
                if (this.repeatMode === 'one') {
                    btn.classList.add('repeat-one');
                }
            }
        });
    }

    /**
     * Update volume UI
     */
    updateVolumeUI() {
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.value = this.volume * 100;
            this.elements.volumeSlider.style.setProperty('--volume', `${this.volume * 100}%`);
        }

        if (this.elements.volumeBtn) {
            const icon = this.elements.volumeBtn.querySelector('i');
            if (this.volume === 0 || this.isMuted) {
                icon.className = 'bi bi-volume-mute-fill';
            } else if (this.volume < 0.5) {
                icon.className = 'bi bi-volume-down-fill';
            } else {
                icon.className = 'bi bi-volume-up-fill';
            }
        }
    }

    /**
     * Update queue UI
     */
    updateQueueUI() {
        // Update current song in queue
        if (this.elements.queueCurrentSong && this.currentTrack) {
            this.elements.queueCurrentSong.innerHTML = this.createQueueItemHTML(this.currentTrack, true);
        }

        // Update queue list
        if (this.elements.queueList) {
            const upNext = this.queue.slice(this.queueIndex + 1);
            this.elements.queueList.innerHTML = upNext.length
                ? upNext.map(track => this.createQueueItemHTML(track)).join('')
                : '<p class="text-muted" style="padding: 16px; font-size: 14px;">No songs in queue</p>';
        }
    }

    /**
     * Create queue item HTML
     */
    createQueueItemHTML(track, isCurrent = false) {
        return `
            <div class="queue-item ${isCurrent ? 'current' : ''}" data-track-id="${track.id}">
                <div class="queue-item-art">
                    <img src="${track.cover || 'assets/images/default-album.png'}" alt="${track.title}">
                </div>
                <div class="queue-item-info">
                    <div class="queue-item-title">${track.title}</div>
                    <div class="queue-item-artist">${track.artist}</div>
                </div>
            </div>
        `;
    }

    /**
     * Toggle now playing view
     */
    toggleNowPlayingView() {
        if (this.elements.nowPlayingPage) {
            this.elements.nowPlayingPage.classList.toggle('active');
        }
    }

    /**
     * Toggle queue sidebar
     */
    toggleQueue() {
        if (this.elements.queueSidebar) {
            this.elements.queueSidebar.classList.toggle('open');
        }
    }

    /**
     * Toggle fullscreen
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.seek(Math.max(0, (this.audio.currentTime - 5) / this.audio.duration * 100));
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.seek(Math.min(100, (this.audio.currentTime + 5) / this.audio.duration * 100));
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(this.volume + 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(this.volume - 0.1);
                break;
            case 'KeyM':
                this.toggleMute();
                break;
            case 'KeyS':
                this.toggleShuffle();
                break;
            case 'KeyR':
                this.toggleRepeat();
                break;
        }
    }

    /**
     * Setup Media Session API for system media controls
     */
    setupMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => this.play());
            navigator.mediaSession.setActionHandler('pause', () => this.pause());
            navigator.mediaSession.setActionHandler('previoustrack', () => this.previous());
            navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
        }
    }

    /**
     * Update Media Session metadata
     */
    updateMediaSession() {
        if ('mediaSession' in navigator && this.currentTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: this.currentTrack.title,
                artist: this.currentTrack.artist,
                album: this.currentTrack.album || '',
                artwork: [
                    { src: this.currentTrack.cover || '', sizes: '300x300', type: 'image/jpeg' }
                ]
            });
        }
    }

    /**
     * Demo progress simulation (when no actual audio)
     */
    startDemoProgress() {
        this.demoProgress = this.demoProgress || 0;
        this.demoInterval = setInterval(() => {
            if (this.isPlaying && this.currentTrack) {
                const increment = (100 / this.currentTrack.duration) / 10; // Update 10x per second
                this.demoProgress = Math.min(100, this.demoProgress + increment);
                this.updateProgressUI(this.demoProgress);

                if (this.demoProgress >= 100) {
                    this.demoProgress = 0;
                    this.handleTrackEnd();
                }
            }
        }, 100);
    }

    /**
     * Stop demo progress simulation
     */
    stopDemoProgress() {
        if (this.demoInterval) {
            clearInterval(this.demoInterval);
        }
    }

    /**
     * Add track to queue
     */
    addToQueue(track) {
        this.queue.push(track);
        this.updateQueueUI();
        Utils.showToast(`Added "${track.title}" to queue`);
    }

    /**
     * Clear queue
     */
    clearQueue() {
        this.queue = this.currentTrack ? [this.currentTrack] : [];
        this.queueIndex = 0;
        this.updateQueueUI();
    }

    /**
     * Play a playlist
     */
    playPlaylist(tracks, startIndex = 0) {
        if (!tracks || tracks.length === 0) return;

        this.queue = this.isShuffle ? Utils.shuffleArray([...tracks]) : [...tracks];
        this.queueIndex = startIndex;
        this.loadTrack(this.queue[this.queueIndex], null, this.queueIndex);
    }
}

// Initialize player when DOM is ready
let player;
document.addEventListener('DOMContentLoaded', () => {
    player = new MusicPlayer();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicPlayer;
}
