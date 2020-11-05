const express = require('express');
const router = express.Router();
const permit = require('../config/middleware/authorization');


const roleCtr = require('./controller/roleController')


router.get('/role',permit('membre'),roleCtr.add)


module.exports = router