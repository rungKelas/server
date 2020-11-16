const { Question, Teacher, Lesson, Course, Quiz } = require ('../models')
const createError = require('http-errors')

module.exports = function authorization (req, res, next) {
    const { questionId } = req.params
    console.log(console.log(req.params))
    const { id } = req.verified
    let quizId = null

    Teacher
        .findByPk(id)
        .then( teacher => {
            // console.log(teacher, `ini teacher`)
            return Lesson.findOne({ where: { TeacherId: teacher.id } })
        })
        .then( lesson => {
            // console.log(lesson, `ini lesson`)
            return Course.findOne({ where: { LessonId: lesson.id } })
        })
        .then( course => {
            // console.log(course, `ini course`)
            return Quiz.findOne({ where: { CourseId: course.id } })
        })
        .then( quiz => {
            // console.log(quiz, `ini quiz`)
            quizId = quiz.id
        })
        .catch( err => {
            next(err)
        })


    Question
        .findByPk( questionId )
        .then( question => {
            if (!question) {
                throw createError(401, 'unauthorized access')
            } else {
                console.log(question.QuizId, `<<< ini quiz id`)
                if (question.QuizId == quizId) {
                    next()
                } else {
                    throw createError(401, 'unauthorized access')
                }
            }
        })
        .catch(err => {
            next(err)
        })
}