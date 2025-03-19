import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"; // sometimes you have to mention the extension 
//import all routes
import userRoutes from "./routes/user.routes.js"



dotenv.config() // if you have your env is in root, if it's not then give path inside config

const app = express()

app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json()) // if the request is in jason
app.use(express.urlencoded({extended:true}))  // if request is in special char

const port = process.env.PORT || 4000; //

// sending request
app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/harsh", (req, res) => {
    res.send("Hello harsh")
})

// connect to db
db();

// user routes
app.use("/api/v1/users/", userRoutes)


// listening to port 3000
app.listen(port, () => {
    console.log(`My app listening on PORT ${port}`)
})