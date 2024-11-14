const express = require('express');
const verifyToken = require('../middleware/auth');
const { getAllChatMessage } = require('../controller/message');

const router = express.Router();


router.get('/get-all-message/:receiverId', verifyToken, getAllChatMessage)

module.exports = router;
