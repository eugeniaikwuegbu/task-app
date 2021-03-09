const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Tasks = require('../../src/models/tasks')



const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id : userOneId,
    name : 'Eugenia Ikwuegbu',
    email : 'eugenianenye@gmail.com',
    password : 'helloworld1234',
    tokens: [{
        token : jwt.sign({_id:userOneId}, process.env.JWT_TOKEN)
    }]

}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id : userTwoId,
    name : 'Eugenia Ify',
    email : 'eugenia@gmail.com',
    password : 'helloworld1234',
    tokens: [{
        token : jwt.sign({_id:userTwoId}, process.env.JWT_TOKEN)
    }]
}


const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description : 'First Task',
    completed : false,
    owner : userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Second Task Task',
    completed : true,
    owner : userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Third Task',
    completed : true,
    owner : userTwo._id
}


const setUpDatabase = async () => {
    await User.deleteMany()
    await Tasks.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Tasks(taskOne).save()
    await new Tasks(taskTwo).save()
    await new Tasks(taskThree).save()
}


module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase
}