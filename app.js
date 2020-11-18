if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use(routes)
app.use(errorHandler)

module.exports = app
