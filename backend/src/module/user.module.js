import mongoose, { model, Schema } from "mongoose"


const userSchema = new Schema({
   
    username:{
        type: String,
        
    },
    email: {
        type: String,
        require:true
        
    },
    password: {
        type: String,
       
    },
    otp:{
        type:String

    }
    
   
}, {
    timestamps: true
})

export const User = model('User', userSchema)