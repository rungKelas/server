const { Teacher, Lesson, Course, Quiz, Question } = require ('../models')
const bcryptjs = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

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
        const { courseId } = req.params
        Quiz
            .create({
                name,
                CourseId: courseId
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
        const { quizId } = req.params
        Question.create({
            QuizId: quizId,
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
        const { question, choices, answer } = req.body
        const { questionId } = req.params
        Question
            .update({
                question,
                choices,
                answer
            }, { where: {
                id : questionId
            }})
            .then(_ => {
                res.status(200).json({
                    message: `success edit question`
                })
            })
            .catch(err => {
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
                if (!data) {
                    throw {
                        name: "NotFoundError"
                    }
                } else {
                    res.status(200).json({
                        message: `success delete question`
                    })
                }

            })
            .catch( err => {
                next (err)
            })
    }

}


module.exports = TeacherController