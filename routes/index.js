const express = require('express');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// --- PAGE ROUTES ---

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/what-is-pamm', (req, res) => {
  res.render('what-is-pamm', { title: 'What is PAMM?' });
});

router.get('/benefits', (req, res) => {
  res.render('benefits', { title: 'Benefits' });
});

router.get('/how-it-works', (req, res) => {
  res.render('how-it-works', { title: 'How It Works' });
});

router.get('/faq', (req, res) => {
  const faqPath = path.join(__dirname, '..', 'data', 'faq.json');
  fs.readFile(faqPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Could not read FAQ file:", err);
      return res.render('faq', { title: 'FAQ', faqs: [] });
    }
    try {
      const faqs = JSON.parse(data);
      res.render('faq', { title: 'FAQ', faqs: faqs });
    } catch (parseErr) {
      console.error("Could not parse FAQ JSON:", parseErr);
      res.render('faq', { title: 'FAQ', faqs: [] });
    }
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

// --- API ROUTES ---

router.get('/api/news', async (req, res) => {
  try {
    const query = 'fintech';
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`;
    const newsResponse = await fetch(url);
    if (!newsResponse.ok) throw new Error(`News API responded with status ${newsResponse.status}`);
    const newsData = await newsResponse.json();
    res.json(newsData.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

router.get('/api/testimonials', async (req, res) => {
  try {
    const url = 'https://jsonplaceholder.typicode.com/posts?_limit=3';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`JSONPlaceholder API responded with status ${response.status}`);
    const testimonialsData = await response.json();
    res.json(testimonialsData);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

module.exports = router;