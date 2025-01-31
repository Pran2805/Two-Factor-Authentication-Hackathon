import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {User} from "../module/user.module.js";
import crypto from "crypto"; 
import {generateToken} from "../utils/tokenUtils.js"
import { options } from "../constants.js";
const generateOtp = () => crypto.randomInt(100000, 999999).toString();


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

    
        const otp = generateOtp();

     
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
            otpAttempts: 0, 
        });

        await newUser.save();


        setTimeout(async () => {
            const user = await User.findOne({ email });
            if (user && user.otp) {
                await User.deleteOne({ email });
                console.log(`User ${email} deleted due to OTP expiration.`);
            }
        }, 60 * 1000);

        res.status(201).json({ message: "If your email exists, an OTP was sent. Verify within 1 minute." , otp: otp});
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found or deleted due to OTP expiration." });
        }

     
        if (user.otpAttempts >= 3) {
            await User.deleteOne({ email });
            return res.status(400).json({ message: "Too many failed attempts. Please try again later." });
        }

     
        if (!user.otp || user.otpExpires < new Date()) {
            user.otp = null;
            user.otpExpires = null;
            user.otpAttempts = 0;
            await user.save();
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (user.otp !== otp) {
            user.otpAttempts += 1;
            await user.save();
            return res.status(400).json({ message: `Invalid OTP. ${3 - user.otpAttempts} attempts left.` });
        }

      
        user.otp = null;
        user.otpExpires = null;
        user.otpAttempts = 0;
        await user.save();

        const token = await generateToken(user._id)
        res.cookie("auth", token, options)
        res.status(200).json({ message: "OTP verified. Registration complete." });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "OTP verification failed. Please try again later." });
    }
};


import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts from this IP, please try again after 15 minutes",
  standardHeaders: true, 
  legacyHeaders: false, 
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    loginLimiter(req, res, async () => {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = await generateToken(user._id);

      res.cookie("auth", token, options);
      res.status(200).json({ message: "Login successful" });
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};




export const logout = (req, res) => {
    try {
    
        res.clearCookie("auth")

      
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
};