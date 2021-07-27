const mongoose = require('mongoose');
const port = 3000

mongoose.connect('mongodb://localhost:27017/eventBrite', {useNewUrlParser: true, useUnifiedTopology: true})
.then(
    ()=>{
        console.log("Successfully connected to db")
        app.listen(port)
    }
).catch(()=>{
    console.log("Error connectiong to database")
})