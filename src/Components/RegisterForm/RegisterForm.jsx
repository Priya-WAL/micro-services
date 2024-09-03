import React from "react";
import '../LoginForm/LoginForm'
import { FaUser, FaLock, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

const initialValues = {
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
}

const onSubmit = values => {
    console.log(values)
}

const validate = values => {
    let errors = {}
    if (!values.userName) {
        errors.userName = 'UserName is Required'
    }
    if (!values.email) {
        errors.email = 'Email is Required'
    } else if (!values.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        errors.email = 'Enter a valid email'
    }
    if (!values.phoneNumber) {
        errors.phoneNumber = 'Phone Number is required'
    } else if (!values.phoneNumber.match(/^[6-9]\d{9}$/)) {
        errors.phoneNumber = 'Enter a valid Phone Number'
    }
    if (!values.password) {
        errors.password = 'Password is required'
    } else if (values.password.length < 8) {
        errors.password = 'Password must have 8 characters'
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required'
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords must match'
    }
    return errors
}


const RegisterForm = () => {

    let formik = useFormik({
        initialValues,
        onSubmit,
        validate
    })

    return (
        <div className='Container'> 
        <form onSubmit={formik.handleSubmit}>
            <h1> Register </h1>
            <div className= "input-box">
                <input type="text" placeholder="UserName" required name="userName" onChange={formik.handleChange} value={formik.values.userName} onBlur={formik.handleBlur}/>
                <FaUser className= 'icon' />
                {formik.touched.userName && formik.errors.userName ? <div className="error">{formik.errors.userName}</div> : null}
            </div>
            <div className= "input-box">
                <input type="email" placeholder="Email" required name = 'email' onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur}/>
                <MdEmail className= 'icon' />
                {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
            </div>
            <div className= "input-box">
                <input type="tel" placeholder="Phone Number" required name='phoneNumber' onChange={formik.handleChange} value={formik.values.phoneNumber} onBlur={formik.handleBlur}/>
                <FaPhoneAlt className= 'icon' />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className="error">{formik.errors.phoneNumber}</div> : null}
            </div>
            <div className= "input-box">
                <input type="password" placeholder="Password" required name='password' onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur}/>
                <FaLock className= 'icon' />
                {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
            </div>
            <div className= "input-box">
                <input type="password" placeholder="Confirm Password" required name='confirmPassword' onChange={formik.handleChange} value={formik.values.confirmPassword} onBlur={formik.handleBlur}/>
                <FaLock className= 'icon' />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="error">{formik.errors.confirmPassword}</div> : null}
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