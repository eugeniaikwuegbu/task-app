const app = require('./app')
const port = process.env.PORT


//Listening on port
app.listen(port, () => {
    console.log(`server is up on port ${port}`)
}) 


