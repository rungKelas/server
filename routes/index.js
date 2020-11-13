const route = require('express').Router()
const StudentController = require('../controllers/Student')

route.post("/register/:token", StudentController.register)
route.post("/login", StudentController.login)
route.get("/lessons", StudentController.getLessons)
route.get("/lessons/:lessonId", StudentController.getCourse)
route.get("/quiz/:courseId", StudentController.getQuiz)
route.get("/questions/:QuizId", StudentController.getQuestion)
route.get("/scores/:StudentId", StudentController.getScore)

module.exports = route
