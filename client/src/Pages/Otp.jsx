import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import useAuthStore from "../Store/auth.store";
import { useNavigate } from "react-router-dom";

function Otp() {
  const [otp, setOtp] = useState('');
  const email = useAuthStore((state) => state.email); // Get stored email from Zustand
  const navigate = useNavigate();

  const verifyOtp = async (event) => {
    event.preventDefault(); 
    if (!email) {
      console.error("No email found in global state!");
      return;
    }

    try {
      const res = await axiosInstance.post('/verifyOtp', { email, otp });
      console.log('OTP Verification Response:', res.data);
      navigate("/logout"); // Corrected Navigate function
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-100">
      <div className="max-w-md shadow-primary shadow-lg rounded-md w-auto bg-base-200 h-[500px] flex flex-col justify-center">
        <div className="flex justify-center mb-4">
          <Mail size={40} />
        </div>

        <div className="text-center text-xl font-semibold mb-4">OTP Verification</div>
        <div className="text-center text-sm mb-4">
          <p>One-time password has been sent to your email <strong>{email || "your email"}</strong></p>
        </div>
        <div className="text-center text-sm mb-6">Enter the OTP below to verify it:</div>

        <form onSubmit={verifyOtp}>
          <div className="flex justify-center">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border-2 p-2 w-24 text-center rounded-md"
              placeholder="Enter OTP"
              required
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button type="submit" className="btn btn-primary">Verify</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Otp;
