const route = require('express').Router()
const StudentController = require('../controllers/Student')
const TeacherController = require('../controllers/Teacher')
const authentication = require ('../middlewares/authentication')
const teacher = require('../models/teacher')
const getScore = require('../middlewares/getScore')
const checkTokenRegisterStudent = require('../middlewares/checkTokenRegisterStudent')

route.post("/register/:token",  checkTokenRegisterStudent, StudentController.register)
route.post("/login", StudentController.login)
route.get("/student/:studentId", StudentController.getStudent)
route.get("/allLessons/:teacherId", StudentController.getLessons)
route.get("/course/:lessonId", StudentController.getCourse)
route.get("/quiz/:courseId", StudentController.getQuiz)
route.get("/questions/:quizId", StudentController.getQuestion)
route.get("/scores/:StudentId", StudentController.getScore)
route.post("/answer/:QuestionId", getScore, StudentController.answer)

route.post("/teacher/register", TeacherController.teacherRegister)
route.post("/teacher/login", TeacherController.teacherLogin)
route.get("/teacher/code", authentication, TeacherController.getCode)
route.post("/teacher/lesson/:teacherId", TeacherController.createLesson)
route.post("/teacher/course/:lessonId", TeacherController.createCourse)
route.post("/teacher/quiz/:courseId", TeacherController.createQuiz)
route.post("/teacher/question/:quizId", TeacherController.createQuestion)
route.put ("/teacher/question/:questionId", TeacherController.editQuestions)
route.delete("/teacher/question/:questionId", TeacherController.deleteQuiz)



module.exports = route
