const { Student, Lesson, Quiz, Score, Question, Course } = require('../models')
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const createError = require('http-errors')


// SETTINGAN CLOUD ///
const { Storage } = require ('@google-cloud/storage')
const GoogleCloud = new Storage({
    keyFilename: "./platformonlineschool-9af2237cac83.json",
    projectId: 'platformonlineschool'
});

const posStorageBucket = GoogleCloud.getBuckets('pos-storage-bucket')

///-------------------------------------------------------------------------------------///

class StudentController{
    
    static register(req, res, next) {
        const TeacherId = req.verified
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
                    email: student.email,
                    
                }, process.env.JWT_SECRET)

                res.status(200).json({
                    access_token,
                    teacherId: student.TeacherId,
                    name: student.name,
                    id: student.id
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static getLessons(req, res, next) {
        const { teacherId } = req.params
        Lesson.findAll({
            where: {
                TeacherId : teacherId
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
        Course.findAll({
            where: {
                LessonId: lessonId
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
                CourseId : courseId
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
        
        const { quizId } = req.params
        Question.findAll({
            where: {
                QuizId : quizId
            }
        })
        .then(question => {
            if (question.length < 1){
                throw createError(400, "not found!")
            }
            console.log(question)
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

    static getStudent( req, res, next ){ 
        const id = req.params.studentId
        Student
            .findByPk(id)
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                next(err)
            })
    }


    /// STATIC UPLOAD ///

    static async uploadPhoto ( _, { file } ){
        const { createReadStream, filename } = await file

        await new Promise( res => 
            createReadStream()
                .pipe(
                    posStorageBucket.file(filename).createWriteStream({
                        resumable: false,
                        gzip: true,
                    })
                )
                .on("finish", res)
        )
    }

}

module.exports = StudentController