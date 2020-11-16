module.exports = function errorHandler(err, req, res, next) {
<<<<<<< HEAD
    console.log(err)
=======
    console.log(err, `<<<<<<<<<<<<<<<<<`)
>>>>>>> e5298592d033825529566bbe83769ca46493b5e2
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
            statusCode = 400
            message = 'Error Not Found'
        case 'email/password is wrong':
            statusCode = 400
            message = err.name
            break;
        case 'ForbiddenError':
        case 'UnauthorizedError':
            statusCode = 401
            message = `Unauthorized Access`
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