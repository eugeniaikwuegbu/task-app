const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')


const app = express()
const port = process.env.PORT


//parses incoming json to an obect so it can be accessed in the request body
app.use(express.json())     

app.use(taskRouter)
app.use(userRouter)


//Listening on port
app.listen(port, () => {
    console.log(`server is up on port ${port}`)
}) 


