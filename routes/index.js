// routes/index.js
const express = require('express');
const router = express.Router();
const images = require('../data/tech');

// Get the JSON data
router.get('/index', (req, res) => {
    const baseURL = 'http://localhost:4001';
    const imagesWithLinks = images.map(image => {
        return {
            ...image,
            links: [
                { rel: 'self', href: `${baseURL}/api/index/${image.id}` },
            ],
        };
    });

    res.json({ images: imagesWithLinks });
});

// Display index view
router.get('/', (req, res) => {
    res.render('index', { title: 'Image', images });
});

module.exports = router;