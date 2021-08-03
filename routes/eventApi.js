const express = require('express')
const router = express.Router()
const ec = require('../controllers/eventController')
const passport = require('passport')

//Get all events
router.get("/", passport.authenticate('bearer', { session: false }), ec.getAllEvents)

//Add event
router.post("/addevent",[passport.authenticate('bearer', { session: false }), ec.updateimageEvent], ec.addEvent)

//Get event by id
router.get("/:id", passport.authenticate('bearer', { session: false }), ec.getEventById)

//Edit existant event
router.put("/editevent/:id", [passport.authenticate('bearer', { session: false }), ec.updateimageEvent], ec.editEvent)

//Delete event
router.delete("/deleteevent/:id", passport.authenticate('bearer', { session: false }), ec.deleteEvent)

//Add tag to event
router.put("/addtag/:id/:tagid", passport.authenticate('bearer', { session: false }), ec.addTag)

//Remove tag from the event
router.delete("/removetag/:id/:tagid", passport.authenticate('bearer', { session: false }), ec.removeTag)

module.exports = router