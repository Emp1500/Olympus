const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes placeholder
app.use('/api', require('./routes/api'));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║                                               ║
    ║   🎵 MeloVibe Server Running                  
    ║                                               ║
    ║   Local:   http://localhost:${PORT}           ║
    ║                                               ║
    ╚═══════════════════════════════════════════════╝
    `);
});

module.exports = app;
