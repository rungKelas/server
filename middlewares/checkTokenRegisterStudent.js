const jwt = require('jsonwebtoken')
const { Teacher } = require('../models')
const createError = require('http-errors')

module.exports = function checkTokenRegisterStudent(req, res, next) {
    const token = req.params.token
    let teacherId = ""
    let flag = false
    
    for(let i = 0; i < token.length; i++){

        if(flag) {
            teacherId += token[i]
        }

        if ( token[i] == 'D') {
            flag = true
        }
    }

    
    req.verified = teacherId
    next()

}