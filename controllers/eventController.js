const EventSchema = require("../models/eventSchema")
const TagSchema = require('../models/tagSchema')

//Get all events
exports.getAllEvents= async (req,res,next)=>{
    const events = await EventSchema.find({})
    res.json(events);
}

//Get event by id
exports.getEventById = async (req,res,next)=>{
    const id = req.params.id;
    await EventSchema.findById(id,(err, event)=> {
        if (err) return res.json("Event not found!");
        res.json(event);
    })
}

//Edit existant event
exports.editEvent= async (req,res,next)=>{
    const event = req.body;
    const id = req.params.uid;
    const e = await EventSchema.findById(id);
    if(!e)
        res.json({message:"This event does not exist!"});
    else{
        try{
            await EventSchema.findByIdAndUpdate(id, event);
            res.json({message:"Event with id "+id+"  has been updated successfuly"})
        }
        catch(err){
            console.err(err)
        }
    }
}

//Delete event
exports.deleteEvent = async(req,res,next)=>{
    const id = req.params.uid;
    const event = await EventSchema.findById(id);
    if(!event)
        res.json({message:"This event does not exist!"});
    else{
        try{
            await EventSchema.findByIdAndRemove(id);
            res.json({message:"Event with id "+id+" has been deleted successfuly"})
        }
        catch(err){
            console.err(err)
        }
    }
}

//Add tag to event
exports.addTag = async(req,res,next)=>{
    const id = req.params.uid;
    const tagid = req.params.tagid;
    const tag = await TagSchema.findById(tagid);
    const e = await EventSchema.findById(id);
    try{
        if(!e)
        res.json({message:"Event does not exist!"})
        else if(!tag)
            res.json({message:"This tag does not exist!"})
        else{
            const event =await EventSchema.findByIdAndUpdate(id, {$push : {tags: tag._id}});
            const updatedEvent = await EventSchema.findById(event._id)
            res.json(updatedUser)
        }
    }
    catch(err){
        console.error(err)
    }
}


//Remove element from tags array
exports.removeTag = async(req,res)=>{
    const id = req.params.uid;
    const tagid = req.params.tagid;
    const tag = await todoSchema.findById(tagid);
    const e = await EventSchema.findById(id);
    try{
        if(!e)
        res.json({message:"Event does not exist!"})
        else if(!todo)
            res.json({message:"This tag does not exist!"})
        else{
            const event =await EventSchema.findByIdAndUpdate(id, {$pull : {tags: tag._id}});
            const updatedEvent = await EventSchema.findById(event._id)
            res.json(updatedEvent)
        }
    }
    catch(err){
        console.error(err)
    }
}