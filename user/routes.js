const express = require('express');
const router = express.Router();

const UserCtrl = require('./controller/userController');
const auth = require('../config/middleware/auth');
const permit = require('../config/middleware/authorization');



router.post('/signin', UserCtrl.login);
router.post('/signup', UserCtrl.signup);
router.get('/confirm/:id',UserCtrl.confirmAccount);

module.exports = router;