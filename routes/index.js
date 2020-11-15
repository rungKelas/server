const route = require('express').Router()
const StudentController = require('../controllers/Student')
const TeacherController = require('../controllers/Teacher')
const teacher = require('../models/teacher')
const getScore = require('../middlewares/getScore')
const checkTokenRegisterStudent = require('../middlewares/checkTokenRegisterStudent')

route.post("/register/:token",  checkTokenRegisterStudent, StudentController.register)
route.post("/login", StudentController.login)
route.get("/lessons", StudentController.getLessons)
route.get("/lessons/:lessonId", StudentController.getCourse)
route.get("/quiz/:courseId", StudentController.getQuiz)
route.get("/questions/:quizId", StudentController.getQuestion)
route.get("/scores/:StudentId", StudentController.getScore)
route.post("/answer/:QuestionId", getScore, StudentController.answer)

route.post("/teacher/register", TeacherController.teacherRegister)
route.post("/teacher/login", TeacherController.teacherLogin)
route.post("/teacher/lesson", TeacherController.createLesson)
route.post("/teacher/course", TeacherController.createCourse)
route.post("/teacher/quiz", TeacherController.createQuiz)
route.post("/teacher/question", TeacherController.createQuestion)



module.exports = route
