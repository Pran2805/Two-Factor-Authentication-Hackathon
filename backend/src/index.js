import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js";
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import { User } from "./module/user.module.js";


dotenv.config({
    path:'./.env'
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(helmet())
app.use(cookieParser())


import userRoutes from './routes/user.route.js'
app.use("/api/user", userRoutes)

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
    connectDB()
})