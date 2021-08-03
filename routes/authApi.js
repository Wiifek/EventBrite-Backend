const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')

//Register
router.post("/register", auth.register)

//login
router.post("/login", auth.login)

module.exports = router