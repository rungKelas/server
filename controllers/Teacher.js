const { Teacher, Lesson, Course, Quiz, Question } = require ('../models')
const bcryptjs = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

class TeacherController {
    static teacherRegister ( req, res, next ){
        const { name, address, birthdate, email, password, role } = req.body
        Teacher
            .create({
                name,
                address,
                birthdate,
                email,
                password,
                role
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
                    throw {
                        name: `email/password is wrong`
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
                            name: `email/password is wrong`
                        }
                    }
                }
            })
            .catch( err => {
                console.log(err.name, `ini eror controller <<<<<<<<<<<<`)
                next(err)
            })
    }

    static createLesson (req, res, next){
        const { name, id } = req.body
        Lesson
            .create({
                name,
                teacherId: id
            })
            .then( data => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })
    }

    static createCourse (req, res, next){
        const { name, materialUrl, lessonId } = req.body
        Course
            .create({
                name,
                materialUrl,
                lessonId
            })
            .then(data => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })
    }

    static createQuiz (req, res, next){
        const { title, courseId } = req.body
        Quiz
            .create({
                title,
                courseId
            })
            .then(data => {
                res.status(201).json(data)
            })
            .catch( err => {
                next(err)
            })

    }

    static createQuestion ( req, res, next ){
        const { questions, answer, choices, quizId } = req.body
        Question.create({
            quizId,
            questions,
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


module.exports = TeacherController