const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

require("dotenv").config();

const connect = require('./database/dbConnection')
const BearerStrategy = require('./passport/bearerStrategy')
const auth = require('./routes/authApi')
const user = require('./routes/userApi')
const event = require('./routes/eventApi')
const tag = require('./routes/tagApi')
const ticket = require('./routes/ticketApi')



app.get('/', (req, res) => {
  res.json({ message  : 'Welcome to EventBrite API!'});
})

app.use("/uploads", express.static('uploads'))

app.use("", auth)
app.use("/users",user)
app.use("/events",event)
app.use("/tags",tag)
app.use("/tickets",ticket)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
