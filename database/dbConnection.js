const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

mongoose.connect('mongodb://localhost:27017/eventBrite', options)
    .then(
        () => {
            console.log("Successfully connected to database")
        }
    ).catch((error) => {
        console.log(error)
        console.log("Error connectiong to database")
    })