import React from "react";
import "./LoginForm.css";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

const onSubmit = (values) => {
  console.log("Form data", values);
};

const validate = (values) => {
  let errors = {};
  if (!values.email) {
    errors.email = "Email Required";
  } else if (!values.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    errors.email = "Enter a valid email";
  }
  if (!values.password) {
    errors.password = "Password Required";
  }
  return errors;
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email!")
    .required("Email is Required!"),
  password: Yup.string().required("Password is Required!"),
});

const LoginForm = () => {
  return (
    <div className="Container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <h1> Login </h1>
          <div className="input-box">
            <Field type="email" placeholder="Email" name="email" />
            <MdEmail className="icon" />
            <div className="error">
              <ErrorMessage name="email" />
            </div>
          </div>
          <div className="input-box">
            <Field type="password" placeholder="Password" name="password" />
            <FaLock className="icon" />
            <div className="error">
              <ErrorMessage name="password" />
            </div>
          </div>
          <div className="remember-forgot">
            <label>
              {" "}
              <input type="checkbox" /> Remember Me{" "}
            </label>
            <a href="#"> Forgot Password?</a>
          </div>

          <button type="submit"> Login </button>

          <div className="register-link">
            <p>
              {" "}
              Don't have an account? <Link to="/register"> Register</Link>
            </p>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
