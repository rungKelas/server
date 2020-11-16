const route = require('express').Router()
const StudentController = require('../controllers/Student')
const TeacherController = require('../controllers/Teacher')
const teacher = require('../models/teacher')
const getScore = require('../middlewares/getScore')
const checkTokenRegisterStudent = require('../middlewares/checkTokenRegisterStudent')
const authentication = require('../middlewares/authentication')

route.post("/register/:token",  checkTokenRegisterStudent, StudentController.register)
route.post("/login", StudentController.login)
route.get("/lessons", StudentController.getLessons)
route.get("/lessons/:lessonId", StudentController.getCourse)
route.get("/quiz/:CourseId", StudentController.getQuiz)
route.get("/questions/:QuizId", StudentController.getQuestion)
route.get("/scores/:StudentId", StudentController.getScore)
route.post("/answer/:QuestionId", getScore, StudentController.answer)

route.post("/teacher/register", TeacherController.teacherRegister)
route.post("/teacher/login", TeacherController.teacherLogin)
route.post("/teacher/lesson/:teacherId", TeacherController.createLesson)
route.post("/teacher/course/:lessonId", TeacherController.createCourse)
route.post("/teacher/quiz/:courseId", TeacherController.createQuiz)
route.post("/teacher/question/:quizId", TeacherController.createQuestion)
route.put ("/teacher/question/:questionId", TeacherController.editQuestions)
route.delete("/teacher/question/:questionId", TeacherController.deleteQuiz)



module.exports = route