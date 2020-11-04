const express = require('express');
const router = express.Router();

const UserCtrl = require('./controller/userController');
const auth = require('../config/middleware/auth');
const permit = require('../config/middleware/authorization');



router.get('/signin', UserCtrl.login);
router.get('/signup', UserCtrl.signup);
router.get('/test',permit('admin'),UserCtrl.userRoles);
router.get('/test2',UserCtrl.userRoles);

module.exports = router;