const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await db('projects')
      .leftJoin('courses', 'projects.course_id', 'courses.id')
      .where('projects.user_id', req.userId)
      .select('projects.*', 'courses.name as course_name')
      .orderBy('projects.created_at', 'desc');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }),
  body('status').optional().isIn(['active', 'completed', 'archived'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, course_id, due_date, status } = req.body;
    
    const [project] = await db('projects').insert({
      user_id: req.userId,
      name,
      description,
      course_id,
      due_date,
      status: status || 'active',
      created_at: new Date()
    }).returning('*');

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;