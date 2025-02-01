import React, { useState } from 'react';
import { Eye, EyeOff, MessageSquareIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../utils/axiosInstance'
import axios from 'axios';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const navigate = useNavigate();
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
console.log(email, password)

        try {
            const res = await axios.post("http://localhost:8000/api/user/login", { email, password }, { withCredentials: true });

            navigate('/logout');  
            if (res.status === 200) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Login failed");
            }

        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='max-w-md border-2 shadow-md shadow-primary flex flex-col rounded-md p-6'>
                <div className='flex justify-center'>
                    <div className='size-10 bg-base-300 flex items-center justify-center mt-4 rounded-md'>
                        <MessageSquareIcon className='size-7 text-secondary' />
                    </div>
                </div>

                <h2 className='text-center text-2xl font-bold'>Login Page</h2>

                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <div className='flex flex-col p-4'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder='email@gmail.com'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='input input-bordered w-80'
                        />
                    </div>

                    <div className='flex flex-col p-4 relative'>
                        <label htmlFor="password">Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder='password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='input input-bordered pr-10'
                        />
                        <button
                            type="button"
                            className='absolute right-6 top-12 text-gray-500'
                            onClick={handleShowPassword}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <div className='flex items-center justify-center mb-4'>
                        <button className='btn btn-primary w-full' type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
