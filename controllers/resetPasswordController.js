const bcrypt = require('bcrypt');
const Token = require('../models/tokenSchema')
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const UserSchema = require('../models/userSchema')

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

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email
        const newPassword = req.body.newPassword

        const user = await UserSchema.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User does not exist" });
        } else {
            const token = await Token.findOne({ userId: user._id });
            if (token) {
                await token.deleteOne();
            }
            const resetToken = crypto.randomBytes(32).toString("hex");

            await Token.create({
                userId: user._id,
                token: resetToken,
                createdAt: Date.now()
            })

            const link = `${process.env.CLIENT_URL}/#/examples/reset-password/${resetToken}`;

            const render = `Hi ${user.firstName},<br>You requested to reset your password.<br>
            Please click the link beow to reset your password.<br>
            <a href="${link}">Reset password</a>`;

            // send mail with defined transport object
            let info = {
                from: process.env.EMAIL_USERNAME, // sender address
                to: user.email, // list of receivers
                subject: "Reset Password", // Subject line
                // text: "", // plain text body
                html: render
            };
            await transporter.sendMail(info)
            res.json({ message: 'Check your mailbox' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error!" })
    }
};

exports.passwordReset = async (req, res) => {
    try {
        const token = req.params.token
        const passwordResetToken = await Token.findOne({ token: token });
        if (!passwordResetToken) {
            res.status(404).json({ message: "Invalid or expired password reset token" });
        } else {
            const encryptedNewPassword = await bcrypt.hash(req.body.password, 10);
            const user = await UserSchema.findOneAndUpdate(
                { _id: passwordResetToken.userId },
                { $set: { password: encryptedNewPassword } },
                { new: true }
            );
            if (user.email) {
                // send mail with defined transport object
                const info = {
                    from: process.env.EMAIL_USERNAME, // sender address
                    to: user.email, // list of receivers
                    subject: "Password Reset Successfully", // Subject line
                    // text: "", // plain text body
                    html: `Hi ${user.firstName},<br>Your password has been reset successfully`
                };
                await transporter.sendMail(info);
                await passwordResetToken.deleteOne();
                res.json({ message: 'Check your mailbox' })
            }
            else {
                res.status(400).json({ message: "No user email found!" });
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error!" })
    }
};
