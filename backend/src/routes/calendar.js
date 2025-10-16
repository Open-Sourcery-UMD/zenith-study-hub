const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get calendar events
router.get('/', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = db('calendar_events').where({ user_id: req.userId });
    
    if (start && end) {
      query = query.whereBetween('date', [start, end]);
    }
    
    const events = await query.orderBy('date', 'asc');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create calendar event
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }),
  body('date').isISO8601(),
  body('type').isIn(['assignment', 'exam', 'reading', 'custom'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, time, type, course_id } = req.body;
    
    const [event] = await db('calendar_events').insert({
      user_id: req.userId,
      title,
      description,
      date,
      time,
      type,
      course_id,
      created_at: new Date()
    }).returning('*');

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update calendar event
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [event] = await db('calendar_events')
      .where({ id, user_id: req.userId })
      .update({ ...updates, updated_at: new Date() })
      .returning('*');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete calendar event
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db('calendar_events')
      .where({ id, user_id: req.userId })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;