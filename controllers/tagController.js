const TagSchema = require("../models/tagSchema")

//Get all tags
exports.getAllTags= async (req,res,next)=>{
    const tags = await TagSchema.find({})
    res.json(tags);
}

//Get tag by id
exports.getTagById = async (req,res,next)=>{
    const id = req.params.id;
    await TagSchema.findById(id,(err, tag)=> {
        if (err) return res.json("Tag not found!");
        res.json(event);
    })
}

//Edit existant tag
exports.editTag= async (req,res,next)=>{
    const tag = req.body;
    const id = req.params.uid;
    const e = await TagSchema.findById(id);
    if(!e)
        res.json({message:"This tag does not exist!"});
    else{
        try{
            await TagSchema.findByIdAndUpdate(id, tag);
            res.json({message:"Tag with id "+id+"  has been updated successfuly"})
        }
        catch(err){
            console.err(err)
        }
    }
}

//Delete tag
exports.deleteTag = async(req,res,next)=>{
    const id = req.params.uid;
    const tag = await TagSchema.findById(id);
    if(!tag)
        res.json({message:"This tag does not exist!"});
    else{
        try{
            await TagSchema.findByIdAndRemove(id);
            res.json({message:"Tag with id "+id+" has been deleted successfuly"})
        }
        catch(err){
            console.err(err)
        }
    }
}