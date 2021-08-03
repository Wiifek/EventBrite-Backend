const express = require('express')
const router = express.Router()
const uc = require('../controllers/userController')
const passport = require('passport')


//Get all users
router.get("/", passport.authenticate('bearer', { session: false }), uc.getAllUsers)

//Get user by id
router.get("/:id", passport.authenticate('bearer', { session: false }), uc.getUserById)

//Edit existant user
router.put("/edituser/:uid", [passport.authenticate('bearer', { session: false }), uc.updateAvatar], uc.editUser)

//Delete user
router.delete("/deleteuser/:uid", passport.authenticate('bearer', { session: false }), uc.deleteUser)

//show all tickets
router.get("/showtickets/:uid", passport.authenticate('bearer', { session: false },), uc.showUserTickets)

//cancel ticket
router.delete("/cancelticket/:uid/:ticketid", passport.authenticate('bearer', { session: false }), uc.cancelTicket)

module.exports = router