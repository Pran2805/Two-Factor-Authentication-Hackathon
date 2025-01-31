import jwt from "jsonwebtoken"
import { User } from "../module/user.module.js";

export const protectedRoute = async(req, res, next)=>{
    try {
        const token = req.cookies.auth;
    
        if(!token){
            return res.status(400).json({
                message: "Unauthorized Request",
                userMessage: "User is not Logged in"
            })
        }
    
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)
        
        const user = await User.findOne({
            _id: decodedToken.userID
        })
    
        if(!user){
            return res.status(400).json({
                message: "Unauthorized Request",
                userMessage: "User is not found"
                })
        }
    
        req.user = user;
    
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}