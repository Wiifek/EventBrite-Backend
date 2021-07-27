const express = require('express')
const router = express.Router()
const ec = require('../controllers/eventController')
const passport = require('passport')

//Get all events
router.get("/", passport.authenticate('bearer', { session: false }, { failureRedirect: '/login' }), ec.getAllEvents)

//Get event by id
router.get("/:id", passport.authenticate('bearer', { failureRedirect: '/login' }), ec.getEventById)

//Edit existant event
router.put("/editevent/:uid",passport.authenticate('bearer', { failureRedirect: '/login' }), ec.editEvent)

//Delete event
router.delete("/deleteevent/:uid",passport.authenticate('bearer', { failureRedirect: '/login' }), ec.deleteEvent)

//Add tag to event
router.put("/addtag/:uid/:tagid",passport.authenticate('bearer', { failureRedirect: '/login' }), ec.addTag)

//Remove tag from the event
router.delete("/removetag/:uid/:tagid",passport.authenticate('bearer', { failureRedirect: '/login' }), ec.removeTag)


module.exports = router