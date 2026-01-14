/* =============================================
   Olympus - Main Application
   ============================================= */

class OlympusApp {
    constructor() {
        this.currentPage = 'home';
        this.searchTimeout = null;

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeGreeting();
        this.loadHomePage();
        this.handleNavigation();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            // Navigation
            sidebar: document.getElementById('sidebar'),
            sidebarToggle: document.getElementById('sidebarToggle'),
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            navItems: document.querySelectorAll('.nav-item[data-page]'),

            // Pages
            pages: document.querySelectorAll('.page'),
            homePage: document.getElementById('homePage'),
            searchPage: document.getElementById('searchPage'),
            libraryPage: document.getElementById('libraryPage'),
            playlistPage: document.getElementById('playlistPage'),

            // Home sections
            heroContent: document.querySelector('.hero-content h1'),
            quickPicks: document.getElementById('quickPicks'),
            recentlyPlayed: document.getElementById('recentlyPlayed'),
            madeForYou: document.getElementById('madeForYou'),
            popularArtists: document.getElementById('popularArtists'),
            featuredCharts: document.getElementById('featuredCharts'),

            // Search
            searchInput: document.getElementById('searchInput'),
            searchContainer: document.getElementById('searchContainer'),
            searchResults: document.getElementById('searchResults'),
            categoriesGrid: document.getElementById('categoriesGrid'),

            // Library
            libraryContent: document.getElementById('libraryContent'),
            libraryFilters: document.querySelectorAll('.filter-chip'),

            // Playlist
            playlistCover: document.getElementById('playlistCover'),
            playlistTitle: document.getElementById('playlistTitle'),
            playlistDescription: document.getElementById('playlistDescription'),
            playlistOwner: document.getElementById('playlistOwner'),
            playlistSongCount: document.getElementById('playlistSongCount'),
            playlistDuration: document.getElementById('playlistDuration'),
            playlistTracks: document.getElementById('playlistTracks'),
            playPlaylistBtn: document.getElementById('btnPlayPlaylist'),

            // Navigation buttons
            btnBack: document.getElementById('btnBack'),
            btnForward: document.getElementById('btnForward')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });

        // Mobile sidebar toggle
        if (this.elements.sidebarToggle) {
            this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Sidebar overlay click
        if (this.elements.sidebarOverlay) {
            this.elements.sidebarOverlay.addEventListener('click', () => this.toggleSidebar(false));
        }

        // Search input
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            this.elements.searchInput.addEventListener('focus', () => {
                this.navigateTo('search');
            });
        }

        // Library filters
        this.elements.libraryFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.elements.libraryFilters.forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                this.loadLibraryContent(e.target.textContent.toLowerCase());
            });
        });

        // Hash change for navigation
        window.addEventListener('hashchange', () => this.handleNavigation());

        // Play playlist button
        if (this.elements.playPlaylistBtn) {
            this.elements.playPlaylistBtn.addEventListener('click', () => {
                this.playCurrentPlaylist();
            });
        }

        // Back/Forward navigation
        if (this.elements.btnBack) {
            this.elements.btnBack.addEventListener('click', () => window.history.back());
        }
        if (this.elements.btnForward) {
            this.elements.btnForward.addEventListener('click', () => window.history.forward());
        }
    }

    /**
     * Set greeting based on time of day
     */
    initializeGreeting() {
        if (this.elements.heroContent) {
            this.elements.heroContent.textContent = Utils.getGreeting();
        }
    }

    /**
     * Navigate to a page
     */
    navigateTo(page, id = null) {
        // Update hash
        const hash = id ? `#${page}/${id}` : `#${page}`;
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }

        // Update active nav item
        this.elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Show correct page
        this.elements.pages.forEach(p => {
            p.classList.remove('active');
        });

        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Show/hide search bar based on page
        if (this.elements.searchContainer) {
            this.elements.searchContainer.classList.toggle('visible', page === 'search');
        }

        // Load page content
        this.currentPage = page;
        this.loadPageContent(page, id);

        // Close mobile sidebar
        this.toggleSidebar(false);
    }

    /**
     * Handle URL hash navigation
     */
    handleNavigation() {
        const { page, id } = Utils.parseHash();
        this.navigateTo(page, id);
    }

    /**
     * Load content for a specific page
     */
    loadPageContent(page, id) {
        switch (page) {
            case 'home':
                this.loadHomePage();
                break;
            case 'search':
                this.loadSearchPage();
                break;
            case 'library':
                this.loadLibraryPage();
                break;
            case 'playlist':
                this.loadPlaylistPage(id);
                break;
        }
    }

    /**
     * Toggle sidebar (mobile)
     */
    toggleSidebar(show = null) {
        const sidebar = this.elements.sidebar;
        const overlay = this.elements.sidebarOverlay;

        if (show === null) {
            show = !sidebar.classList.contains('open');
        }

        sidebar.classList.toggle('open', show);
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }

    /**
     * Load home page content
     */
    loadHomePage() {
        this.loadQuickPicks();
        this.loadRecentlyPlayed();
        this.loadMadeForYou();
        this.loadPopularArtists();
        this.loadFeaturedCharts();
    }

    /**
     * Load quick picks grid
     */
    loadQuickPicks() {
        if (!this.elements.quickPicks) return;

        const html = MockData.quickPicks.map(item => `
            <div class="quick-pick-card" data-id="${item.id}" data-type="${item.type}">
                <img src="${item.cover}" alt="${item.title}">
                <span class="quick-pick-title">${item.title}</span>
                <button class="play-btn" aria-label="Play">
                    <i class="bi bi-play-fill"></i>
                </button>
            </div>
        `).join('');

        this.elements.quickPicks.innerHTML = html;
        this.bindQuickPickEvents();
    }

    /**
     * Load recently played section
     */
    loadRecentlyPlayed() {
        if (!this.elements.recentlyPlayed) return;

        const playlists = MockData.playlists.slice(0, 6);
        this.elements.recentlyPlayed.innerHTML = this.createCardsHTML(playlists, 'playlist');
        this.bindCardEvents(this.elements.recentlyPlayed);
    }

    /**
     * Load made for you section
     */
    loadMadeForYou() {
        if (!this.elements.madeForYou) return;

        const playlists = MockData.playlists.slice(0, 6).map((p, i) => ({
            ...p,
            name: `Daily Mix ${i + 1}`,
            description: 'Based on your recent listening'
        }));
        this.elements.madeForYou.innerHTML = this.createCardsHTML(playlists, 'playlist');
        this.bindCardEvents(this.elements.madeForYou);
    }

    /**
     * Load popular artists section
     */
    loadPopularArtists() {
        if (!this.elements.popularArtists) return;

        this.elements.popularArtists.innerHTML = this.createArtistCardsHTML(MockData.artists);
        this.bindCardEvents(this.elements.popularArtists);
    }

    /**
     * Load featured charts section
     */
    loadFeaturedCharts() {
        if (!this.elements.featuredCharts) return;

        const charts = [
            { id: 'chart1', name: 'Top 50 Global', description: 'Your daily update of the most played tracks', cover: 'https://picsum.photos/seed/chart1/300/300' },
            { id: 'chart2', name: 'Top 50 USA', description: 'Your daily update of the most played tracks in USA', cover: 'https://picsum.photos/seed/chart2/300/300' },
            { id: 'chart3', name: 'Viral 50 Global', description: 'Your daily update of the most viral tracks', cover: 'https://picsum.photos/seed/chart3/300/300' },
            { id: 'chart4', name: 'Top Songs Global', description: 'The most streamed songs right now', cover: 'https://picsum.photos/seed/chart4/300/300' }
        ];

        this.elements.featuredCharts.innerHTML = this.createCardsHTML(charts, 'playlist');
        this.bindCardEvents(this.elements.featuredCharts);
    }

    /**
     * Create cards HTML for playlists/albums
     */
    createCardsHTML(items, type) {
        return items.map(item => `
            <div class="card" data-id="${item.id}" data-type="${type}">
                <div class="card-image">
                    <img src="${item.cover || item.image}" alt="${item.name}">
                    <button class="card-play-btn" aria-label="Play">
                        <i class="bi bi-play-fill"></i>
                    </button>
                </div>
                <div class="card-title">${item.name}</div>
                <div class="card-subtitle">${item.description || item.owner || ''}</div>
            </div>
        `).join('');
    }

    /**
     * Create artist cards HTML
     */
    createArtistCardsHTML(artists) {
        return artists.map(artist => `
            <div class="card" data-id="${artist.id}" data-type="artist">
                <div class="card-image artist">
                    <img src="${artist.image}" alt="${artist.name}">
                    <button class="card-play-btn" aria-label="Play">
                        <i class="bi bi-play-fill"></i>
                    </button>
                </div>
                <div class="card-title">${artist.name}</div>
                <div class="card-subtitle artist">Artist</div>
            </div>
        `).join('');
    }

    /**
     * Bind click events to cards
     */
    bindCardEvents(container) {
        container.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = card.dataset.id;
                const type = card.dataset.type;

                // If clicking play button, play immediately
                if (e.target.closest('.card-play-btn')) {
                    this.playItem(type, id);
                } else {
                    // Navigate to item page
                    this.navigateTo(type, id);
                }
            });
        });
    }

    /**
     * Bind quick pick card events
     */
    bindQuickPickEvents() {
        this.elements.quickPicks.querySelectorAll('.quick-pick-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = card.dataset.id;
                const type = card.dataset.type;

                if (e.target.closest('.play-btn')) {
                    this.playItem(type, id);
                } else {
                    this.navigateTo(type, id);
                }
            });
        });
    }

    /**
     * Load search page
     */
    loadSearchPage() {
        this.loadCategories();
    }

    /**
     * Load browse categories
     */
    loadCategories() {
        if (!this.elements.categoriesGrid) return;

        const html = MockData.categories.map(cat => `
            <div class="category-card" style="background-color: ${cat.color}" data-id="${cat.id}">
                <h3>${cat.name}</h3>
            </div>
        `).join('');

        this.elements.categoriesGrid.innerHTML = html;
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        clearTimeout(this.searchTimeout);

        if (!query.trim()) {
            this.elements.searchResults.innerHTML = '';
            return;
        }

        this.searchTimeout = setTimeout(() => {
            const results = MockData.search(query);
            this.displaySearchResults(results);
        }, 300);
    }

    /**
     * Display search results
     */
    displaySearchResults(results) {
        if (!this.elements.searchResults) return;

        let html = '';

        // Songs
        if (results.songs.length > 0) {
            html += `
                <div class="search-section">
                    <h3>Songs</h3>
                    <div class="search-tracks">
                        ${results.songs.map(song => this.createSearchTrackHTML(song)).join('')}
                    </div>
                </div>
            `;
        }

        // Artists
        if (results.artists.length > 0) {
            html += `
                <div class="search-section">
                    <h3>Artists</h3>
                    <div class="cards-row">
                        ${this.createArtistCardsHTML(results.artists)}
                    </div>
                </div>
            `;
        }

        // Playlists
        if (results.playlists.length > 0) {
            html += `
                <div class="search-section">
                    <h3>Playlists</h3>
                    <div class="cards-row">
                        ${this.createCardsHTML(results.playlists, 'playlist')}
                    </div>
                </div>
            `;
        }

        if (!html) {
            html = '<p class="no-results">No results found</p>';
        }

        this.elements.searchResults.innerHTML = html;
        this.bindSearchResultEvents();
    }

    /**
     * Create search track result HTML
     */
    createSearchTrackHTML(song) {
        return `
            <div class="search-track" data-id="${song.id}">
                <img src="${song.cover}" alt="${song.title}" class="search-track-art">
                <div class="search-track-info">
                    <div class="search-track-title">${song.title}</div>
                    <div class="search-track-artist">${song.artist}</div>
                </div>
                <span class="search-track-duration">${Utils.formatTime(song.duration)}</span>
            </div>
        `;
    }

    /**
     * Bind search result click events
     */
    bindSearchResultEvents() {
        // Track clicks
        this.elements.searchResults.querySelectorAll('.search-track').forEach(track => {
            track.addEventListener('click', () => {
                const id = track.dataset.id;
                const song = MockData.getSong(id);
                if (song && player) {
                    player.loadTrack(song, [song], 0);
                }
            });
        });

        // Card clicks
        this.bindCardEvents(this.elements.searchResults);
    }

    /**
     * Load library page
     */
    loadLibraryPage() {
        this.loadLibraryContent('playlists');
    }

    /**
     * Load library content based on filter
     */
    loadLibraryContent(filter) {
        if (!this.elements.libraryContent) return;

        let html = '';

        switch (filter) {
            case 'playlists':
                html = MockData.playlists.map(p => this.createLibraryItemHTML(p, 'playlist')).join('');
                break;
            case 'artists':
                html = MockData.artists.map(a => this.createLibraryItemHTML(a, 'artist')).join('');
                break;
            case 'albums':
                html = '<p class="text-muted" style="padding: 16px;">No albums saved yet</p>';
                break;
        }

        this.elements.libraryContent.innerHTML = html;
        this.bindLibraryItemEvents();
    }

    /**
     * Create library item HTML
     */
    createLibraryItemHTML(item, type) {
        return `
            <div class="library-item" data-id="${item.id}" data-type="${type}">
                <div class="library-item-image ${type === 'artist' ? 'artist' : ''}">
                    <img src="${item.cover || item.image}" alt="${item.name}">
                </div>
                <div class="library-item-info">
                    <div class="library-item-title">${item.name}</div>
                    <div class="library-item-meta">${type === 'artist' ? 'Artist' : `Playlist • ${item.owner}`}</div>
                </div>
            </div>
        `;
    }

    /**
     * Bind library item click events
     */
    bindLibraryItemEvents() {
        this.elements.libraryContent.querySelectorAll('.library-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const type = item.dataset.type;
                this.navigateTo(type, id);
            });
        });
    }

    /**
     * Load playlist page
     */
    loadPlaylistPage(id) {
        if (!id) return;

        const playlist = MockData.getPlaylistWithSongs(id);
        if (!playlist) {
            Utils.showToast('Playlist not found');
            this.navigateTo('home');
            return;
        }

        this.currentPlaylist = playlist;

        // Update header
        if (this.elements.playlistCover) {
            this.elements.playlistCover.src = playlist.cover;
        }
        if (this.elements.playlistTitle) {
            this.elements.playlistTitle.textContent = playlist.name;
        }
        if (this.elements.playlistDescription) {
            this.elements.playlistDescription.textContent = playlist.description;
        }
        if (this.elements.playlistOwner) {
            this.elements.playlistOwner.textContent = playlist.owner;
        }
        if (this.elements.playlistSongCount) {
            this.elements.playlistSongCount.textContent = `${playlist.tracks.length} songs`;
        }
        if (this.elements.playlistDuration) {
            this.elements.playlistDuration.textContent = Utils.formatDuration(playlist.totalDuration);
        }

        // Load tracks
        if (this.elements.playlistTracks) {
            this.elements.playlistTracks.innerHTML = playlist.tracks.map((track, index) => `
                <div class="track-row" data-id="${track.id}" data-index="${index}">
                    <span class="track-number">${index + 1}</span>
                    <button class="track-play" aria-label="Play">
                        <i class="bi bi-play-fill"></i>
                    </button>
                    <div class="track-title-cell">
                        <div class="track-art">
                            <img src="${track.cover}" alt="${track.title}">
                        </div>
                        <div class="track-info">
                            <span class="track-name">${track.title}</span>
                            <span class="track-artist">${track.artist}</span>
                        </div>
                    </div>
                    <span class="track-album">${track.album}</span>
                    <span class="track-date">Recently added</span>
                    <span class="track-duration">${Utils.formatTime(track.duration)}</span>
                </div>
            `).join('');

            this.bindTrackEvents();
        }
    }

    /**
     * Bind track row click events
     */
    bindTrackEvents() {
        this.elements.playlistTracks.querySelectorAll('.track-row').forEach(row => {
            row.addEventListener('click', () => {
                const index = parseInt(row.dataset.index);
                this.playCurrentPlaylist(index);
            });
        });
    }

    /**
     * Play current playlist
     */
    playCurrentPlaylist(startIndex = 0) {
        if (!this.currentPlaylist || !player) return;
        player.playPlaylist(this.currentPlaylist.tracks, startIndex);
    }

    /**
     * Play an item (playlist, album, artist)
     */
    playItem(type, id) {
        if (type === 'playlist') {
            const playlist = MockData.getPlaylistWithSongs(id);
            if (playlist && player) {
                player.playPlaylist(playlist.tracks, 0);
            }
        } else if (type === 'artist') {
            // Play artist's top songs
            const artistSongs = MockData.songs.filter(s => {
                const artist = MockData.artists.find(a => a.id === id);
                return artist && s.artist.includes(artist.name);
            });
            if (artistSongs.length && player) {
                player.playPlaylist(artistSongs, 0);
            }
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new OlympusApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OlympusApp;
}
