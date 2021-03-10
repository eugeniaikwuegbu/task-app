const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {welcomeEmail, cancelEmail} = require('../emails/accounts')


//Users api

//Create a new user
router.post('/users', async (req, res) =>{
    try{
        const user = new User(req.body)
        welcomeEmail(user.email, user.name)
        const token = await user.generateToken()
        await user.save()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})



//Getting my profile

router.get('/users/me',auth, async(req, res) => {
  res.send(req.user)
   
})


// //getting by id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//            return res.status(404).send('user not found')
//         }
//         return res.send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
    
// })

//logging in
router.post('/users/login', async (req,res) => {
    try{
       const user = await User.findByDetails(req.body.email, req.body.password)
       const token = await user.generateToken()
       res.send({user, token})
    }catch(e) {
       res.status(400).send({Error :'unable to login'})
    }
})


//logging out
router.post('/users/logout', auth, async (req, res) =>{
    try{
        req.user.tokens =  req.user.tokens.filter((tokenData) => {
            return tokenData.token !== req.token
        })

        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()
    }
})

//Logout of ll devices
router.post('/users/logOutAll', auth, async(req,res) => {
    try{
        req.user.tokens = []
        
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


//Update user credentials
router.patch('/users/me', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid Updates'})
    }
    try{

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)

    }catch(e){
        res.status(500).send()
    } 
})


//Deleting a user
router.delete('/users/me', auth,  async (req,res) => {
    try{
         //const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
       await  req.user.remove()
        cancelEmail(req.user.email, req.user.name)
        res.send(req.user)

    }catch(e){
        res.status(500).send()
    }
})


//Endpoint for uploading a profile picture

const upload = multer({
   // dest : 'avatar',
    limits: {
        fileSize : 8000000,
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File format not supported'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    
    res.send()
},(error, req, res, next) => {
    res.status(400).send({error: error.message})
})



router.delete('/users/me/avatar', auth, async(req,res) => {    
    req.user.avatar = undefined
        await req.user.save()
        res.send()        
})

router.get('/users/:id/avatar', async(req,res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send()
    }
})



module.exports = router