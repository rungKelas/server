const { Question } = require('../models')

module.exports = function getScore(req, res, next) {
    let answerStudent = req.body.answer
    let questionId = req.params.QuestionId

    Question.findByPk(questionId)
    .then(question => {
        if (question.answer == answerStudent){
            req.score = 1
            next()
        } else {
            req.score = 0
            next()
        }
    })
    .catch(err => {
        next(err)
    })
}