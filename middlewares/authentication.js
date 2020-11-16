const jwt = require('jsonwebtoken')
const { Student, Teacher } = require('../models')
const createError = require('http-errors')

module.exports = function authentication(req, res, next) {
    const verified = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    if (verified && !verified.role) {
        Student.findByPk(verified.id)
        .then(student => {
            if (!student) {

                throw createError(400, "invalid token")
            }
            req.verified = verified
            next()
        })
        .catch(err => {
            next(err)
        })
    } else if (verified && verified.role) {
        Teacher.findByPk(verified.id)
            .then( teacher => {
                if (!teacher){
                    throw createError(400, "invalid token")
                }
                req.verified = verified
                next()
            })
    } else {
        next(createError(400, 'invalid token'))
    }
}