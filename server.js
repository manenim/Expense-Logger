import express from "express";
import mongoose from "mongoose";
import router from './routes/route.js';
import cors from "cors";
const app = express()
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT || 7000

const server = async () => {
    try {
    const con = mongoose.connect(process.env.MONGO_URI)
    console.log("connected")

    } catch (error) {
        console.log(error)
    }
}

    
const start = async () => {
    try {
        await server()

        app.use(cors());
        app.use(express.json());
        app.use("/api", router)
        app.get('/', (req, res) => res.json('Hello World!'))
        app.listen(port, () => console.log(`app listening on port ${port}!`))
    } catch (error) {
        console.log(error)
    }
}


start()