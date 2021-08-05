const express = require('express')
const morgan = require('morgan')
const dotenv = require("dotenv");
const cors = require('cors') 
const app = express()
const port = 3000

// body parser json 
app.use(express.json())
// dot env config
dotenv.config();
// set morgan debug 
app.use(morgan('dev'))
// set public static folder 
app.use("/public", express.static('public'));
//Cors config
app.use(cors());

const connect = require('./database/dbConnection')
const BearerStrategy = require('./passport/bearerStrategy')
const auth = require('./routes/authApi')
const user = require('./routes/userApi')
const event = require('./routes/eventApi')
const tag = require('./routes/tagApi')
const ticket = require('./routes/ticketApi')
const reservation = require('./routes/reservationApi')
const resetPassword = require('./routes/resetPasswordApi')



app.get('/', (req, res) => {
  res.json({ message  : 'Welcome to EventBrite API!'});
})
app.use("", auth)
app.use("/users",user)
app.use("/events",event)
app.use("/tags",tag)
app.use("/tickets",ticket)
app.use("/bookTicket",reservation)
app.use("", resetPassword)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
