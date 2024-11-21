const express = require('express');
const verifyToken = require('../middleware/auth');
const { createGroup } = require('../controller/group');

const router = express.Router();


router.post('/', verifyToken, createGroup)

module.exports = router;
