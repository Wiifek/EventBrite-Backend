const express = require('express')
const router = express.Router()
const tc = require('../controllers/ticketController')
const passport = require('passport')

//Get all tickets
router.get("/", passport.authenticate('bearer', { session: false }), tc.listTickets)

//Delete ticket
router.delete("/deleteticket/:id",passport.authenticate('bearer', { session: false }), tc.deleteTicket)

module.exports = router