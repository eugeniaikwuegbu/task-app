const mongoose = require('mongoose')
// require('../db/mongoose')


const taskSchema = new mongoose.Schema({  
description : {
    type: String,
    trim : true,
    required : true,
    unique : true
},
completed : {
    type : Boolean,
    default : false,
},
owner: {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'User'  
}
}, {
    timestamps : true
})



//Defining models
const Tasks = mongoose.model('Tasks', taskSchema)




module.exports = Tasks