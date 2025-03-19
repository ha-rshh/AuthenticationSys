import mongoose from "mongoose";

import dotenv from "dotenv"
dotenv.config()


// export a function that connects to db

const db = () =>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to MongoDB")
    })
    .catch((err)=>{
        console.log("Error Connectiing to MongoDB")
    })
}

export default db

