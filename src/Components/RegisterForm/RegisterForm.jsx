import React from "react";
import '../LoginForm/LoginForm'
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const RegisterForm = () => {
    return (
        <div className='Container'> 
        <form action="">
            <h1> Register </h1>
            <div className= "input-box">
                <input type="text" placeholder="UserName" required />
                <FaUser className= 'icon' />
            </div>
            <div className= "input-box">
                <input type="text" placeholder="Email" required />
                <MdEmail className= 'icon' />
            </div>
            <div className= "input-box">
                <input type="text" placeholder="Password" required />
                <FaLock className= 'icon' />
            </div>
            <div className= "input-box">
                <input type="text" placeholder="Confirm Password" required />
                <FaLock className= 'icon' />
            </div>
           
            <button type = "submit"> Register </button>
            <div className="register-link">
                <p> Already have an account? <Link to="/"> Login</Link></p>
            </div>

        </form>
        </div>
    )
}

export default RegisterForm