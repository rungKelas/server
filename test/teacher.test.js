const app = require ('../app.js')
const { Teacher, Lesson, Course, Quiz, Question } = require ('../models')
const request = require ('supertest')
const jwt = require ('jsonwebtoken')
const teacher = {
    name: "Egy Fazri",
    address: "Karawang",
    birthdate: new Date(),
    email: "egy@mail.com",
    password: "123123abc",
    role: "teacher"
}
let quizId = null
let access_token = null



describe('Teacher Routes', () => {

    beforeAll((done) => {
        Teacher
            .create({
                name: 'Fazri',
                email: 'fazri@mail.com',
                birthdate: new Date(),
                password: 'start from beginning',
                address: 'karawang, jawabarat',
                role: 'teacher'
            })
            .then(teacher => {
                access_token = jwt.sign({
                    id: teacher.id,
                    email: teacher.email
                }, `secret`)
                return Lesson.create({
                    name: `Matematika`, 
                    teacherId: teacher.id
                })
            })
            .then(lesson => {
                return Course.create({
                    name: 'Aljabar',
                    materialUrl: 'http',
                    lessonId: lesson.id
                })
            })
            .then(course => {
                return Quiz.create({
                    title: 'AljabarQuiz',
                    courseId: course.id
                })
            })
            .then(quiz => {
                quizId = quiz.id
                return Question.create({
                    question: `Apa nama ibu kota Indonesia?`,
                    choices: [`Jakarta`, 'Bandung', 'Surabaya', 'Yogyakarta'],
                    answer: 'Jakarta',
                    quizId: quiz.id
                })
            })
            .catch( err => {
                done(err)
            })
    })

    afterAll( (done) => {
        Teacher
            .destroy({
                where: {},
                truncate: true
            })
            .then(_ => {
                Lesson.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                Course.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                Course.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                Quiz.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                Question.destroy({
                    where: {},
                    truncate: true
                })
            })
            .catch( err => {
                done(err)
            })
    })

    describe('POST /register', () => {
        describe('success register', () => {
            test('should return status 201 and teacher object', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send(teacher)
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("name", teacher.name)
                            expect(data).toHaveProperty("address", teacher.address)
                            expect(data).toHaveProperty("birthdate", teacher.birthdate)
                            expect(data).toHaveProperty("email", teacher.email)
                            expect(data).toHaveProperty("role", teacher.role)
                        }
                    })
            })
        })

        describe('failed register', () => {
            test('should return status 400 bad request', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send()
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(400)
                            expect(data).toHaveProperty("error_message")
                        }
                    })
            })
        })

    })

    describe('POST /login', () => {
        describe('success login', () => {
            test('should return status 200 and token' , (done) => {
                request(app)
                    .post('/teacher/login')
                    .send({

                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(200)
                            expect(data).toHaveProperty("access_token")
                        }
                    })
            })
        })

        describe('failed login', () => {
            test('should return status 400 bad request' , (done) => {
                request(app)
                    .post('/teacher/login')
                    .send({

                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(200)
                            expect(data).toHaveProperty("error_message", "email/password is wrong")
                        }
                    })
            })
        })
    })

    describe('POST /')


} )