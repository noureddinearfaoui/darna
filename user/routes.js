const express = require('express');
const router = express.Router();

const UserCtrl = require('./controller/userController');

router.get('/signin', UserCtrl.login);
router.get('/signup', UserCtrl.signup);


module.exports = router;