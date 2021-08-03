const express = require('express')
const router = express.Router()
const rpc = require('../controllers/resetPasswordController')
const passport = require('passport')

//Request password reset
router.post("/", passport.authenticate('bearer', { session: false }), rpc.requestPasswordReset)
//Password reset
router.get("/:token/:id", rpc.passwordReset)

module.exports = router