const bcrypt = require('bcrypt');
const Token = require('../models/tokenSchema')
const crypto = require("crypto")
const fs = require('fs');
const ejs = require('ejs');
const UserSchema = require('../models/userSchema')
const sendMail = require('../utils/sendMail')


exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email
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

            const link = `${process.env.CLIENT_URL}/#/reset-password/${resetToken}`;
            const html = fs.readFileSync("views/resetPasswordTemplate.html", "utf8");

            const render = ejs.render(html, {fullName: `${user.firstName} ${user.lastName}`, link})

            // send mail with defined transport object
            let info = {
                from: process.env.EMAIL_USERNAME, // sender address
                to: user.email, // list of receivers
                subject: "Reset Password", // Subject line
                // text: "", // plain text body
                html: render
            };
            await sendMail.sendMail(info)
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
            const html = fs.readFileSync("views/resetSuccessfulTemplate.html", "utf8");

            const render = ejs.render(html, {fullName: `${user.firstName} ${user.lastName}`})
            if (user.email) {
                // send mail with defined transport object
                const info = {
                    from: process.env.EMAIL_USERNAME, // sender address
                    to: user.email, // list of receivers
                    subject: "Password Reset Successfully", // Subject line
                    // text: "", // plain text body
                    html: render
                };
                await sendMail.sendMail(info);
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
