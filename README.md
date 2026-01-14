# MeloVibe - Music Streaming Platform

A modern, professional music streaming web application inspired by Spotify and Apple Music. Built with a focus on sleek UI/UX and seamless user experience.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Styling | Bootstrap 5, Custom CSS |
| HTTP Client | Axios |
| Backend | Express.js (Node.js) |
| Icons | Font Awesome / Bootstrap Icons |

---

## Project Phases

### Phase 1: Frontend Development (Current Focus)

#### 1.1 Core Layout & Navigation
- [ ] Responsive sidebar navigation (Spotify-style)
- [ ] Top navigation bar with search and user profile
- [ ] Main content area with dynamic views
- [ ] Footer player bar (fixed bottom)

#### 1.2 Pages to Build
- [ ] **Home Page** - Featured playlists, recently played, recommendations
- [ ] **Search Page** - Search bar with genre cards, browse categories
- [ ] **Library Page** - User's playlists, liked songs, albums, artists
- [ ] **Playlist View** - Song list with album art, duration, play controls
- [ ] **Album View** - Album details with track listing
- [ ] **Artist Page** - Artist bio, top songs, albums, similar artists
- [ ] **Now Playing View** - Full-screen player with lyrics support

#### 1.3 Player Component
- [ ] Play/Pause, Next, Previous controls
- [ ] Progress bar with seek functionality
- [ ] Volume control with mute toggle
- [ ] Shuffle and repeat modes
- [ ] Queue management
- [ ] Mini player in footer
- [ ] Expanded full-screen player

#### 1.4 UI/UX Features
- [ ] Smooth animations and transitions
- [ ] Hover effects on cards and buttons
- [ ] Dark theme (primary) with optional light theme
- [ ] Skeleton loading states
- [ ] Toast notifications
- [ ] Modal dialogs for actions

---

### Phase 2: Backend Development

#### 2.1 Server Setup
- [ ] Express.js server configuration
- [ ] API route structure
- [ ] Error handling middleware
- [ ] CORS configuration

#### 2.2 API Endpoints
- [ ] `GET /api/search?q=` - Search songs, artists, albums
- [ ] `GET /api/songs/:id` - Get song details
- [ ] `GET /api/playlists` - Get user playlists
- [ ] `GET /api/playlists/:id` - Get playlist songs
- [ ] `GET /api/albums/:id` - Get album details
- [ ] `GET /api/artists/:id` - Get artist info
- [ ] `GET /api/recommendations` - Get personalized recommendations

#### 2.3 External API Integration
- [ ] Integrate with music API (Spotify API / Last.fm / Deezer)
- [ ] Audio streaming setup
- [ ] Album art fetching

---

### Phase 3: Advanced Features

- [ ] User authentication (login/signup)
- [ ] Create and manage playlists
- [ ] Like/save songs
- [ ] Recently played history
- [ ] Download for offline (PWA)
- [ ] Lyrics display
- [ ] Social sharing
- [ ] Equalizer settings

---

## Project Structure

```
AppleMusic Clone/
├── public/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   ├── player.css
│   │   ├── sidebar.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── player.js
│   │   ├── api.js
│   │   ├── search.js
│   │   └── utils.js
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   └── pages/
│       ├── search.html
│       ├── library.html
│       ├── playlist.html
│       └── artist.html
├── server/
│   ├── index.js
│   ├── routes/
│   │   ├── songs.js
│   │   ├── playlists.js
│   │   └── search.js
│   └── middleware/
│       └── errorHandler.js
├── package.json
└── README.md
```

---

## Design Inspiration

### From Spotify:
- Dark theme with vibrant green accents
- Card-based layout for albums/playlists
- Horizontal scrolling sections
- Compact sidebar navigation
- Bottom player bar design

### From Apple Music:
- Clean, minimalist aesthetics
- Bold typography
- Smooth gradient backgrounds
- Spatial audio indicators
- Animated album art
- Lyrics integration style

### Our Unique Touch:
- Gradient color scheme (Purple → Pink → Orange)
- Glass-morphism effects
- Micro-interactions on hover
- Animated waveform visualizer
- Modern card designs with blur effects

---

## Color Palette

```css
:root {
  /* Primary Colors */
  --bg-primary: #121212;
  --bg-secondary: #181818;
  --bg-elevated: #282828;

  /* Accent Colors */
  --accent-primary: #1DB954;    /* Spotify Green */
  --accent-secondary: #FA2D48;  /* Apple Music Red */
  --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* Text Colors */
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --text-muted: #6A6A6A;

  /* Interactive */
  --hover-highlight: rgba(255, 255, 255, 0.1);
  --active-highlight: rgba(255, 255, 255, 0.2);
}
```

---

## Key Components

### 1. Sidebar Navigation
```
┌─────────────────┐
│  🎵 MeloVibe    │
├─────────────────┤
│  🏠 Home        │
│  🔍 Search      │
│  📚 Library     │
├─────────────────┤
│  PLAYLISTS      │
│  ├─ Liked Songs │
│  ├─ My Mix #1   │
│  └─ + Create    │
└─────────────────┘
```

### 2. Player Bar
```
┌────────────────────────────────────────────────────────────────┐
│ [Art] Song Name          ◀◀  ▶▶  ▶▶   ━━━●━━━━━━  🔊 ━━●━━  │
│       Artist Name        🔀      🔁    2:34 / 4:12            │
└────────────────────────────────────────────────────────────────┘
```

### 3. Song Card
```
┌─────────────┐
│  ┌───────┐  │
│  │ Album │  │
│  │  Art  │  │
│  └───────┘  │
│  Song Title │
│  Artist     │
└─────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd "AppleMusic Clone"

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

```json
{
  "start": "node server/index.js",
  "dev": "nodemon server/index.js",
  "build": "npm run build:css"
}
```

---

## Development Milestones

| Milestone | Description | Status |
|-----------|-------------|--------|
| M1 | Project setup & basic structure | 🔄 In Progress |
| M2 | Sidebar & navigation | ⏳ Pending |
| M3 | Home page with cards | ⏳ Pending |
| M4 | Search functionality UI | ⏳ Pending |
| M5 | Player component | ⏳ Pending |
| M6 | Playlist & album views | ⏳ Pending |
| M7 | Backend API setup | ⏳ Pending |
| M8 | API integration | ⏳ Pending |
| M9 | Polish & animations | ⏳ Pending |
| M10 | Testing & deployment | ⏳ Pending |

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

This project is for educational purposes only.

---

**Let's build something amazing! 🎶**
