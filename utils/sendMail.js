
const nodemailer = require("nodemailer")


exports.sendMail = async (info) => {
    try {
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
        await transporter.sendMail(info)
    }
    catch (err) { 
        console.log(err) 
    }
}