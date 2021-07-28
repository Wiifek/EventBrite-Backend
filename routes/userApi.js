const express = require('express')
const router = express.Router()
const uc = require('../controllers/userController')
const passport = require('passport')

//for uploading profile image
const multer = require ('multer');
const UserSchema = require('../models/userSchema')
var dateFormat = require("dateformat");

//Get all users
router.get("/", passport.authenticate('bearer', { session: false }), uc.getAllUsers)

//Get user by id
router.get("/:id", passport.authenticate('bearer',{ session: false }), uc.getUserById)

//Edit existant user
router.put("/edituser/:uid",passport.authenticate('bearer',{ session: false }), uc.editUser)

//Delete user
router.delete("/deleteuser/:uid",passport.authenticate('bearer',{ session: false }), uc.deleteUser)

//show all tickets
router.get("/showtickets/:uid",passport.authenticate('bearer', { session: false },), uc.showUserTickets)

//cancel ticket
router.delete("/cancelticket/:uid/:ticketid",passport.authenticate('bearer',{ session: false }), uc.cancelTicket)

//image upload with multer
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

router.post('/uploadImage/:id',upload.single('avatar'), async (req,res,next)=>{
    const updatedUser = await UserSchema.findByIdAndUpdate(req.params.id,{avatar: req.file.path},{new:true})
    res.json(updatedUser)
})

module.exports = router