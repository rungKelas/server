module.exports = function errorHandler(err, req, res, next) {
    console.log(err.name, `ini error<<<<<<<<<<<<<<<`)
    let statusCode = 500
    let message = "Internal Server Error!"
    switch (err.name) {
        case "SequelizeValidationError":
            statusCode = 400
            message = err.errors[0].message
            break;
        case "SequelizeUniqueConstraintError":
            statusCode = 400
            message = `email already used`
            break;
        case "JsonWebTokenError":
            statusCode = 401
            message = 'Failed to authenticate'
            break;
        case 'NotFoundError':
        case 'email/password is wrong':
            statusCode = 400
            message = err.name
            break;
        case 'ForbiddenError':
        case 'UnauthorizedError':
        case 'BadRequestError': 
            statusCode = err.statusCode
            message = err.message
            break;
    
        default:
            statusCode
            message
            break;
    }

    res.status(statusCode).json({message})
}