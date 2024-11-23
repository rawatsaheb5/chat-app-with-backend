const express = require('express');
const verifyToken = require('../middleware/auth');
const { deleteSingleMessageOfGroup, editGroupMessage } = require('../controller/groupMessage');
const router = express.Router();


router.delete('/:messageId', verifyToken, deleteSingleMessageOfGroup)
router.put('/:messageId', verifyToken, editGroupMessage)

module.exports = router;