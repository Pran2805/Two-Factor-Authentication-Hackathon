import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure each email can only have one OTP at a time
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,  // Automatically create createdAt and updatedAt fields
});

// Create OTP model
const OTPModel = mongoose.model("OTP", otpSchema);

export { OTPModel };
