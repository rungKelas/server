const { Question } = require('../models')

module.exports = function getScore(questionId, answerStudent) {
    Question.findByPk(questionId)
    .then(question => {
        if (question.answer === answerStudent) {
            return 1
        }
        return 0
    })
}