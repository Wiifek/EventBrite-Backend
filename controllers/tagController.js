const TagSchema = require("../models/tagSchema")

//Get all tags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await TagSchema.find({})
        res.json(tags);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Add tag
exports.addTag = async(req,res)=>{
    try {
        const tagData = req.body;
        const createdTag = await TagSchema.create(tagData);
        res.json(createdTag);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Get tag by id
exports.getTagById = async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await TagSchema.findById(id)
        if (tag)
            res.json(tag);
        else 
            res.status(404).json({ message: 'Tag not foud!' })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Edit existant tag
exports.editTag = async (req, res) => {
    try {
        const tagData = req.body;
        const id = req.params.id;
        const tag = await TagSchema.findById(id);
        if (!tag)
            res.json({ message: "This tag does not exist!" });
        else {
            const updatedTag = await TagSchema.findByIdAndUpdate(id, tagData, { new: true });
            res.json(updatedTag)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Delete tag
exports.deleteTag = async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await TagSchema.findById(id);
        if (!tag)
            res.json({ message: "This tag does not exist!" });
        else {
            await TagSchema.findByIdAndRemove(id);
            res.json({ message: "Tag with id " + id + " has been deleted successfully" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}