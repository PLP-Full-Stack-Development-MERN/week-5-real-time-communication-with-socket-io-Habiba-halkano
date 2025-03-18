const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

// Get note by room ID
router.get('/:roomId', async (req, res) => {
    try {
        const note = await Note.findOne({ roomId: req.params.roomId });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save or update note
router.post('/', async (req, res) => {
    const { roomId, content } = req.body;
    try {
        let note = await Note.findOne({ roomId });
        if (note) {
            note.content = content;
            await note.save();
        } else {
            note = await Note.create({ roomId, content });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
