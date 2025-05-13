const router = require('express').Router();
const aiController = require('../controllers/ai.controller');

router.post('/imageGen', aiController.imageGen);

module.exports = router