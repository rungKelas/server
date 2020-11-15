const jwt = require('jsonwebtoken')
const { Teacher } = require('../models')
const createError = require('http-errors')

module.exports = function checkTokenRegisterStudent(req, res, next) {
    const token = req.params.token
    const verified = jwt.verify(token, process.env.JWT_TEACHER)
    Teacher.findByPk(verified.id)
    .then(teacher => {
        if (!teacher) {
            throw createError(400, 'token is invalid')
        } else {
            req.verified = verified
            next()
        }
    })
    .catch(err => {
        next(err)
    })
}