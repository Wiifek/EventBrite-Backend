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

exports.requestPasswordReset = async (req, res) => {
    const email = req.body.email
    const newPassword = req.body.newPassword

    const user = await UserSchema.findOne({ email });

    if (!user) throw new Error("User does not exist");
    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);
    const encryptedNewPassword = await bcrypt.hash(newPassword, 10);

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
        newPassword: encryptedNewPassword
    }).save();

    const link = `${process.env.CLIENT_URL}/resetPassword/${resetToken}/${user._id}`;
    console.log(link)

    // send mail with defined transport object
    let info = {
        from: process.env.EMAIL_USERNAME, // sender address
        to: user.email, // list of receivers
        subject: "Reset Password", // Subject line
        // text: "", // plain text body
        html: `Hi ${user.firstName},<br>You requested to reset your password.<br>` +
            +"Please click the link beow to reset your password.<br>" +
            +`<a href=${link}>Reset password</a>`
    };
    transporter.sendMail(info, (err) => {
        if (err) {
            res.json(err)
            console.log(err)
        }
    })
    res.json({ message: 'Check your mailbox' })
};

exports.passwordReset = async (req, res) => {
    const userId = req.params.id
    const token = req.params.token
    let passwordResetToken = await Token.findOne({ userId });
    console.log(passwordResetToken)
    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }
    const user = await UserSchema.updateOne(
        { _id: userId },
        { $set: { password: passwordResetToken.newPassword } },
        { new: true }
    );
    // send mail with defined transport object
    let info = {
        from: process.env.EMAIL_USERNAME, // sender address
        to: user.email, // list of receivers
        subject: "Password Reset Successfully", // Subject line
        // text: "", // plain text body
        html: `Hi ${user.firstName},<br>Your password has been reset successfully`
    };
    transporter.sendMail(info, (err) => {
        if (err) {
            res.json(err)
            console.log(err)
        }
    });
    await passwordResetToken.deleteOne();
    res.json({ message: 'Check your mailbox' })
};
