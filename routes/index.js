const route = require('express').Router()
const StudentController = require('../controllers/Student')
const TeacherController = require('../controllers/Teacher')
const teacher = require('../models/teacher')
const checkTokenRegisterStudent = require('../middlewares/checkTokenRegisterStudent')

route.post("/register/:token",  checkTokenRegisterStudent, StudentController.register)
route.post("/login", StudentController.login)
route.get("/lessons", StudentController.getLessons)
route.get("/lessons/:lessonId", StudentController.getCourse)
route.get("/quiz/:courseId", StudentController.getQuiz)
route.get("/questions/:QuizId", StudentController.getQuestion)
route.get("/scores/:StudentId", StudentController.getScore)
route.post("/answer/:QuestionId", StudentController.answer)

route.post("/teacher/register", TeacherController.teacherRegister)
route.post("/teacher/login", TeacherController.teacherLogin)
route.post("/teacher/lesson/:teacherId", TeacherController.createLesson)
route.post("/teacher/course/:lessonId", TeacherController.createCourse)
route.post("/teacher/quiz/:courseId", TeacherController.createQuiz)
route.post("/teacher/question/:quizId", TeacherController.createQuestion)



module.exports = route
