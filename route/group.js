const express = require('express');
const verifyToken = require('../middleware/auth');
const { createGroup, MakeOtherUserAsAdmin, removeUserAsAdmin, addMemberToTheGroup, removeMemberFromTheGroup } = require('../controller/group');

const router = express.Router();


router.post('/', verifyToken, createGroup)
router.put('/make-admin', verifyToken, MakeOtherUserAsAdmin)
router.put('/remove-from-admin', verifyToken, removeUserAsAdmin)
router.put('/add-to-group', verifyToken, addMemberToTheGroup)
router.put('/remove-from-group', verifyToken, removeMemberFromTheGroup)
module.exports = router;
