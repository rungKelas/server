module.exports = function checkTokenRegisterStudent(req, res, next) {
    const token = req.params.token
    let teacherId = ""
    
    for(let i = 0; i < token.length; i++){
        if (i == token.length-2 || i == token.length-1 ) {
            teacherId += token[i]
        }
    }

    req.verified = teacherId
    next()
}