const { Teacher, Lesson, Course, Quiz, Question } = require ('../models')
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


class TeacherController {

    static teacherRegister ( req, res, next ){
        const { name, address, birthdate, email, password, role } = req.body
        Teacher
            .createQuestion({
                name,
                address,
                birthdate,
                email,
                password,
                role
            })
            .then(({ data }) => {
                const { name, email, birthdate, address, role } = data 
                res.status(201).json({
                    name,
                    email,
                    birthdate,
                    address,
                    role
                })
            })
            .catch( err => {
                next (err)
            })
    }

    static teacherLogin (req, res, next){
        const { email, password } = req.body
        Teacher
            .findOne({
                email
            })
            .then(({ data }) => {
                if (!data) {
                    throw {
                        error_msg: `email/password is wrong`
                    }
                } else {
                    const validatePassword = bcryptjs.compareSync(password, data.password)
                    if (validatePassword) {
                        const access_token = jwt.sign({
                            id: data.id,
                            email: data.email
                        }, `secret`)
                        res.status(200).json({ access_token })
                    } else {
                        throw {
                            error_msg: `email/password is wrong`
                        }
                    }
                }
            })
            .catch( err => {
                next(err)
            })
    }

    static createLesson (req, res, next){
        const { name } = req.body
        Lesson
            .create({
                name,
                teacherId: req.decodedUser.id
            })
            .then(({ data }) => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })
    }

    static createCourse (req, res, next){
        const { name, materialUrl } = req.body
        const { id } = req.params
        Course
            .create({
                name,
                materialUrl,
                lessonId: id
            })
            .then(({ data }) => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })
    }

    static createQuiz (req, res, next){
        const { title } = req.body
        const { id } = req.params
        Lesson
            .create({
                title,
                courseId: id
            })
            .then(({ data }) => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })

    }

    static createQuestion ( req, res, next ){
        const { question, answer, choices } = req.body
        const { id } = req.params
        Question.create({
            quizId: id,
            question,
            choices,
            answer
        })
        .then(({ data }) => {
            res.status(200).json(data)
        })
        .catch( err => {
            next(err)
        })
    }

    static getQuestion (req, res, next){
        const { id } = req.params
        Question
            .findOne({
                id
            })
            .then(( { data }) => {
                res.status(200).json(data)
            })
            .catch( err => {
                next(err)
            })
    }

    static editQuestions (req, res, next) {
        const { questions, choices, answer } = req.body
        const { id } = req.params
        Question
            .update({
                questions,
                choices,
                answer
            }, { where: {
                id
            }})
            .then(_ => {
                res.status(200).json({
                    message: `success edit question`
                })
            })
    }

    static deleteQuiz (req, res, next ){
        Quiz
            .destryo({
                where: {
                    teacherId : req.decodedUser.id
                }
            })
            .then(( { data }) => {
                res.status(200).json(data)
            })
            .catch( err => {
                next (err)
            })
    }

}


Model.export = TeacherController