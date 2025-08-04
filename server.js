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

// MongoDB Connection with the working connection string
const MONGODB_URI = "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log("🔗 Connecting to MongoDB...");
console.log("📊 Connection string:", MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Database Connected Successfully");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
    console.log("🌐 Host:", mongoose.connection.host);
  })
  .catch((error) => {
    console.log("❌ Database Connection Failed:", error.message);
    console.log("🔧 Please check your MongoDB credentials and network connection");
    process.exit(1);
  });

app.listen(1080, () => {
  console.log("🚀 Server is running on port 1080");
});