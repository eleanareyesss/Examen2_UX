const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});


module.exports = router;