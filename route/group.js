const express = require('express');
const verifyToken = require('../middleware/auth');
const { createGroup, MakeOtherUserAsAdmin, removeUserAsAdmin } = require('../controller/group');

const router = express.Router();


router.post('/', verifyToken, createGroup)
router.put('/make-admin', verifyToken, MakeOtherUserAsAdmin)
router.put('/remove-from-admin', verifyToken, removeUserAsAdmin)
module.exports = router;
