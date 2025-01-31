import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {User} from "../module/user.module.js";
import crypto from "crypto"; // To generate a random OTP
import {generateToken} from "../utils/tokenUtils.js"
import { options } from "../constants.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = crypto.randomInt(100000, 999999).toString();

        const otpExpires = new Date(Date.now() + 1 * 60 * 1000);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        await newUser.save();

        setTimeout(async () => {
            const user = await User.findOne({ email });
            if (user && user.otp) {
                await User.deleteOne({ email });
                console.log(`User ${email} deleted due to OTP expiration.`);
            }
        }, 60 * 1000); 
        res.status(201).json({ message: "User registered successfully. Verify OTP within 1 minute.", otp });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found or deleted due to OTP expiration" });
        }

        if (!user.otp || user.otp !== otp || user.otpExpires < new Date()) {
            await User.deleteOne({ email }); 
            return res.status(400).json({ message: "Invalid or expired OTP. User deleted." });
        }

        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const token = await generateToken(user._id);

        res
        .cookie("auth", token, options)
        .status(200)
        .json({ message: "OTP verified. Registration complete." });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "OTP verification failed" });
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

    // Check if rate limiting is in effect for this IP
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




// controll log out function with clear cookies
export const logout = (req, res) => {
    try {
        // Clear the auth token cookie
        res.clearCookie("auth")

        // Send a success response
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
};
