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
let teacherId = null
let lessonId = null
let courseId = null
let quizId = null
let access_token = null



describe('Teacher Routes', () => {

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
                truncate: {cascade: true}
            })
            .then(_ => {
                done()
                return Lesson.destroy({
                    truncate: {cascade: true}
                })
            })
            .then(_ => {
                done()
                return Course.destroy({
                    truncate: {cascade: true}
                })
            })
            .then(_ => {
                done()
                return Quiz.destroy({
                    truncate: {cascade: true}
                })
            })
            .then(_ => {
                done()
                return Question.destroy({
                    truncate: {cascade: true}
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

        describe('failed register', () => {
            test('should return status 400 name is require', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send({
                        name: '',
                        email: 'fazri@mail.com',
                        birthdate: "01-02-1995",
                        password: 'start from beginning',
                        address: 'karawang, jawabarat',
                        role: 'teacher'
                    })
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "name is required")
                            done()
                        }
                    })
            })

            test('should return status 400 email is require', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send({
                        name: 'Egy',
                        email: '',
                        birthdate: "01-02-1995",
                        password: 'start from beginning',
                        address: 'karawang, jawabarat',
                        role: 'teacher'
                    })
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "invalid email format")
                            done()
                        }
                    })
            })

            test('should return status 400 birthdate is required', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send({
                        name: 'Egy',
                        email: 'egy@mail.com',
                        birthdate: "",
                        password: 'start from beginning',
                        address: 'karawang, jawabarat',
                        role: 'teacher'
                    })
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "birthdate is required")
                            done()
                        }
                    })
            })

            test('should return status 400 password is require', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send({
                        name: 'Egy',
                        email: 'egy@mail.com',
                        birthdate: "01-07-1995",
                        password: '123',
                        address: 'karawang, jawabarat',
                        role: 'teacher'
                    })
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "password should be 5 and 32 characters")
                            done()
                        }
                    })
            })

            test('should return status 400 address is required', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send({
                        name: 'Egy',
                        email: 'egy@mail.com',
                        birthdate: "01-07-1995",
                        password: '123123',
                        address: '',
                        role: 'teacher'
                    })
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "address is required")
                            done()
                        }
                    })
            })

            test('should return status 400 address is required', (done) => {
                request(app)
                    .post('/teacher/register')
                    .send({
                        name: 'Egy',
                        email: 'egy@mail.com',
                        birthdate: "01-07-1995",
                        password: '123123',
                        address: 'karawang',
                        role: 'teacher'
                    })
                    .end((err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data =response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "email already used")
                            done()
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

        describe('failed login', () => {
            test('should return status 400 bad request' , (done) => {
                request(app)
                    .post('/teacher/login')
                    .send({
                        email: 'egy@mailmail.com',
                        password: 'hayu'
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(200)
                            expect(data).toHaveProperty("message", "email/password is wrong")
                            done()
                        }
                    })
            })
        })
    })




    describe('POST teacher/lesson', () => {
        describe('success create lesson', () => {
            test('should return status 201 and object of lesson' , (done) => {
                request(app)
                    .post('/teacher/lesson/' + teacherId)
                    .send({
                        name: 'Bahasa Indonesia'
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(200)
                            expect(data).toHaveProperty("name", "Bahasa Indonesia")
                            expect(data).toHaveProperty("TeacherId", teacherId)
                            done()
                        }
                    })
            })
        })

        describe('failed create lesson', () => {
            test('should return status 400 and lesson name cannot be empty' , (done) => {
                request(app)
                    .post('/teacher/lesson/' + teacherId)
                    .send({
                        name: ''
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "lesson name cannot be empty")
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
                    .post('/teacher/course/' + lessonId)
                    .send({
                        name: 'SPOK',
                        materialUrl: "http://"
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(201)
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("name", "SPOK")
                            expect(data).toHaveProperty("LessonId", lessonId)
                            done()
                        }
                    })
            })
        })

        describe('failed create course', () => {
            test('should return status 400 and course name cannot be empty' , (done) => {
                request(app)
                    .post('/teacher/course/' + lessonId)
                    .send({
                        name: '',
                        materialUrl: "http://"
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "course name cannot be empty")
                            done()
                        }
                    })
            })

            test('should return status 400 and course materialUrl cannot be empty' , (done) => {
                request(app)
                    .post('/teacher/course/' + lessonId)
                    .send({
                        name: 'Bahasa Indonesia',
                        materialUrl: ""
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "material url cannot be empty")
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
                    .post('/teacher/quiz/' + courseId)
                    .send({
                        name: "SPOK Quiz"
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(201)
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("name", "SPOK Quiz")
                            expect(data).toHaveProperty("CourseId", courseId)
                            done()
                        }
                    })
            })
        })

        describe('failed create quiz', () => {
            test('should return status 400 and title quiz cannot be empty' , (done) => {
                request(app)
                    .post('/teacher/quiz/' + courseId)
                    .send({
                        name: ""
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "quiz name cannot be empty")
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
                    .post('/teacher/question/' + quizId)
                    .send({
                        question: "apa nama ibu kota amerika serikat?",
                        choices: ["Jakarta", "Washington DC", "New York", "Chicago" ],
                        answer: "washingtong DC"
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(201)
                            expect(data).toHaveProperty("id")
                            expect(data).toHaveProperty("question", "apa nama ibu kota amerika serikat?")
                            expect(data).toHaveProperty("QuizId", quizId)
                            done()
                        }
                    })
            })
        })

        describe('failed create question', () => {
            test('should return status 400 and question cannot be empty' , (done) => {
                request(app)
                    .post('/teacher/question/' + quizId)
                    .send({
                        question: "",
                        choices: ["Jakarta", "Washington DC", "New York", "Chicago" ],
                        answer: "washingtong DC"
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "question cannot be empty")
                            done()
                        }
                    })
            })

            test('should return status 400 and choices cannot be empty' , (done) => {
                request(app)
                    .post('/teacher/question/' + quizId)
                    .send({
                        question: "Apakah nama tata surya dari bumi?",
                        choices: [],
                        answer: "washingtong DC"
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "choices cannot be empty")
                            done()
                        }
                    })
            })

            test('should return status 400 and answer cannot be empty' , (done) => {
                request(app)
                    .post('/teacher/question/' + quizId)
                    .send({
                        question: "Apakah nama tata surya dari bumi?",
                        choices: ["bima sakti", "andromeda", "zatura", "lazarus"],
                        answer: ""
                    })
                    .end( (err, response) => {
                        if (err) {
                            done(err)
                        } else {
                            const data = response.body
                            expect(400)
                            expect(data).toHaveProperty("message", "answer cannot be empty")
                            done()
                        }
                    })
            })
        })
    })


} )