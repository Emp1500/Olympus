/* =============================================
   Olympus - API Service
   ============================================= */

const API = {
    baseUrl: '/api',

    async request(endpoint, options = {}) {
        try {
            const response = await axios({
                url: `${this.baseUrl}${endpoint}`,
                method: options.method || 'GET',
                data: options.data,
                params: options.params,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async search(query, type = 'all') {
        return this.request('/search', { params: { q: query, type } });
    },

    async getFeaturedPlaylists() {
        return this.request('/playlists/featured');
    },

    async getPlaylist(id) {
        return this.request(`/playlists/${id}`);
    },

    async getAlbum(id) {
        return this.request(`/albums/${id}`);
    },

    async getArtist(id) {
        return this.request(`/artists/${id}`);
    },

    async getRecommendations() {
        return this.request('/recommendations');
    },

    async getCategories() {
        return this.request('/browse/categories');
    },

    async getNewReleases() {
        return this.request('/browse/new-releases');
    }
};

/* =============================================
   Mock Data Service (for development)
   ============================================= */

const MockData = {
    // Songs with local album art
    songs: [
        {
            id: '1',
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            album: 'After Hours',
            duration: 200,
            cover: 'assets/images/albums/after-hours.svg',
            colors: ['#c41230', '#1a0a0f', '#e8384f', '#2d1216'],
            audioUrl: ''
        },
        {
            id: '2',
            title: 'Levitating',
            artist: 'Dua Lipa',
            album: 'Future Nostalgia',
            duration: 203,
            cover: 'assets/images/albums/future-nostalgia.svg',
            colors: ['#c5a3cd', '#1e3d59', '#e8d5eb', '#0f1f2e'],
            audioUrl: ''
        },
        {
            id: '3',
            title: 'Stay',
            artist: 'The Kid LAROI, Justin Bieber',
            album: 'F*CK LOVE 3',
            duration: 141,
            cover: 'assets/images/albums/fck-love.svg',
            colors: ['#d63447', '#f7dc6f', '#1a1a2e', '#ff6b6b'],
            audioUrl: ''
        },
        {
            id: '4',
            title: 'Heat Waves',
            artist: 'Glass Animals',
            album: 'Dreamland',
            duration: 238,
            cover: 'assets/images/albums/dreamland.svg',
            colors: ['#f4a460', '#2e1f5e', '#ff7f50', '#1a0f3c'],
            audioUrl: ''
        },
        {
            id: '5',
            title: 'Good 4 U',
            artist: 'Olivia Rodrigo',
            album: 'SOUR',
            duration: 178,
            cover: 'assets/images/albums/sour.svg',
            colors: ['#9b59b6', '#e8daef', '#6c3483', '#f5eef8'],
            audioUrl: ''
        },
        {
            id: '6',
            title: 'Peaches',
            artist: 'Justin Bieber',
            album: 'Justice',
            duration: 198,
            cover: 'assets/images/albums/justice.svg',
            colors: ['#f5b041', '#d4ac0d', '#784212', '#fdebd0'],
            audioUrl: ''
        },
        {
            id: '7',
            title: 'Watermelon Sugar',
            artist: 'Harry Styles',
            album: 'Fine Line',
            duration: 174,
            cover: 'assets/images/albums/fine-line.svg',
            colors: ['#f8b4d9', '#7eb8da', '#fce4ec', '#2e86ab'],
            audioUrl: ''
        },
        {
            id: '8',
            title: 'Save Your Tears',
            artist: 'The Weeknd',
            album: 'After Hours',
            duration: 215,
            cover: 'assets/images/albums/after-hours.svg',
            colors: ['#c41230', '#1a0a0f', '#e8384f', '#2d1216'],
            audioUrl: ''
        },
        {
            id: '9',
            title: 'Montero',
            artist: 'Lil Nas X',
            album: 'MONTERO',
            duration: 137,
            cover: 'assets/images/albums/montero.svg',
            colors: ['#ff6b35', '#f7c59f', '#1a535c', '#4ecdc4'],
            audioUrl: ''
        },
        {
            id: '10',
            title: 'drivers license',
            artist: 'Olivia Rodrigo',
            album: 'SOUR',
            duration: 242,
            cover: 'assets/images/albums/sour.svg',
            colors: ['#9b59b6', '#e8daef', '#6c3483', '#f5eef8'],
            audioUrl: ''
        },
        {
            id: '11',
            title: 'Kiss Me More',
            artist: 'Doja Cat ft. SZA',
            album: 'Planet Her',
            duration: 208,
            cover: 'assets/images/albums/planet-her.svg',
            colors: ['#a8e6cf', '#88d8b0', '#ffefd5', '#56ab91'],
            audioUrl: ''
        },
        {
            id: '12',
            title: 'Industry Baby',
            artist: 'Lil Nas X, Jack Harlow',
            album: 'MONTERO',
            duration: 212,
            cover: 'assets/images/albums/montero.svg',
            colors: ['#ff6b35', '#f7c59f', '#1a535c', '#4ecdc4'],
            audioUrl: ''
        }
    ],

    // Playlists with local covers
    playlists: [
        {
            id: 'p1',
            name: "Today's Top Hits",
            description: 'The hottest 50 tracks right now',
            cover: 'assets/images/playlists/todays-top-hits.svg',
            colors: ['#1db954', '#121212', '#1ed760', '#191414'],
            owner: 'Olympus',
            songs: ['1', '2', '3', '4', '5', '6']
        },
        {
            id: 'p2',
            name: 'Chill Vibes',
            description: 'Relax and unwind with these mellow tracks',
            cover: 'assets/images/playlists/chill-vibes.svg',
            colors: ['#5b7fa3', '#1a2634', '#8ab4d6', '#0d141b'],
            owner: 'Olympus',
            songs: ['2', '4', '7', '10']
        },
        {
            id: 'p3',
            name: 'Workout Mix',
            description: 'High energy tracks to power your workout',
            cover: 'assets/images/playlists/workout-mix.svg',
            colors: ['#e63946', '#ff6b6b', '#1d3557', '#457b9d'],
            owner: 'Olympus',
            songs: ['1', '3', '5', '9', '12']
        },
        {
            id: 'p4',
            name: 'Midnight Drive',
            description: 'Perfect songs for late night drives',
            cover: 'assets/images/playlists/midnight-drive.svg',
            colors: ['#2d3436', '#636e72', '#0984e3', '#74b9ff'],
            owner: 'Olympus',
            songs: ['1', '8', '10']
        },
        {
            id: 'p5',
            name: 'Summer Hits',
            description: 'Sunny vibes for the perfect summer day',
            cover: 'assets/images/playlists/summer-hits.svg',
            colors: ['#f9ca24', '#f0932b', '#eb4d4b', '#ff7979'],
            owner: 'Olympus',
            songs: ['2', '6', '7', '11']
        },
        {
            id: 'p6',
            name: 'Feel Good Favorites',
            description: 'Uplifting songs to boost your mood',
            cover: 'assets/images/playlists/feel-good.svg',
            colors: ['#a29bfe', '#6c5ce7', '#fd79a8', '#e84393'],
            owner: 'Olympus',
            songs: ['2', '3', '5', '7', '9', '11']
        }
    ],

    // Artists with local images
    artists: [
        {
            id: 'a1',
            name: 'The Weeknd',
            image: 'assets/images/artists/the-weeknd.svg',
            colors: ['#c41230', '#1a0a0f'],
            followers: 85000000,
            type: 'Artist'
        },
        {
            id: 'a2',
            name: 'Dua Lipa',
            image: 'assets/images/artists/dua-lipa.svg',
            colors: ['#c5a3cd', '#1e3d59'],
            followers: 72000000,
            type: 'Artist'
        },
        {
            id: 'a3',
            name: 'Justin Bieber',
            image: 'assets/images/artists/justin-bieber.svg',
            colors: ['#f5b041', '#784212'],
            followers: 90000000,
            type: 'Artist'
        },
        {
            id: 'a4',
            name: 'Olivia Rodrigo',
            image: 'assets/images/artists/olivia-rodrigo.svg',
            colors: ['#9b59b6', '#6c3483'],
            followers: 45000000,
            type: 'Artist'
        },
        {
            id: 'a5',
            name: 'Harry Styles',
            image: 'assets/images/artists/harry-styles.svg',
            colors: ['#f8b4d9', '#7eb8da'],
            followers: 65000000,
            type: 'Artist'
        },
        {
            id: 'a6',
            name: 'Lil Nas X',
            image: 'assets/images/artists/lil-nas-x.svg',
            colors: ['#ff6b35', '#1a535c'],
            followers: 38000000,
            type: 'Artist'
        }
    ],

    // Browse categories
    categories: [
        { id: 'c1', name: 'Pop', color: '#8c67ac' },
        { id: 'c2', name: 'Hip-Hop', color: '#ba5d07' },
        { id: 'c3', name: 'Rock', color: '#e61e32' },
        { id: 'c4', name: 'R&B', color: '#dc148c' },
        { id: 'c5', name: 'Electronic', color: '#1e3264' },
        { id: 'c6', name: 'Indie', color: '#608108' },
        { id: 'c7', name: 'Jazz', color: '#477d95' },
        { id: 'c8', name: 'Classical', color: '#7d4b32' },
        { id: 'c9', name: 'Country', color: '#a56752' },
        { id: 'c10', name: 'Workout', color: '#148a08' },
        { id: 'c11', name: 'Focus', color: '#503750' },
        { id: 'c12', name: 'Chill', color: '#0d73ec' }
    ],

    // Quick picks for home
    quickPicks: [
        {
            id: 'qp1',
            title: 'Liked Songs',
            cover: 'assets/images/playlists/liked-songs.svg',
            colors: ['#4f378a', '#2a1f47'],
            type: 'playlist'
        },
        {
            id: 'p1',
            title: "Today's Top Hits",
            cover: 'assets/images/playlists/todays-top-hits.svg',
            colors: ['#1db954', '#121212'],
            type: 'playlist'
        },
        {
            id: 'p2',
            title: 'Chill Vibes',
            cover: 'assets/images/playlists/chill-vibes.svg',
            colors: ['#5b7fa3', '#1a2634'],
            type: 'playlist'
        },
        {
            id: 'p5',
            title: 'Summer Hits',
            cover: 'assets/images/playlists/summer-hits.svg',
            colors: ['#f9ca24', '#f0932b'],
            type: 'playlist'
        },
        {
            id: 'p3',
            title: 'Workout Mix',
            cover: 'assets/images/playlists/workout-mix.svg',
            colors: ['#e63946', '#1d3557'],
            type: 'playlist'
        },
        {
            id: 'p6',
            title: 'Feel Good',
            cover: 'assets/images/playlists/feel-good.svg',
            colors: ['#a29bfe', '#6c5ce7'],
            type: 'playlist'
        }
    ],

    getSong(id) {
        return this.songs.find(s => s.id === id);
    },

    getPlaylistWithSongs(id) {
        const playlist = this.playlists.find(p => p.id === id);
        if (!playlist) return null;

        return {
            ...playlist,
            tracks: playlist.songs.map(songId => this.getSong(songId)).filter(Boolean),
            totalDuration: playlist.songs.reduce((acc, songId) => {
                const song = this.getSong(songId);
                return acc + (song ? song.duration : 0);
            }, 0)
        };
    },

    search(query) {
        const q = query.toLowerCase();
        return {
            songs: this.songs.filter(s =>
                s.title.toLowerCase().includes(q) ||
                s.artist.toLowerCase().includes(q)
            ),
            artists: this.artists.filter(a =>
                a.name.toLowerCase().includes(q)
            ),
            playlists: this.playlists.filter(p =>
                p.name.toLowerCase().includes(q)
            )
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, MockData };
}
