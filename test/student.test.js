const request = require('supertest')
const app = require('../app')
const { Student, Teacher, Lesson, Course, Quiz, Question, Score } = require('../models')
const jwt = require('jsonwebtoken')
let token
let dataStudent = {
    name: "dea",
    address: "Jakarta",
    birthdate: "1-1-1444",
    email: "deadea@mail.com",
    password: "444444"
}

let dataTeacher = {
    name: "dea",
    address: "Jakarta",
    birthdate: "1-1-1444",
    email: "t@mail.com",
    password: "444444"
}
let newStudent
let newTeacher
let newLesson
let newCourse
let newQuiz
let newQuestion

beforeAll(done => {
    Teacher.create(dataTeacher)
    .then(teacher => {
        newTeacher = teacher
            token = jwt.sign({
            id: teacher.id,
            email: teacher.email
        }, process.env.JWT_SECRET)
        return Student.create(dataStudent)
    })
    .then(data => {
        newStudent = data
        return Lesson.create({
            name: `Matematika`, 
            TeacherId: newTeacher.id
        })
    })
    .then(lesson => {
        newLesson = lesson
        return Course.create({
            name: 'Aljabar',
            materialUrl: 'http',
            LessonId: newLesson.id
        })
    })
    .then(course => {
        newCourse = course
        return Quiz.create({
            title: 'AljabarQuiz',
            CourseId: course.id
        })
    })
    .then(quiz => {
        newQuiz = quiz
        return Question.create({
            question: `Apa nama ibu kota Indonesia?`,
            choices: [`Jakarta`, 'Bandung', 'Pekalongan', 'Yogyakarta'],
            answer: 'Jakarta',
            QuizId: quiz.id
        })
    })
    .then(question => {
        done()
        newQuestion = question
    })
    .catch(err => {
        done(err)
    })
})

afterAll(done => {
    Student.destroy({ truncate: { cascade: true } })
    .then(_=> {
        done()
       return Teacher.destroy({ truncate: { cascade: true }  })
    })
    .then(_=> {
        done()
        return Lesson.destroy({ truncate: { cascade: true }  })
    })
    .then(_=> {
        done()
        return Course.destroy({ truncate: { cascade: true }  })
    })
    .then(_=> {
        done()
        return Quiz.destroy({ truncate: { cascade: true }  })
    })
    .then(_=> {
        done()
        return Question.destroy({ truncate: { cascade: true }  })
    })
    .then(_=> {
        done()
        return Score.destroy({ truncate: { cascade: true }  })
    })
    .then(_=> {
        done()
    })
    .catch(err => {
        done(err)
    })
})

describe('Register Student', () => {
    describe('Success Register Student', () => {
        test('Should return status 201 and Object Student', (done) => {
            request(app)
            .post('/register/'+token)
            .send({
                name: "Andri",
                address: "Jakarta",
                birthdate: "01-01-1444",
                email: "a44@mail.com",
                password: "444444"
            })
            .end((err, res) => {
                if (err)throw err;
                else{
                    expect(res.status).toBe(201);
                    expect(res.body).toHaveProperty('id')
                    expect(res.body).toHaveProperty('email')
                    expect(res.body).not.toHaveProperty('password')
                    done()
                }
            })
        })
    })

    describe('Fail Register Student', () => {
        test('Should return status 400, email already used', (done) => {
            request(app)
            .post('/register/'+token)
            .send({
                name: "Andri",
                address: "Jakarta",
                birthdate: "1-1-1444",
                email: "deadea@mail.com",
                password: "444444",
            })
            .end((err, res) => {
                if (err)throw err;
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "email already used")
                    done()
                }
            })
        })

        test('Should return status 400, message name is require', (done) => {
            request(app)
            .post('/register/'+token)
            .send({
                name: "",
                address: "Jakarta",
                birthdate: "1-1-1444",
                email: "a44@mail.com",
                password: "444444",
            })
            .end((err, res) => {
                if (err)throw err;
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "name is require")
                    done()
                }
            })
        })

        test('Should return status 400, message address is require', (done) => {
            request(app)
            .post('/register/'+token)
            .send({
                name: "Andri",
                address: "",
                birthdate: "1-1-1444",
                email: "a44@mail.com",
                password: "444444",
            })
            .end((err, res) => {
                if (err)throw err;
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "address is require")
                    done()
                }
            })
        })

        test('Should return status 400, message birthdate is require', (done) => {
            request(app)
            .post('/register/'+token)
            .send({
                name: "Andri",
                address: "Jakarta",
                birthdate: "",
                email: "a44@mail.com",
                password: "444444",
            })
            .end((err, res) => {
                if (err)throw err;
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "birthdate is require")
                    done()
                }
            })
        })

        test('Should return status 400, message invalid email format', (done) => {
            request(app)
            .post('/register/'+token)
            .send({
                name: "Andri",
                address: "Jakarta",
                birthdate: "1-1-1444",
                email: "",
                password: "444444",
            })
            .end((err, res) => {
                if (err)throw err;
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "invalid email format")
                    done()
                }
            })
        })

        test('Should return status 400, message password is require or should be 5 and 32 characters', (done) => {
            request(app)
            .post('/register/'+token)
            .send({
                name: "Andri",
                address: "Jakarta",
                birthdate: "1-1-1444",
                email: "a44@mail.com",
                password: "",
            })
            .end((err, res) => {
                if (err)throw err;
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "password should be 5 and 32 characters")
                    done()
                }
            })
        })

    })
})

