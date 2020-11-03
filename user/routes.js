const express = require('express');
const router = express.Router();

const UserCtrl = require('./controller/userController');
const auth = require('../config/middleware/auth');



router.get('/signin', UserCtrl.login);
router.get('/signup', UserCtrl.signup);
router.get('/test',auth ,UserCtrl.test);


module.exports = router;