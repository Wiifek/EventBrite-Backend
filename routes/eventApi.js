const express = require('express')
const router = express.Router()
const ec = require('../controllers/eventController')
const passport = require('passport')

//for uploading event image
const multer = require ('multer');
const EventSchema = require('../models/eventSchema')
var dateFormat = require("dateformat");

//Get all events
router.get("/", passport.authenticate('bearer', { session: false }), ec.getAllEvents)

//Get event by id
router.get("/:id", passport.authenticate('bearer', { session: false }), ec.getEventById)

//Edit existant event
router.put("/editevent/:id",passport.authenticate('bearer', { session: false }), ec.editEvent)

//Delete event
router.delete("/deleteevent/:id",passport.authenticate('bearer', { session: false }), ec.deleteEvent)

//Add tag to event
router.put("/addtag/:id/:tagid",passport.authenticate('bearer', { session: false }), ec.addTag)

//Remove tag from the event
router.delete("/removetag/:id/:tagid",passport.authenticate('bearer', { session: false }), ec.removeTag)

//Event image upload with multer
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
      cb(null, './uploads/');
    },
    filename: (req, file, cb)=> {
      cb(null, dateFormat(new Date(), 'm-d-yy') + "--" + file.originalname)
    }
  });
  
  const fileFilter=(req, file, cb)=>{
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')
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
  
  router.post('/uploadImage/:id',upload.single('eventImage'), async (req,res,next)=>{
      const updatedEvent = await EventSchema.findByIdAndUpdate(req.params.id,{eventImage: req.file.path},{new:true})
      res.json(updatedEvent)
  })

module.exports = router