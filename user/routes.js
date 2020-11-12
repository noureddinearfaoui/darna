const express = require('express');
const router = express.Router();

const UserCtrl = require('./controller/userController');
const auth = require('../config/middleware/auth');
const permit = require('../config/middleware/authorization');



router.post('/signin', UserCtrl.login);
router.post('/signup', UserCtrl.signup);
router.get('/test', auth,permit('membre'),UserCtrl.test);
router.get('/confirm/:id',UserCtrl.confirmAccount);
router.post('/addMember',UserCtrl.addMember);
router.get('/acceptedMembers',UserCtrl.getAcceptedMembers);
router.get("/Demandes", UserCtrl.getDemandes);

module.exports = router;