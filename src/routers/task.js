const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/tasks')

//Task api

//posting tasks to database
router.post('/tasks', auth, async(req,res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e) {
        res.status(400).send(e)
    }
})



//finding/getting all tasks
router.get('/tasks', auth,  async (req,res) => {
    const match = {}
    
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1: 1
    }

  try{
    //const task = await Task.find({owner : req.user._id})
    await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit : parseInt(req.query.limit), 
                skip : parseInt(req.query.skip),
                sort
            }
    }).execPopulate()
    res.status(200).send(req.user.tasks)
  }catch(e){
    res.status(500).send(e)
  }
})


//finding/getting tasks by id
router.get('/tasks/:id', auth, async (req,res) =>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})


//updating tasks
router.patch('/tasks/:id', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedTasks = ['description', 'completed']
    const myUpdates = updates.every((update) => allowedTasks.includes(update))

    if(!myUpdates){
        return res.status(404).send('Invalid Input')
    }
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
        if(!task) {
            return res.status(404).send('Task not found')
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task) 

    }catch(e) {
        return res.status(500).send(e)
    }
})

//deleting task
router.delete('/tasks/:id', auth,  async (req, res) =>{

    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner : req.user._id} )

        if(!task) {
            return res.status(404).send('Task not found')
        }
        res.status(200).send(task)

    }catch(e) {
        res.status(500).send()
    }
})



module.exports = router