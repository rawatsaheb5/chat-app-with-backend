const express = require('express');
const verifyToken = require('../middleware/auth');
const { deleteSingleMessageOfGroup } = require('../controller/groupMessage');
const router = express.Router();


router.delete('/:messageId', verifyToken, deleteSingleMessageOfGroup)

module.exports = router;
