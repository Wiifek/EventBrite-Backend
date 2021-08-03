const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        firstName: {type: String},
        lastName: {type: String},
        role: {type: String},
        email: {type: String},
        password: {type: String},
        birthDate: {type: Date},
        address: {type: String},
        phone: {type: String},
        avatar: {type: String, default: `${process.env.PUBLIC_URL}/avatars/avatar.jpg`},
        tickets: [{type: mongoose.Schema.Types.ObjectId, ref:'ticket'}]
    },{
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('User', userSchema)