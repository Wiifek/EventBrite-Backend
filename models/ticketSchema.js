const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ticketSchema = new Schema(
    {
        owner: {type: mongoose.Schema.Types.ObjectId, ref:"user"},
        event: {type: mongoose.Schema.Types.ObjectId, ref:"event"},
        QRCode: {type: String},
        QRCodePath: {type: String},
        ticketPath: {type: String}
    },{
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Ticket", ticketSchema);