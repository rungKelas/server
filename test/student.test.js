const request = require('supertest')
const app = require('../app')
const { Student } = require('../models')
const jwt = require('jsonwebtoken')
let token
let access_token
let dataStudent = {
    name: "dea",
    address: "Jakarta",
    birthdate: "1-1-1444",
    email: "deadea@mail.com",
    password: "444444",
    TeacherId: '1'
}
let newStudent

beforeAll(done => {
    token = jwt.sign({
        id: '4',
        email: 'satu@mail.com'
    }, process.env.JWT_TEACHER)
    Student.create(dataStudent)
    .then(data => {
        newStudent = data
        done()
    })
    .catch(err => {
        done(err)
    })
})


afterAll(done => {
    Student.destroy({truncate: true})
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
                    //expect(res.body).not.toHaveProperty('password')
                    done()
                }
            })
        })
    })

    describe('Failed Register Student', () => {
        test('Should return status 400, email must be unique', (done) => {
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
                    expect(res.body).toHaveProperty("message", "email must be unique")
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
    beforeAll(done =>{
        access_token = jwt.sign({
            id: newStudent.id,
            email: dataStudent.email
        }, process.env.JWT_SECRET)
        done()    
    })
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
                    expect(res.body).toHaveProperty("access_token", access_token)
                    done()
                }
            })
        })
    })
})