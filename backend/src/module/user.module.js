import mongoose, { model, Schema } from "mongoose"


const userSchema = new Schema({
   
    username:{
        type: String,
        
    },
    email: {
        type: String,
        require:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
        
    },
    password: {
        type: String,
       
    },
    otp:{
        type:String

    },
    otpAttempts: {
        type: Number,
        default: 0, // OTP attempts start at 0
    },
   
}, {
    timestamps: true
})

export const User = model('User', userSchema)