describe('Login Student', () => {
    describe('Success Login Student', () => {
        test('Should return status 200 and access_token', (done) => {
            request(app)
            .post('/login')
            .send({
                email: dataStudent.email,
                password: dataStudent.password
            })
            .end((err, res) => {
                if (err)throw err
                else{
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveProperty("access_token")
                    done()
                }
            })
        })
    })
 
    describe('Fail Login Student', () => {
        test('Should return status 400 and invalid message', (done) => {
            request(app)
            .post('/login')
            .send({
                email: "",
                password: dataStudent.password
            })
            .end((err, res) => {
                if (err)throw err
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "invalid email / password")
                    done()
                }
            })
        })
        test('Should return status 400 and invalid message', (done) => {
            request(app)
            .post('/login')
            .send({
                email: dataStudent.email,
                password: ""
            })
            .end((err, res) => {
                if (err)throw err
                else{
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "invalid email / password")
                    done()
                }
            })
        })
    })
})

describe('Get Lesson', () => {
    describe('Success find  all lesson', () => {
        test('Should return status 200 and return array of object', (done) => {
            request(app)
            .get(`/lessons`)
            .send({
                TeacherId: newTeacher.id
            })
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(200);
                    expect.arrayContaining(newLesson)
                    done()
                }
            })
        })
    })
    describe('Fail find  all lesson', () => {
        test('Should return status 400', (done) => {
            request(app)
            .get(`/lessons`)
            .send({
                TeacherId: newTeacher.id+1
            })
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "not found!")
                    done()
                }
            })
        })
    })
})

describe('Get Course', () => {
    describe('Success get course', () => {
        test('Should return status 200 and object', (done) => {
            request(app)
            .get(`/lessons/${newLesson.id}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(200);
                    expect.objectContaining(newCourse)
                    done()
                }
            })
        })
    })
    describe('Fail get course', () => {
        test('Should return status 400 and message not found!', (done) => {
            request(app)
            .get(`/lessons/${newLesson.id+1}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "not found!")
                    done()
                }
            })
        })
    })
})

describe('Get Quiz', () => {
    describe('Success find  Quiz', () => {
        test('Should return status 200 and return array of object', (done) => {
            request(app)
            .get(`/quiz/${newCourse.id}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(200);
                    expect.arrayContaining(newQuiz)
                    done()
                }
            })
        })
    })
    describe('Fail find Quiz', () => {
        test('Should return status 400 and message not found', (done) => {
            request(app)
            .get(`/quiz/${newCourse.id+1}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "not found!")
                    done()
                }
            })
        })
    })
})

describe('Get Question', () => {
    describe('Success get question', () => {
        test('Should return status 200 and object', (done) => {
            request(app)
            .get(`/questions/${newQuiz.id}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(200);
                    expect.objectContaining(newQuestion)
                    done()
                }
            })
        })
    })
    describe('Fail get question', () => {
        test('Should return status 400 and message not found!', (done) => {
            request(app)
            .get(`/questions/${newQuiz.id+1}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "not found!")
                    done()
                }
            })
        })
    })
})

describe('Answer Question', () => {
    describe('Right Answer', () => {
        test('should return status 200 and return object', (done) => {
            request(app)
            .post(`/answer/${newQuestion.id}`)
            .send({
                answer: newQuestion.answer,
                StudentId: newStudent.id,
                QuizId: newQuestion.quizId
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                } else {
                    expect(res.status).toBe(200)
                    expect.objectContaining({score: 1})
                    done()
                }
            })
        })
    })

    describe('Not Right Answer', () => {
        test('should return status 200 and return object', (done) => {
            request(app)
            .post(`/answer/${newQuestion.id}`)
            .send({
                answer: newQuestion.answer+"nope" ,
                StudentId: newStudent.id,
                QuizId: newQuestion.quizId
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                } else {
                    expect(res.status).toBe(200)
                    expect.objectContaining({score: 0})
                    done()
                }
            })
        })
    })
})

describe('Get Scores', () => {
    describe('Success find  Scores', () => {
        test('Should return status 200 and return array of object', (done) => {
            request(app)
            .get(`/scores/${newStudent.id}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(200);
                    expect.arrayContaining()
                    done()
                }
            })
        })
    })
    describe('Fail find  all lesson', () => {
        test('Should return status 400', (done) => {
            request(app)
            .get(`/scores/${newStudent.id+1}`)
            .end((err, res) =>{
                if (err)throw err;
                else {
                    expect(res.status).toBe(400);
                    expect(res.body).toHaveProperty("message", "not found!")
                    done()
                }
            })
        })
    })
})