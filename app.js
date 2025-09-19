require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes")
const connectionRoutes = require("./routes/connectionRoutes")
const cookieParser = require("cookie-parser")


const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();


app.use("/api/auth",authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/connection", connectionRoutes)


app.listen(process.env.PORT || 3001 ,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
