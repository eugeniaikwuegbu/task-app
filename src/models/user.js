const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')



const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
        trim : true
    },
    age :{
        type: Number,
        default : 0,
        validate(age){
            if(age < 0){
                throw new Error('Age must be a Positive number')
            }
        }
    },
    email:{
        type: String,
        required : true,
        unique: true,
        lowercase: true,
        trim : true,
        validate(email) {
            if(!validator.isEmail(email)){
                throw new Error ('Email is not valid')
            }
        }
    },
    password:{
        type : String,
        required : true,
        trim : true,
        minlength: 6,
        validate(password){
            if(password.toLowerCase().includes('password')){
                throw new Error('Password must not include "password"')
            }
        }

    },
    tokens: [{
        token : {
            type: String,
            required : true
        }
    }], avatar: {
        type: Buffer
    }
},{
    timestamps : true
})

userSchema.virtual('tasks', {
    ref : 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}


// userSchema.methods.getPubProfile = function (){
//     const user = this
//     const userObj = user.toObject()

//     delete userObj.password
//     delete userObj.tokens

//     return userObj
// }

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({id: user._id.toString()}, process.env.JWT_TOKEN)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByDetails = async(email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw new Error('Unable to login')
    }

    return user
}


userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


//Deleting user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner : user._id})
    next()
})


//Defining the user model
const User = mongoose.model('User', userSchema )



module.exports = User