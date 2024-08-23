import React from "react";
import './LoginForm.css'
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const LoginForm = () => {
    return (
        <div className='Container'> 
        <form action="">
            <h1> Register </h1>
            <div className= "input-box">
                <input type="text" placeholder="Name" required />
                <FaUser className= 'icon' />
            </div>
            <div className= "input-box">
                <input type="text" placeholder="UserName" required />
                <FaUser className= 'icon' />
            </div>
            <div className= "input-box">
                <input type="text" placeholder="Password" required />
                <FaLock className= 'icon' />
            </div>
            <div className= "input-box">
                <input type="text" placeholder="Email" required />
                <MdEmail className= 'icon' />
            </div>
            <div className="remember-forgot">
                <label> <input type = "checkbox" /> Remember Me </label>
                <a href= "#"> Forgot Password?</a>
            </div>

            <button type = "submit"> Login </button>

            <div className="register-link">
                <p> Don't have an account? <a href= "#"> Register</a></p>
            </div>

        </form>

        </div>
    )
}

export default LoginForm