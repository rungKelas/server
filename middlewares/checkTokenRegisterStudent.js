module.exports = function checkTokenRegisterStudent(req, res, next) {
    const token = req.params.token
    let teacherId = ""
    let flag = false
    const createError = require('http-errors')

    for(let i = 0; i < token.length; i++){

        if(flag) {
            teacherId += token[i]
        }

        if ( token[i] == 'D') {
            flag = true
        }
    }

    if (teacherId.length < 1) {
        next(createError(400, "invalid token"))
    } else {
        req.verified = teacherId
        next()
    }
}