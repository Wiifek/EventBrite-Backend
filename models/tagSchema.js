const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tagSchema = new Schema(
    {
        name: {type:String},
        description: {type:String}
    }
);

module.exports = mongoose.model("Tag", tagSchema);