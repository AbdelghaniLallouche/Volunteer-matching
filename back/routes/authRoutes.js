const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const upload = require('../config/multer');

router.post('/register', upload.single('profilePhoto'), register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
