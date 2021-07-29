const express = require('express')
const router = express.Router()
const ec = require('../controllers/eventController')
const passport = require('passport')

//for uploading event image
const multer = require('multer');
const EventSchema = require('../models/eventSchema')
const path = require("path");

//Get all events
router.get("/", passport.authenticate('bearer', { session: false }), ec.getAllEvents)

//Get event by id
router.get("/:id", passport.authenticate('bearer', { session: false }), ec.getEventById)

//Edit existant event
router.put("/editevent/:id", passport.authenticate('bearer', { session: false }), ec.editEvent)

//Delete event
router.delete("/deleteevent/:id", passport.authenticate('bearer', { session: false }), ec.deleteEvent)

//Add tag to event
router.put("/addtag/:id/:tagid", passport.authenticate('bearer', { session: false }), ec.addTag)

//Remove tag from the event
router.delete("/removetag/:id/:tagid", passport.authenticate('bearer', { session: false }), ec.removeTag)

//Event image upload with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/event_images');
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName)
  }
});

const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname);
  const allowedExtensions = [".jpeg", ".jpg", ".png", ".gif"]
  if (allowedExtensions.includes(fileExtension))
    cb(null, true)
  else cb("Error: File upload only supports the following filetypes: jpeg, png, gif")
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.post('/uploadImage/:id', upload.single('eventImage'), async (req, res) => {
  const fileName = process.env.PUBLIC_URL+"/event_images/"+req.file.filename
  const updatedEvent = await EventSchema.findByIdAndUpdate(req.params.id, { eventImage: fileName }, { new: true })
  res.json(updatedEvent)
})

module.exports = router