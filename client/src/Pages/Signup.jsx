import { MessageSquareIcon, Eye } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/auth.store" // Import Zustand store

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Zustand function to set email
  const setEmailGlobal = useAuthStore((state) => state.setEmail);

  const onEyeClick = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/user/register", 
        { name, email, password },
        { withCredentials: true }
      );

      // Store only email in Zustand store
      setEmailGlobal(email);

      navigate("/verifyotp");
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Signup failed");
      } else if (error.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-100">
      <div className="max-w-md p-6 shadow-primary shadow-lg rounded-md w-96 bg-base-200">
        <div className="flex justify-center">
          <div className="size-12 flex justify-center items-center bg-base-300 rounded-md">
            <MessageSquareIcon className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Signup</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Name</label>
            <input
              placeholder="Name"
              type="text"
              className="input input-bordered w-full mt-1"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Email</label>
            <input
              placeholder="Email"
              type="email"
              className="input input-bordered w-full mt-1"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full mt-1 pr-10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Eye
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={onEyeClick}
              />
            </div>
          </div>

          <button className="btn btn-primary w-full" role="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
