const { Student, Lesson, Quiz, Score, Question } = require('../models')
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const createError = require('http-errors')

class StudentController{
    static register(req, res, next) {
        let TeacherId = req.verified.id
        const { name, address, birthdate, email, password } = req.body
        Student.create({
            name, address, birthdate, email, password, TeacherId
        })
        .then(student => {
            res.status(201).json({
                id: student.id,
                email: student.email
            })
        })
        .catch(err => {
            next(err)
        })
    }

    static login(req, res, next) {
        const { email, password } = req.body

        Student.findOne({
            where: {email}
        })
        .then(student => {
            if (!student) {
                throw createError(400, "invalid email / password")
            } else {
                const validPassword = bcryptjs.compareSync(password, student.password)

                if (!validPassword) {
                    throw createError(400, "invalid email / password")
                }
                const access_token = jwt.sign({
                    id: student.id,
                    email: student.email
                }, process.env.JWT_SECRET)

                res.status(200).json({
                    access_token,
                    email: student.email,
                    name: student.name
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static getLessons(req, res, next) {
        const { teacherId } = req.body
        Lesson.findAll({
            where: {
                teacherId
            }
        })
        .then(lessons => {
            if (lessons.length < 1){
                throw createError(400, "not found!")
            }
            res.status(200).json(lessons)
        })
        .catch(err => {
            next(err)
        })
    }

    static getCourse(req, res, next) {
        const { lessonId } = req.params
        Lesson.findOne({
            where: {
                id: lessonId
            }
        })
        .then(course => {
            if (!course){
                throw createError(400, "not found!")
            }
            res.status(200).json(course)
        })
        .catch(err=> {
            next(err)
        })
    }

    static getQuiz(req, res, next) {
        const { courseId } = req.params
        Quiz.findAll({
            where: {
                courseId
            }
        })
        .then(quiz => {
            if (quiz.length < 1){
                throw createError(400, "not found!")
            }
            res.status(200).json(quiz)
        })
        .catch(err => {
            next(err)
        })
        
    }

    static getQuestion(req, res, next) {
        const { quizId } = req.params
        Question.findAll({
            where: {
                quizId
            }
        })
        .then(question => {
            if (question.length < 1){
                throw createError(400, "not found!")
            }
            res.status(200).json(question)
        })
        .catch(err => {
            next(err)
        })

    }

    static getScore(req, res, next) {
        const { StudentId } = req.params
        Score.findAll({
            where: {
                StudentId
            }
        })
        .then(scores => {
            console.log(scores)
            if (scores.length < 1){
                throw createError(400, "not found!")
            }
            res.status(200).json(scores)
        })
        .catch(err => {
            next(err)
        })
    }

    static answer(req, res, next) {
        const { QuestionId } = req.params
        const { answer, StudentId, QuizId } = req.body
        const score = req.score
        
        Score.create({
            StudentId, answer, score, QuestionId, QuizId
        })
        .then(score => {
            res.status(200).json({
                score: score.score
            })
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = StudentController