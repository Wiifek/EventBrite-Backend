const TicketSchema = require('../models/ticketSchema')
const UserSchema = require('../models/userSchema')
const EventSchema = require('../models/eventSchema')
const qr = require('qrcode')
const path = require('path')
const pdf = require('pdf-creator-node');
const fs = require('fs');
const ejs = require('ejs');
const nodemailer = require("nodemailer");

exports.addTicket = async (req, res) => {
    try {
        const eventId = req.params.event_id;
        const event = await EventSchema.findById(eventId);
        if (event && event.availableTicketNumber > 0) {
            // you can create a qr code image & ticket PDF file & save ticket 
            // 1. create qr code 
            // 2. create pdf file 
            // 3. create new ticket in the database 

            let ticketData = {
                owner: req.user._id,
                event: eventId,
                QRCode: "",
                QRCodePath: "",
                ticketPath: ""
            }
            // create ticket
            const ticket = await TicketSchema.create(ticketData);

            //create qr code 
            const startDateTime = new Date(event.startDateTime);
            const startDate = `${startDateTime.getDate()}/${startDateTime.getMonth()}/${startDateTime.getFullYear()}`
            const startTime = `${startDateTime.getHours()} : ${startDateTime.getMinutes()}`
            const endDateTime = new Date(event.endDateTime);
            const endDate = `${endDateTime.getDate()}/${endDateTime.getMonth()}/${endDateTime.getFullYear()}`
            const endTime = `${endDateTime.getHours()} : ${endDateTime.getMinutes()}`

            const reservationData = {
                ref: `${ticket._id}`,
                fullName: `${req.user.firstName} ${req.user.lastName}`,
                email: `${req.user.email}`,
                eventName: `${event.name}`,
                address: `${event.location}`,
                startDate: `${startDate}`,
                endDate: `${endDate}`,
                startTime: `${startTime}`,
                endTime: `${endTime}`
            }
            await qr.toFile(path.resolve(`./public/qr_codes/${ticket._id}.png`), JSON.stringify(reservationData))

            const QRCodePath = `${process.env.PUBLIC_URL}/qr_codes/${ticket._id}.png`
            ticketData.QRCode = JSON.stringify(reservationData);
            ticketData.QRCodePath = QRCodePath;

            // 4. send ticket pdf into mail (as an  attachements)
            // 4.1. Create PDF file 
            const html = fs.readFileSync("views/reservationTemplate.html", "utf8");
            const eventBriteLogo = `${process.env.PUBLIC_URL}/eventBrite.png`
            const pdfParams = { reservation: reservationData, QRCodePath, eventBriteLogo }
            const renderedHtml = ejs.render(html, pdfParams)

            const options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: `<div style="text-align: center;"><h1>${reservationData.eventName}</h1></div>`
                },
                footer: {
                    height: "28mm",
                    contents: `<div style="text-align: justify;"><b>Terms and Conditions:</b><br>
                Please refer to our website for terms and conditions of purchase.</div>`
                }
            };
            const document = {
                html: renderedHtml,
                data: {
                    reservation: reservationData,
                },
                path: `./public/tickets/${ticket._id}.pdf`,
                type: ""
            }

            const pdfCreated = await pdf.create(document, options);
            //4.2. Send e-mail with PDF file as attachement

            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });


            // send mail with defined transport object
            const info = {
                from: process.env.EMAIL_USERNAME, // sender address
                to: req.user.email, // list of receivers
                subject: "Ticket Confirmation", // Subject line
                text: "Here is your ticket", // plain text body
                // html: emailTemplate(user.name, user.email),
                attachments: [{
                    // stream as an attachment
                    filename: 'ticket.pdf',
                    content: fs.createReadStream(pdfCreated.filename)
                }]
            };
            await transporter.sendMail(info);
            // 5. return response
            //update ticket
            const updatedTicket = await TicketSchema.findByIdAndUpdate(ticket._id, ticketData, { new: true });
            //update user tickets
            await UserSchema.findByIdAndUpdate(req.user._id, { $push: { tickets: ticket._id } });
            //update number of tickets available
            await EventSchema.findByIdAndUpdate(eventId, { $inc: { availableTicketNumber: -1 } });

            res.json(updatedTicket)
        } else {
            res.status(400).json({ message: 'Tickets sold out!' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error!" })
    }
}
