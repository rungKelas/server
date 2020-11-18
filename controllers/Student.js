const { Student, Lesson, Quiz, Score, Question, Course } = require('../models')
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const createError = require('http-errors')

class StudentController{
    static register(req, res, next) {
        const TeacherId  = req.verified
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
                    name: student.name,
                    TeacherId: student.TeacherId,
                    id: student.id
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static getLessons(req, res, next) {
        const { TeacherId } = req.params
        Lesson.findAll({
            where: {
                TeacherId
            },
            include: Course
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
        const { LessonId } = req.params
        Course.findAll({
            where: {
                LessonId
            },
            include: Lesson
        })
        .then(course => {
            if (course.length < 1){
                throw createError(400, "not found!")
            }
            res.status(200).json(course)
        })
        .catch(err=> {
            next(err)
        })
    }

    static getQuiz(req, res, next) {
        const { CourseId } = req.params
        Quiz.findAll({
            where: {
                CourseId
            },
            include: Question
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
        const { QuizId } = req.params
        Question.findAll({
            where: {
                QuizId
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
            console.log(score)
            res.status(200).json({
                score: score.score
            })
            console.log(score)
        })
        .catch(err => {
            next(err)
        })
    }

    static getStudent(req, res, next) {
        const { id } = req.params
        Student.findByPk(id)
        .then(student => {
            if(!student) {
                throw createError(400, "not found")
            }
            res.status(200).json(student)
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = StudentController