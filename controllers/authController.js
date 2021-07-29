const UserSchema = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Register
exports.register = async (req, res) => {
    try {
        const email = req.body.email;
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await UserSchema.findOne({ email });

        if (oldUser) {
            return res.status(400).json({message:"E-mail address already exist. Please choose another e-mail."});
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = encryptedPassword;

        // Create user in our database
        const user = await UserSchema.create(req.body);

        // return new user
        res.status(201).json({
            message: "User registred successfully.",
            user: user
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({message : "Internal server error!"});
    }
}

//login
exports.login = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate if user exist in our database
        const user = await UserSchema.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            ///if (user && (password === user.password)) {
            // Create JWT token
            const tokenData = {
                user_id: user._id,
                email: user.email,
                role: user.role
            };
            const token = jwt.sign(
                tokenData,
                process.env.TOKEN_KEY,
                {
                    expiresIn: process.env.TOKEN_EXPIRE_IN,
                }
            );

            // return response
            res.status(200).json({
                message: "Authentificatin successfully.",
                token: token
            });
        } else {
            res.status(400).json({message : "Invalid credentials."});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message : "Internal server error!"});
    }
}
