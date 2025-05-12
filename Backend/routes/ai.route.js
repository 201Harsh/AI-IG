const router = require('express').Router();
const aiController = require('../controllers/ai.controller');
const authenticate = require('../middleware/user.middleware');

router.post('/imageGen', authenticate, aiController.imageGen);

module.exports = router