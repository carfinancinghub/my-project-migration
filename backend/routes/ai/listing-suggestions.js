// File: listing-suggestions.js
// Path: backend/routes/ai/listing-suggestions.js
// 👑 Cod1 Crown Certified — AI Suggestion Endpoint for Smart Car Listing Enhancements

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware');

// 🔌 AI logic to generate smarter listing content
const generateSuggestions = async ({ make, model, year, price, mileage, tags, description }) => {
  const baseTitle = `${year} ${make} ${model}`;
  const aiDescription = `This ${year} ${make} ${model} with ${mileage?.toLocaleString()} miles is in excellent condition. Priced at $${price}, it offers great value for a reliable ride. ${description || ''}`;
  const aiTags = [make.toLowerCase(), model.toLowerCase(), 'used', 'clean', 'certified'];

  return {
    title: baseTitle,
    description: aiDescription.trim(),
    tags: Array.from(new Set(aiTags.concat(tags || []))),
  };
};

// 📬 POST /api/ai/listing-suggestions (full endpoint after mounting)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const result = await generateSuggestions(req.body);
    res.json(result);
  } catch (err) {
    console.error('AI generation failed:', err);
    res.status(500).json({ message: 'AI suggestion failed' });
  }
});

module.exports = router;
