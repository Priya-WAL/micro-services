import React from "react";
import './LoginForm.css'
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { useFormik } from "formik";


const initialValues = {
    email: '',
    password: ''
}

const onSubmit = values => {
    console.log('Form data', values)
}

const validate = values => {
    let errors = {}
    if (!values.email) {
        errors.email = 'Email Required'
    } else if (!values.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        errors.email = 'Enter a valid email'
    }
    if (!values.password) {
        errors.password = 'Password Required'
    }
    return errors
}


const LoginForm = () => {
    const formik = useFormik({
        initialValues,
        onSubmit,
        validate 
    })

    console.log(formik.touched)
    return (
        <div className='Container'> 
        <form onSubmit={formik.handleSubmit}>
            <h1> Login </h1>
            <div className= "input-box">
                <input type="email" placeholder="Email" name="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur}/>
                <MdEmail className= 'icon' />
                {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null }
            </div>
            <div className= "input-box">
                <input type="password" placeholder="Password" name="password" onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur}/>
                <FaLock className= 'icon' />
                {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null }
            </div>
            <div className="remember-forgot">
                <label> <input type = "checkbox" /> Remember Me </label>
                <a href= "#"> Forgot Password?</a>
            </div>

            <button type = "submit"> Login </button>

            <div className="register-link">
                <p> Don't have an account? <Link to="/register"> Register</Link></p>
            </div>

        </form>
        </div>
    )
}

export default LoginForm