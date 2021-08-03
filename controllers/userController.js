const UserSchema = require("../models/userSchema")
//for uploading profile image
const multer = require('multer');
const path = require("path");

//Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserSchema.find({})
        res.json(users);
    } catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Get user by id
exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserSchema.findById(id)
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not foud!' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Edit existant user
exports.editUser = async (req, res) => {
    try {
        const userData = req.body;
        const id = req.params.uid;
        const user = await UserSchema.findById(id);
        if (!user)
            res.status(404).json({ message: "This user does not exist!" });
        else {
            // update avatar 
            if(req.file)
            {
              const fileName = `${process.env.PUBLIC_URL}/avatars/${req.file.filename}`;
              userData.avatar = fileName;
            }
            //end update avatar 
            const updatedUser = await UserSchema.findByIdAndUpdate(id, userData, { new: true });
            res.json(updatedUser)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Delete user
exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const user = await UserSchema.findById(id);
        if (!user)
            res.status(404).json({ message: "This user does not exist!" });
        else {

            await UserSchema.findByIdAndRemove(id);
            res.json({ message: "User with id " + id + " has been deleted successfuly" })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//cancel ticket
exports.cancelTicket = async (req, res) => {
    try {
        const id = req.params.uid;
        const ticketId = req.params.todoid;
        const ticket = await todoSchema.findById(ticketId);
        const user = await UserSchema.findById(id);

        if (!user)
            res.json({ message: "User does not exist!" })
        else if (!todo)
            res.json({ message: "This ticket does not exist!" })
        else {
            const updatedUser = await UserSchema.findByIdAndUpdate(id, { $pull: { tickets: ticket._id } }, { new: true });
            res.json(updatedUser)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}

//Show all tickets
exports.showUserTickets = async (req, res) => {
    try {
        const id = req.params.uid;
        const user = await UserSchema.findById(id);

        if (!user)
            res.json({ message: "User does not exist!" })
        else {
            const userWithTickets = await UserSchema.findById(id).populate('tickets');
            res.json(userWithTickets.tickets)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message : "Internal server error!"});
    }
}


//image upload with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/avatars');
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
      else
      cb(null, false)
  
      //  cb("Error: File upload only supports the following filetypes: jpeg, png, gif")
  }
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

// update avatar 
exports.updateAvatar = upload.single('avatar');