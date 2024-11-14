const express = require('express');
const {signup, signin, addUserToChat, getUserChats } = require('../controller/user');
const verifyToken = require('../middleware/auth');
const router = express.Router();


// Register
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/add-to-chat', verifyToken, addUserToChat)
router.get('/get-all-chat', verifyToken,getUserChats )

module.exports = router;
