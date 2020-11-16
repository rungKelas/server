const jwt = require('jsonwebtoken')
const { Teacher } = require('../models')
const createError = require('http-errors')

module.exports = function convertToken(req, res, next) {
    const verified = jwt.verify(req.params.token, process.env.JWT_SECRET)
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