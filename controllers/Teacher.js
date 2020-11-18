const { Teacher, Lesson, Course, Quiz, Question, Student } = require ('../models')
const bcryptjs = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const createError = require('http-errors')

class TeacherController {
    static teacherRegister ( req, res, next ){
        const { name, address, birthdate, email, password } = req.body
        Teacher
            .create({
                name,
                address,
                birthdate: birthdate,
                email,
                password
            })
            .then(teacher => {
                res.status(201).json({ teacher })
            })
            .catch( err => {
                next (err)
            })
    }

    static teacherLogin (req, res, next){
        const { email, password } = req.body
        Teacher
            .findOne({
                where: {
                    email
                }
            })
            .then(data => {
                if (!data) {
                    throw createError(400, `email/password is wrong`)
                } else {
                    const validatePassword = bcryptjs.compareSync(password, data.password)
                    if (!validatePassword){
                        throw createError(400, `email/password is wrong`)
                    }
                    const access_token = jwt.sign({
                        id: data.id,
                        email: data.email,
                        name: data.name
                    }, process.env.JWT_SECRET)
                    res.status(200).json({ access_token })
                }
            })
            .catch( err => {
                next(err)
            })
    }

    static createLesson (req, res, next){
        const { name } = req.body
        const { teacherId } = req.params
        Lesson
            .create({
                name,
                TeacherId: teacherId
            })
            .then( data => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })
    }

    static createCourse (req, res, next){
        const { name, materialUrl } = req.body
        const { lessonId } = req.params
        Course
            .create({
                name,
                materialUrl,
                LessonId: lessonId
            })
            .then(data => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })
    }

    static createQuiz (req, res, next){
        const { name } = req.body
        const { CourseId } = req.params
        Quiz
            .create({
                name,
                CourseId
            })
            .then(data => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })

    }

    static createQuestion ( req, res, next ){
        const { question, answer, choices } = req.body
        const { QuizId } = req.params
        Question.create({
            QuizId,
            question,
            choices,
            answer
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch( err => {
            next(err)
        })
    }

    static deleteQuiz (req, res, next ){
        const { questionId } = req.params
        Question
            .destroy({
                where: {
                    id : questionId
                }
            })
            .then( data => {
                if (data === 0) {
                    throw createError(400, 'data not found')
                }
                console.log(data)
                res.status(200).json({
                    message: `success delete question`
                }) 

            })
            .catch( err => {
                next (err)
            })
    }

    static showStudent (req, res, next) {
        const { TeacherId } = req.params
        Student.findAll({
            where: {
                TeacherId
            }
        })
        .then(students => {
            if (students.length < 1) {
                throw createError(400, 'not found')
            }
            res.status(200).json(students)
        })
        .catch(err => {
            next(err)
        })
    }

    static getCourse (req, res, next) {
        Course.findAll({
            order: [["id","ASC"]],
            include: Lesson
        })
        .then(course => {
            res.status(200).json(course)
        })
        .catch(err => {
            next(err)
        })
    }

    static getQuiz (req, res, next){
        Quiz.findAll({
            include: Course
        })
        .then(quiz => {
            if (quiz.length < 1) {
                throw createError(400, 'not found')
            }
            res.status(200).json(quiz)
        })
        .catch(err => {
            next(err)
        })
    }
}


module.exports = TeacherController