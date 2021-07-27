const express = require('express')
const router = express.Router()
const uc = require('../controllers/userController')
const passport = require('passport')

//Get all users
router.get("/", passport.authenticate('bearer', { session: false }, { failureRedirect: '/login' }), uc.getAllUsers)

//Get user by id
router.get("/:id", passport.authenticate('bearer', { failureRedirect: '/login' }), uc.getUserById)

//Edit existant user
router.put("/edituser/:uid",passport.authenticate('bearer', { failureRedirect: '/login' }), uc.editUser)

//Delete user
router.delete("/deleteuser/:uid",passport.authenticate('bearer', { failureRedirect: '/login' }), uc.deleteUser)

//show all tickets
router.get("/showtickets/:uid",passport.authenticate('bearer', { session: false }, { failureRedirect: '/login' }), uc.showUserTickets)

//cancel ticket
router.delete("/cancelticket/:uid/:ticketid",passport.authenticate('bearer', { failureRedirect: '/login' }), uc.cancelTicket)

module.exports = router