const UserSchema = require("../models/userSchema")

//Get all users
exports.getAllUsers= async (req,res,next)=>{
    const users = await UserSchema.find({})
    res.json(users);
}

//Get user by id
exports.getUserById = async (req,res,next)=>{
    const id = req.params.id;
    await UserSchema.findById(id,(err, user)=> {
        if (err) return res.json("User not found!");
        res.json(user);
    })
}

//Edit existant user
exports.editUser= async (req,res,next)=>{
    const user = req.body;
    const id = req.params.uid;
    const u = await UserSchema.findById(id);
    if(!u)
        res.json({message:"This user does not exist!"});
    else{
        try{
            await UserSchema.findByIdAndUpdate(id, user);
            res.json({message:"User with id "+id+"  has been updated successfuly"})
        }
        catch(err){
            console.err(err)
        }
    }
}

//Delete user
exports.deleteUser = async(req,res,next)=>{
    const id = req.params.uid;
    const user = await UserSchema.findById(id);
    if(!user)
        res.json({message:"This user does not exist!"});
    else{
        try{
            await UserSchema.findByIdAndRemove(id);
            res.json({message:"User with id "+id+" has been deleted successfuly"})
        }
        catch(err){
            console.err(err)
        }
    }
}

//cancel ticket
exports.cancelTicket = async(req,res)=>{
    const id = req.params.uid;
    const ticketId = req.params.todoid;
    const ticket = await todoSchema.findById(ticketId);
    const u = await UserSchema.findById(id);
    try{
        if(!u)
        res.json({message:"User does not exist!"})
        else if(!todo)
            res.json({message:"This ticket does not exist!"})
        else{
            const user =await UserSchema.findByIdAndUpdate(id, {$pull : {tickets: ticket._id}});
            const updatedUser = await UserSchema.findById(user._id)
            res.json(updatedUser)
        }
    }
    catch(err){
        console.error(err)
    }
}

//Show all tickets
exports.showUserTickets = async(req,res,next)=>{
    const id = req.params.uid;
    const user = await UserSchema.findById(id);
    try{
        if(!user)
            res.json({message:"User does not exist!"})
        else{
            const list =await UserSchema.findById(id).populate('tickets');
            res.json(list)
        }
    }
    catch(err){
        console.error(err)
    }
}