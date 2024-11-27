const express = require('express');
const verifyToken = require('../middleware/auth');
const { deleteSingleMessageOfGroup, editGroupMessage, fetchAllGroupMessages, createGroupMessage } = require('../controller/groupMessage');
const router = express.Router();

router.post('/:groupId', verifyToken, createGroupMessage)
router.delete('/:messageId', verifyToken, deleteSingleMessageOfGroup)
router.put('/:messageId', verifyToken, editGroupMessage)
router.get('/:groupId', verifyToken, fetchAllGroupMessages)

module.exports = router;
