const supertest = require('supertest')
const app = require('../src/app')
const Tasks = require('../src/models/tasks')
const {userOne, userTwo, taskOne, taskTwo, taskThree, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)


test('Should create task for user', async() => {
    const response = await supertest(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
    .send({
        description : 'Go home'
    })
    .expect(201)
    const task = await Tasks.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should get all userOne Tasks', async () => {
    const response = await supertest(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    
    expect(response.body.length).toBe(2)
})


test('Should not be able to delete tasks if not owned', async () =>{
    const response = await supertest(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
    const task = await Tasks.findById(taskOne._id)
    expect(task).not.toBeNull()
    //expect(taskOne._id).not.toBeNull()
})