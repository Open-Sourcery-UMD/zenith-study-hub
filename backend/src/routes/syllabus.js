const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Parse syllabus and extract dates
router.post('/parse', auth, upload.single('syllabus'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { course_id } = req.body;
    
    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    // Simple regex patterns to extract dates and assignments
    const datePatterns = [
      /(\w+\s+\d{1,2},?\s+\d{4})/g, // January 15, 2024
      /(\d{1,2}\/\d{1,2}\/\d{4})/g, // 01/15/2024
      /(\d{1,2}-\d{1,2}-\d{4})/g    // 01-15-2024
    ];

    const assignmentPatterns = [
      /assignment\s*\d*:?\s*([^\n]+)/gi,
      /homework\s*\d*:?\s*([^\n]+)/gi,
      /quiz\s*\d*:?\s*([^\n]+)/gi,
      /exam\s*\d*:?\s*([^\n]+)/gi,
      /test\s*\d*:?\s*([^\n]+)/gi,
      /project\s*\d*:?\s*([^\n]+)/gi
    ];

    const extractedEvents = [];
    
    // Extract assignments and their potential dates
    assignmentPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Look for dates near this assignment
          const contextStart = Math.max(0, text.indexOf(match) - 200);
          const contextEnd = Math.min(text.length, text.indexOf(match) + 200);
          const context = text.substring(contextStart, contextEnd);
          
          datePatterns.forEach(datePattern => {
            const dateMatches = context.match(datePattern);
            if (dateMatches) {
              dateMatches.forEach(dateMatch => {
                extractedEvents.push({
                  title: match.trim(),
                  date: dateMatch,
                  type: getEventType(match),
                  raw_text: context
                });
              });
            }
          });
        });
      }
    });

    res.json({
      extracted_text: text,
      extracted_events: extractedEvents,
      suggestions: extractedEvents.map(event => ({
        title: event.title,
        date: event.date,
        type: event.type,
        course_id: course_id || null
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to determine event type
function getEventType(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('exam') || lowerText.includes('test')) return 'exam';
  if (lowerText.includes('assignment') || lowerText.includes('homework')) return 'assignment';
  if (lowerText.includes('reading')) return 'reading';
  return 'custom';
}

// Bulk create events from syllabus
router.post('/create-events', auth, [
  body('events').isArray(),
  body('events.*.title').trim().isLength({ min: 1 }),
  body('events.*.date').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { events } = req.body;
    
    const eventsToInsert = events.map(event => ({
      user_id: req.userId,
      title: event.title,
      description: event.description || 'Imported from syllabus',
      date: event.date,
      time: event.time || null,
      type: event.type || 'custom',
      course_id: event.course_id || null,
      created_at: new Date()
    }));

    const createdEvents = await db('calendar_events')
      .insert(eventsToInsert)
      .returning('*');

    res.status(201).json(createdEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;