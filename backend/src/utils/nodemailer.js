import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { OTPModel } from "./models/otp.model.js"; // Import OTP schema

dotenv.config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate a secure OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
export async function sendOTP(email) {
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10); // Hash OTP before saving

    await OTPModel.create({ email, otp: hashedOTP, expiresAt: Date.now() + 5 * 60 * 1000 });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your 2FA OTP Code",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
}
