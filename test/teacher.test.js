const app = require ('../app.js')
const { Teacher, Lesson, Course, Quiz, Question } = require ('../models')
const request = require ('supertest')
const jwt = require ('jsonwebtoken')
const { lessons } = require('../controllers/Student.js')
const teacher = {
    name: "Egy Fazri",
    address: "Karawang",
    birthdate: new Date(),
    email: "egy@mail.com",
    password: "123123abc",
    role: "teacher"
}
let teacherId = null
let lessonId = null
let courseId = null
let quizId = null
let questionId = null
let access_token = null



describe('Teacher Routes', () => {

    // beforeAll((done) => {
    //     Teacher
    //         .create(teacher)
    //         .then(teacher => {
    //             access_token = jwt.sign({
    //                 id: teacher.id,
    //                 email: teacher.email
    //             }, `secret`)
    //             teacherId = teacher.id
    //         })
    // })

    beforeAll((done) => {
        Teacher
            .create(teacher)
            .then(teacher => {
                access_token = jwt.sign({
                    id: teacher.id,
                    email: teacher.email
                }, `secret`)
                teacherId = teacher.id
                done()
                return Lesson.create({
                    name: `Matematika`, 
                    teacherId: teacher.id
                })
            })
            .then(lesson => {
                done()
                lessonId = lesson.id
                return Course.create({
                    name: 'Aljabar',
                    materialUrl: 'http',
                    lessonId: lesson.id
                })
            })
            .then(course => {
                done()
                courseId = course.id
                return Quiz.create({
                    title: 'AljabarQuiz',
                    courseId: course.id
                })
            })
            .then(quiz => {
                done()
                quizId = quiz.id
                return Question.create({
                    question: `Apa nama ibu kota Indonesia?`,
                    choices: [`Jakarta`, 'Bandung', 'Surabaya', 'Yogyakarta'],
                    answer: 'Jakarta',
                    quizId: quiz.id
                })
            })
            .then(question => {
                questionId = question.id
                done()
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
                done()
                return Lesson.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                done()
                return Course.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                done()
                return Course.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                done()
                return Quiz.destroy({
                    where: {},
                    truncate: true
                })
            })
            .then(_ => {
                done()
                return Question.destroy({
                    where: {},
                    truncate: true
                })
            })
            .catch( err => {
                done(err)
            })
    })

    describe('POST /teacher/register', () => {
        describe('success register', () => {
            test('should return status 201 and teacher object', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send({
                        name: 'Fazri',
                        email: 'fazri@mail.com',
                        birthdate: "01-02-1995",
                        password: 'start from beginning',
                        address: 'karawang, jawabarat',
                        role: 'teacher'
                    })
                    .expect(201)
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body.teacher
                            expect(data).toHaveProperty("name", "Fazri")
                            expect(data).toHaveProperty("address", "karawang, jawabarat")
                            expect(data).toHaveProperty("birthdate", "1995-01-01T17:00:00.000Z")
                            expect(data).toHaveProperty("email", 'fazri@mail.com')
                            expect(data).toHaveProperty("role", 'teacher')
                            done()
                        }
                    })
            })
        })

        // describe('failed register', () => {
        //     test('should return status 400 bad request', (done) => {
        //         request(app)
        //             .post('/teacher/register')
        //             .send()
        //             .end((err, response) => {
        //                 if (err) {
        //                     done(err)
        //                 } else {
        //                     const data =response.body
        //                     expect(400)
        //                     expect(data).toHaveProperty("error_message")
        //                 }
        //             })
        //     })
        // })

    })

    describe('POST /login', () => {
        describe('success login', () => {
            test('should return status 200 and token' , (done) => {
                request(app)
                    .post('/teacher/login')
                    .send({
                        email: 'fazri@mail.com',
                        password: 'start from beginning'
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(200)
                            expect(data).toHaveProperty("access_token")
                            done()
                        }
                    })
            })
        })

        // describe('failed login', () => {
        //     test('should return status 400 bad request' , (done) => {
        //         request(app)
        //             .post('/teacher/login')
        //             .send({

        //             })
        //             .end( (err, response) => {
        //                 if (err) {
        //                     done(err)
        //                 } else {
        //                     const data = response.body
        //                     expect(200)
        //                     expect(data).toHaveProperty("error_message", "email/password is wrong")
        //                 }
        //             })
        //     })
        // })
    })

    describe('POST teacher/lesson', () => {
        describe('success create lesson', () => {
            test('should return status 201 and object of lesson' , (done) => {
                request(app)
                    .post('/teacher/lesson')
                    .send({
                        name: 'Bahasa Indonesia',
                        id: teacherId
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(200)
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("name", "Bahasa Indonesia")
                            expect(data).toHaveProperty("teacherId", teacherId)
                            done()
                        }
                    })
            })
        })
    })


    describe('POST teacher/course', () => {
        describe('success create course', () => {
            test('should return status 201 and object of course' , (done) => {
                request(app)
                    .post('/teacher/course')
                    .send({
                        name: 'SPOK',
                        materialUrl: "http://",
                        lessonId
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            console.log(data)
                            expect(201)
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("name", "SPOK")
                            expect(data).toHaveProperty("lessonId", lessonId)
                            done()
                        }
                    })
            })
        })
    })


    describe('POST teacher/quiz', () => {
        describe('success create quiz', () => {
            test('should return status 201 and object of quiz' , (done) => {
                request(app)
                    .post('/teacher/quiz')
                    .send({
                        title: "SPOK Quiz",
                        courseId
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            console.log(data,`ini data quiz`)
                            expect(201)
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("title", "SPOK Quiz")
                            expect(data).toHaveProperty("courseId", String(courseId))
                            done()
                        }
                    })
            })
        })
    })


    describe('POST teacher/question', () => {
        describe('success create question', () => {
            test('should return status 201 and object of question' , (done) => {
                request(app)
                    .post('/teacher/question')
                    .send({
                        questions: "apa nama ibu kota amerika serikat?",
                        choices: ["Jakarta", "Washington DC", "New York", "Chicago" ],
                        answer: "washingtong DC",
                        quizId
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            console.log(data)
                            expect(201)
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("questions", "apa nama ibu kota amerika serikat?")
                            expect(data).toHaveProperty("quizId", quizId)
                            done()
                        }
                    })
            })
        })
    })


} )