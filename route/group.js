const express = require('express');
const verifyToken = require('../middleware/auth');
const { createGroup, MakeOtherUserAsAdmin, removeUserAsAdmin, addMemberToTheGroup, removeMemberFromTheGroup, fetchAllGroupsJoinedByUser, deleteGroup, editGroupName, exitFromTheGroup } = require('../controller/group');

const router = express.Router();


router.post('/', verifyToken, createGroup)
router.put('/make-admin/:groupId', verifyToken, MakeOtherUserAsAdmin)
router.put('/remove-from-admin/:groupId', verifyToken, removeUserAsAdmin)
router.put('/add-to-group/:groupId', verifyToken, addMemberToTheGroup)
router.put('/remove-from-group/:groupId', verifyToken, removeMemberFromTheGroup)
router.put('/exit-from-group/:groupId', verifyToken, exitFromTheGroup)
router.get('/get-all-groups', verifyToken, fetchAllGroupsJoinedByUser)
router.delete('/delete-group', verifyToken, deleteGroup)
router.put('/edit-group-name/:groupId', verifyToken, editGroupName)
module.exports = router;
