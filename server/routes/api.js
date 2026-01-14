const express = require('express');
const router = express.Router();

// Mock data with proper album art and color palettes
const mockData = {
    songs: [
        {
            id: '1',
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            album: 'After Hours',
            duration: 200,
            cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
            colors: ['#c41230', '#1a0a0f', '#e8384f', '#2d1216']
        },
        {
            id: '2',
            title: 'Levitating',
            artist: 'Dua Lipa',
            album: 'Future Nostalgia',
            duration: 203,
            cover: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
            colors: ['#c5a3cd', '#1e3d59', '#e8d5eb', '#0f1f2e']
        },
        {
            id: '3',
            title: 'Stay',
            artist: 'The Kid LAROI, Justin Bieber',
            album: 'F*CK LOVE 3',
            duration: 141,
            cover: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
            colors: ['#d63447', '#f7dc6f', '#1a1a2e', '#ff6b6b']
        },
        {
            id: '4',
            title: 'Heat Waves',
            artist: 'Glass Animals',
            album: 'Dreamland',
            duration: 238,
            cover: 'https://i.scdn.co/image/ab67616d0000b273712701c5e263efc8726b1464',
            colors: ['#f4a460', '#2e1f5e', '#ff7f50', '#1a0f3c']
        },
        {
            id: '5',
            title: 'Good 4 U',
            artist: 'Olivia Rodrigo',
            album: 'SOUR',
            duration: 178,
            cover: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
            colors: ['#9b59b6', '#e8daef', '#6c3483', '#f5eef8']
        },
        {
            id: '6',
            title: 'Peaches',
            artist: 'Justin Bieber',
            album: 'Justice',
            duration: 198,
            cover: 'https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431',
            colors: ['#f5b041', '#d4ac0d', '#784212', '#fdebd0']
        },
        {
            id: '7',
            title: 'Watermelon Sugar',
            artist: 'Harry Styles',
            album: 'Fine Line',
            duration: 174,
            cover: 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14',
            colors: ['#f8b4d9', '#7eb8da', '#fce4ec', '#2e86ab']
        },
        {
            id: '8',
            title: 'Save Your Tears',
            artist: 'The Weeknd',
            album: 'After Hours',
            duration: 215,
            cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
            colors: ['#c41230', '#1a0a0f', '#e8384f', '#2d1216']
        },
        {
            id: '9',
            title: 'Montero',
            artist: 'Lil Nas X',
            album: 'MONTERO',
            duration: 137,
            cover: 'https://i.scdn.co/image/ab67616d0000b273be82673b5f79d9658ec0a9fd',
            colors: ['#ff6b35', '#f7c59f', '#1a535c', '#4ecdc4']
        },
        {
            id: '10',
            title: 'drivers license',
            artist: 'Olivia Rodrigo',
            album: 'SOUR',
            duration: 242,
            cover: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
            colors: ['#9b59b6', '#e8daef', '#6c3483', '#f5eef8']
        },
        {
            id: '11',
            title: 'Kiss Me More',
            artist: 'Doja Cat ft. SZA',
            album: 'Planet Her',
            duration: 208,
            cover: 'https://i.scdn.co/image/ab67616d0000b2734df3245f26298a1579ecc321',
            colors: ['#a8e6cf', '#88d8b0', '#ffefd5', '#56ab91']
        },
        {
            id: '12',
            title: 'Industry Baby',
            artist: 'Lil Nas X, Jack Harlow',
            album: 'MONTERO',
            duration: 212,
            cover: 'https://i.scdn.co/image/ab67616d0000b273be82673b5f79d9658ec0a9fd',
            colors: ['#ff6b35', '#f7c59f', '#1a535c', '#4ecdc4']
        }
    ],
    playlists: [
        {
            id: 'p1',
            name: "Today's Top Hits",
            description: 'The hottest 50 tracks right now',
            cover: 'https://i.scdn.co/image/ab67706f00000003b3470e0c0ed6a2c1c21f5591',
            colors: ['#1db954', '#121212', '#1ed760', '#191414'],
            owner: 'Olympus',
            songs: ['1', '2', '3', '4', '5', '6']
        },
        {
            id: 'p2',
            name: 'Chill Vibes',
            description: 'Relax and unwind with these mellow tracks',
            cover: 'https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c67d8e',
            colors: ['#5b7fa3', '#1a2634', '#8ab4d6', '#0d141b'],
            owner: 'Olympus',
            songs: ['2', '4', '7', '10']
        },
        {
            id: 'p3',
            name: 'Workout Mix',
            description: 'High energy tracks to power your workout',
            cover: 'https://i.scdn.co/image/ab67706f00000003e4b3f1c3a4c7a4c7a4c7a4c7',
            colors: ['#e63946', '#ff6b6b', '#1d3557', '#457b9d'],
            owner: 'Olympus',
            songs: ['1', '3', '5', '9', '12']
        }
    ],
    artists: [
        {
            id: 'a1',
            name: 'The Weeknd',
            image: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb',
            colors: ['#c41230', '#1a0a0f'],
            followers: 85000000
        },
        {
            id: 'a2',
            name: 'Dua Lipa',
            image: 'https://i.scdn.co/image/ab6761610000e5eb1bbee4a02f85ecc58a995644',
            colors: ['#c5a3cd', '#1e3d59'],
            followers: 72000000
        },
        {
            id: 'a3',
            name: 'Justin Bieber',
            image: 'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36',
            colors: ['#f5b041', '#784212'],
            followers: 90000000
        }
    ],
    categories: [
        { id: 'c1', name: 'Pop', color: '#8c67ac' },
        { id: 'c2', name: 'Hip-Hop', color: '#ba5d07' },
        { id: 'c3', name: 'Rock', color: '#e61e32' },
        { id: 'c4', name: 'R&B', color: '#dc148c' },
        { id: 'c5', name: 'Electronic', color: '#1e3264' },
        { id: 'c6', name: 'Indie', color: '#608108' }
    ]
};

