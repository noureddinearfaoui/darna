const express = require('express');
const router = express.Router();


const roleCtr = require('./controller/roleController')


router.get('/role',roleCtr.test)


module.exports = router