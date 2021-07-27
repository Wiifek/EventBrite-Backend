const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

require("dotenv").config();

const connect = require('./dbConnection')
const auth = require('./routes/authApi')
const user = require('./routes/userApi')
const event = require('./routes/eventApi')
const tag = require('./routes/tagApi')



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("", auth)
app.use("/users",user)
app.use("/events",event)
app.use("/tags",tag)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
