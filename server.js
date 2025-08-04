require('dotenv').config();
const express = require ("express")
const mongoose = require ("mongoose")
const cors = require ("cors")
const app = express()
app.use(express.json())
app.use(cors())

const userRouter = require("./Routes/userRouter")
const businessRouter = require("./Routes/businessRouter")
const adminRouter = require("./Routes/adminRouter")
app.use(userRouter)
app.use(businessRouter)
app.use('/api/admin', adminRouter)
mongoose.connect("mongodb+srv://onlinebusinessr205:PzLXaCD2hsyCoMz8@business.i9x2ukr.mongodb.net/?retryWrites=true&w=majority&appName=business").then(()=>{
    console.log("Database Connected SuccessFully")
})
app.listen(1080,()=>{
console.log("Server is running on port 1080")
})