const express = require('express');
const verifyToken = require('../middleware/auth');
const { createGroup, MakeOtherUserAsAdmin, removeUserAsAdmin, addMemberToTheGroup, removeMemberFromTheGroup, fetchAllGroupsJoinedByUser, deleteGroup, editGroupName } = require('../controller/group');

const router = express.Router();


router.post('/', verifyToken, createGroup)
router.put('/make-admin', verifyToken, MakeOtherUserAsAdmin)
router.put('/remove-from-admin', verifyToken, removeUserAsAdmin)
router.put('/add-to-group', verifyToken, addMemberToTheGroup)
router.put('/remove-from-group', verifyToken, removeMemberFromTheGroup)
router.get('/get-all-groups', verifyToken, fetchAllGroupsJoinedByUser)
router.delete('/delete-group', verifyToken, deleteGroup)
router.put('/edit-group-name', verifyToken, editGroupName)
module.exports = router;
