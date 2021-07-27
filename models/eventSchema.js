const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventSchema = new Schema(
    {
        name: {type:String},
        description: {type:String},
        startDateTime: {type:Date},
        endDateTime: {type:Date},
        location: {type:String},
        price: {type:Number},
        availableTicketNumber: {type:Number},
        eventImage: {type:String},
        eventType: {type:String},
        tags: [{type: mongoose.Schema.Types.ObjectId, ref: "tag"}],
        author: {type: mongoose.Schema.Types.ObjectId, ref:"user"}
    },{
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Event', eventSchema);