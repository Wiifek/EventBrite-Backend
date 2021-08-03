const UserSchema = require('../models/userSchema');
const Token = require('../models/tokenSchema');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt")
const randomString = require('randomstring')


exports.forgetPassword = async (req, res) => {
    const email = req.body.email
    const user = await UserSchema.findOne({ email });

    if (!user) {
        res.status(400).json({ message: "User does not exist" });
    }
    else {
        const token = await Token.findOne({ userId: user._id });
        if (token) {
            await token.deleteOne()
        };

        const newPassword = randomString.generate(10)

        //send email
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        // send mail with defined transport object
        let info = {
            from: process.env.EMAIL_USERNAME, // sender address
            to: user.email, // list of receivers
            subject: "Forgot Password", // Subject line
            // text: "", // plain text body
            html: `<b>Hi ${user.firstName}</b>,<br>Here are your login details to the membership portal:<br>
        <ul>
        <li><b>Email:</b> ${user.email}</li>
        <li><b>Password:</b> ${newPassword}</li></ul>`
        };
        transporter.sendMail(info, (err) => {
            if (err) {
                res.json(err)
                console.log(err)
            }
        });
        const hash = await bcrypt.hash(newPassword, 10);
        await UserSchema.updateOne(
            { _id: user._id },
            { $set: { password: hash } },
            { new: true }
        );
        res.json({ message: 'Check your mailbox' })
    }
}
