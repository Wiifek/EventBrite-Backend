const express = require('express')
const router = express.Router()
const fpc = require('../controllers/forgotPasswordController')

//Forgot password 
router.post("/", fpc.forgetPassword)

module.exports = router