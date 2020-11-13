const{ Student, Lessons } = require('../models')
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const createError = require('http-errors')

class StudentController{
    static register(req, res, next) {
        const { name, address, birthdate, email, password } = req.body
        Student.create({
            name, address, birthdate, email, password
        })
        .then(student => {
            res.status(201).json({student})
        })
        .catch(err => {
            next(err)
        })
    }

    static login(req, res, next) {
        const { email, password } = req.body

        Student.findOne({
            where: {email}
        })
        .then(student => {
            if (!student) {
                throw createError(400, "invalid email / password")
            } else {
                const validPassword = bcryptjs.compareSync(password, student.password)

                if (!validPassword) {
                    throw createError(400, "invalid email / password")
                }
                const access_token = jwt.sign({
                    id: student.id,
                    email: student.email
                }, process.env.JWT_SECRET)

                res.status(200).json({
                    access_token,
                    email: student.email,
                    name: student.name
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static lessons(req, res, next) {
        const { TeacherId } = req.body
        Lessons.findAll({
            where: {
                TeacherId
            }
        })
    }

    

}

module.exports = StudentController