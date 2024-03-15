require('dotenv').config()
const express = require('express')
const {connectMongoDb}=require('./connection');
const cookieParser = require('cookie-parser'); 
const authToken= require('./middleware/Authorization')
const userRouter = require('./routes/users.route')
const app =express()

const MONGO_URI=process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;


app.use(cookieParser())
app.use(express.json())


app.use('/users',userRouter)
app.use(authToken)



//DB Connection
connectMongoDb(MONGO_URI)
.then(() => {
    console.log('connected to MongoDB')
    app.listen(4000, ()=> {
        console.log(`Node API app is running on port :${PORT}`)
    });
}).catch((error) => {
    console.log(error)
})

