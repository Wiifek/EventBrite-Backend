const UserSchema = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Register
exports.register = async(req,res, next)=>{
    try {
        const email = req.body.email;
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await UserSchema.findOne({ email });

        if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = encryptedPassword;

        // Create user in our database
        const user = await UserSchema.create(req.body);

        // return new user
        res.status(201).json({
            message: "user added successfully",
            user: user
        })
    } catch (err) {
        console.log(err);
    }
}

//login
exports.login = async(req,res, next)=>{
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate if user exist in our database
        const user = await UserSchema.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
            ///if (user && (password === user.password)) {
            // Create token
            const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
            );

            // user
            res.status(200).json({
                message: "Auth successful",
                token: token});
            }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
    console.log(err);
    }
}
