const route = require('express').Router()
const StudentController = require('../controllers/Student')
const TeacherController = require('../controllers/Teacher')
const teacher = require('../models/teacher')

route.post("/register/:token", StudentController.register)
route.post("/login", StudentController.login)
route.get("/lessons", StudentController.lessons)
route.post("/teacher/register", TeacherController.teacherRegister)
route.post("/teacher/login", TeacherController.teacherLogin)
route.post("/teacher/lesson", TeacherController.createLesson)
route.post("/teacher/course", TeacherController.createCourse)
route.post("/teacher/quiz", TeacherController.createQuiz)
route.post("/teacher/question", TeacherController.createQuestion)


module.exports = route
