const express = require('express')
const router = express.Router()
const rc = require('../controllers/reservationController')
const passport = require('passport')

//Create reservation
router.get("/:event_id", passport.authenticate('bearer', { session: false }), rc.addTicket)

module.exports = router