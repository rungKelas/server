const jwt = require('jsonwebtoken')

export default function generateToken(token) {
    const getId = jwt.verify(req.params.token, process.env.JWT_TEACHER)
    return getId.id
}