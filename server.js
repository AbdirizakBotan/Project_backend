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
mongoose.connect("mongodb+srv://onlinebusinessr205:VE6F5g0tuYGDUyb7@cluster0.n0gzv4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Database Connected SuccessFully")
})
app.listen(1080,()=>{
console.log("Server is running on port 1080")
})