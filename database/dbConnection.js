const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/eventBrite', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        () => {
            console.log("Successfully connected to database")
        }
    ).catch((error) => {
        console.log(error)
        console.log("Error connectiong to database")
    })