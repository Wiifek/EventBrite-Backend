const EventSchema = require("../models/eventSchema")
const TagSchema = require('../models/tagSchema')

//for uploading event image
const multer = require('multer');
const path = require("path");

//Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await EventSchema.find({})
        res.json(events);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Add event
exports.addEvent = async(req,res)=>{
    try {
        const eventData = req.body;
        if(req.file){
            const fileName = process.env.PUBLIC_URL+"/event_images/"+req.file.filename
            eventData.eventImage= fileName
        }
        const createdEvent = await EventSchema.create(eventData);
        res.json(createdEvent);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Get event by id
exports.getEventById = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await EventSchema.findById(id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not foud!' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Edit existant event
exports.editEvent = async (req, res) => {
    try {
        const eventData = req.body;
        const id = req.params.id;
        const event = await EventSchema.findById(id);
        if (!event)
            res.status(404).json({ message: "This event does not exist!" });
        else {
            if(req.file){
                const fileName = process.env.PUBLIC_URL+"/event_images/"+req.file.filename
                eventData.eventImage= fileName
            }
            const updatedEvent = await EventSchema.findByIdAndUpdate(id, eventData, { new: true });
            res.json(updatedEvent)
            
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await EventSchema.findById(id);
        if (!event)
            res.status(404).json({ message: "This event does not exist!" });
        else {
            await EventSchema.findByIdAndRemove(id);
            res.json({ message: "Event with id " + id + " has been deleted successfuly" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Add tag to event
exports.addTag = async (req, res) => {
    try {
        const id = req.params.id;
        const tagid = req.params.tagid;
        const tag = await TagSchema.findById(tagid);
        const event = await EventSchema.findById(id);
        if (!event)
            res.status(404).json({ message: "Event does not exist!" })
        else if (!tag)
            res.json({ message: "This tag does not exist!" })
        else {
            const updatedEvent = await EventSchema.findByIdAndUpdate(id, { $push: { tags: tag._id } }, { new: true });
            // {new: true} return updated object
            res.json(updatedEvent)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}


//Remove element from tags array
exports.removeTag = async (req, res) => {
    try {
        const id = req.params.uid;
        const tagid = req.params.tagid;
        const tag = await todoSchema.findById(tagid);
        const event = await EventSchema.findById(id);
        if (!event)
            res.status(404).json({ message: "Event does not exist!" })
        else if (!todo)
            res.json({ message: "This tag does not exist!" })
        else {
            const updatedEvent = await EventSchema.findByIdAndUpdate(id, { $pull: { tags: tag._id } }, { new: true });
            res.json(updatedEvent)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

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
      cb(null, true);
    else 
    cb(null , false);
    // cb("Error: File upload only supports the following filetypes: jpeg, png, gif")
  }
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

  // update event image 
exports.updateimageEvent = upload.single('eventImage');