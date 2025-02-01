import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <h1 className="text-xl font-bold">404</h1>
      <p className="text-xl font-semibold">Page not found</p>
      <button className="btn btn-primary m-2" onClick={handleClick}>
        Login
      </button>
      
    </div>
  );
}

export default NotFound;
