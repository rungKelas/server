const route = require('express').Router()
const StudentController = require('../controllers/Student')

route.post("/register/:token", StudentController.register)
route.post("/login", StudentController.login)
route.get("/lessons", StudentController.lessons)

module.exports = route
