const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Start focus session
router.post('/start', auth, [
  body('duration_minutes').isInt({ min: 1, max: 480 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { duration_minutes, course_id, task_id } = req.body;
    
    const [session] = await db('focus_sessions').insert({
      user_id: req.userId,
      course_id,
      task_id,
      duration_minutes,
      start_time: new Date(),
      created_at: new Date()
    }).returning('*');

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End focus session
router.post('/:id/end', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const [session] = await db('focus_sessions')
      .where({ id, user_id: req.userId })
      .update({
        end_time: new Date(),
        completed: true,
        notes
      })
      .returning('*');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get focus sessions
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await db('focus_sessions')
      .leftJoin('courses', 'focus_sessions.course_id', 'courses.id')
      .where('focus_sessions.user_id', req.userId)
      .select('focus_sessions.*', 'courses.name as course_name')
      .orderBy('focus_sessions.start_time', 'desc')
      .limit(50);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;