// Search endpoint
router.get('/search', (req, res) => {
    const { q, type = 'all' } = req.query;

    if (!q) {
        return res.json({ songs: [], artists: [], playlists: [] });
    }

    const query = q.toLowerCase();
    const results = {};

    if (type === 'all' || type === 'track') {
        results.songs = mockData.songs.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.artist.toLowerCase().includes(query)
        );
    }

    if (type === 'all' || type === 'artist') {
        results.artists = mockData.artists.filter(a =>
            a.name.toLowerCase().includes(query)
        );
    }

    if (type === 'all' || type === 'playlist') {
        results.playlists = mockData.playlists.filter(p =>
            p.name.toLowerCase().includes(query)
        );
    }

    res.json(results);
});

// Get song by ID
router.get('/songs/:id', (req, res) => {
    const song = mockData.songs.find(s => s.id === req.params.id);
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
});

// Get all playlists
router.get('/playlists', (req, res) => {
    res.json(mockData.playlists);
});

// Get featured playlists
router.get('/playlists/featured', (req, res) => {
    res.json(mockData.playlists);
});

// Get playlist by ID
router.get('/playlists/:id', (req, res) => {
    const playlist = mockData.playlists.find(p => p.id === req.params.id);
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    // Include full song data
    const tracks = playlist.songs
        .map(songId => mockData.songs.find(s => s.id === songId))
        .filter(Boolean);

    res.json({ ...playlist, tracks });
});

// Get artist by ID
router.get('/artists/:id', (req, res) => {
    const artist = mockData.artists.find(a => a.id === req.params.id);
    if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
    }
    res.json(artist);
});

// Get recommendations
router.get('/recommendations', (req, res) => {
    const shuffled = [...mockData.songs].sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 6));
});

// Get browse categories
router.get('/browse/categories', (req, res) => {
    res.json(mockData.categories);
});

// Get new releases
router.get('/browse/new-releases', (req, res) => {
    res.json(mockData.songs.slice(0, 6));
});

module.exports = router;
