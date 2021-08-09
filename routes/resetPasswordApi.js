const express = require('express')
const router = express.Router()
const rpc = require('../controllers/resetPasswordController')

//Request password reset
router.post("/forgot-password", rpc.forgotPassword)
//Password reset
router.post("/reset-password/:token", rpc.passwordReset)

module.exports = router