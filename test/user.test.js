const supertest = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneId, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)



test('Should sign up a new user', async() => {
   const response =  await supertest(app)
    .post('/users')
    .send({
        name: 'Eugenia',
        email : 'nenye@gmail.com',
        password : 'hello1234'
    })
    .expect(201)

// Assert that the database was changed correctly
 const user = await User.findById(response.body.user._id)
 expect(user).not.toBeNull()

//Asertions for response
expect(response.body).toMatchObject({
        user: {
            name: 'Eugenia',
            email : 'nenye@gmail.com',
        },
        token: user.tokens[0].token
    })
expect(user.password).not.toBe('hello1234')
})



test('should login existing user', async() => {
    const response = await supertest(app)
    .post('/users/login')
    .send({
        email : userOne.email,
        password: userOne.password
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})


test('Should not login non-existing user', async() => {
    await supertest(app).post('/users/login').send({
        email : userOne.email,
        password : 'hello1234'
    }).expect(400)
})


// test('Should get user profile', async() =>{
//     await supertest(app)
//     .get('/users/me')
//     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
//     .send()
//     .expect(200)
// })

test('Should not get profile for unauthenticated user', async() => {
    await supertest(app)
    .get('/users/me')
    .send()
    .expect(401)
})

// test('Should delete account for user', async() => {
//     await supertest(app)
//     .delete('/users/me')
//     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//     .send()
//     .expect(200)
// })

// test('Should not delete account for unauthorized user', async() => {
//     await supertest(app)
//     .delete('/users/me')
//     .send()
//     .expect(401)
//     const user = await User.findById(userOneId)
//     expect(user).toBeNull()
// })


// test('Should upload avatar image', async() => {
//    await supertest(app) 
//    .post('/users/me/avatar')
//    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//    .attach('avatar', 'test/fixtures/profile-pic.jpg')
//    .expect(200)

//    const user = await User.findById(userOneId)
//    expect(user.avatar).toEqual(expect.any(Buffer))
// })

test('Should update valid user fields', async() => {
   await supertest(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Chiemeka',
        password: 'chi1234'
    })
    .expect(200)
    const user = User.findById(userOne)
    expect(user.name).toEqual('Chiemeka')
})

test('Should not update invalid user fields', async() => {
    await supertest(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({location: 'Lagos'})
    .expect(400)
})