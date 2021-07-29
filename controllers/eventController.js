const EventSchema = require("../models/eventSchema")
const TagSchema = require('../models/tagSchema')

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