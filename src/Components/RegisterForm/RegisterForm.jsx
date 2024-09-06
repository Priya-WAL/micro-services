import React from "react";
import "../LoginForm/LoginForm";
import { FaUser, FaLock, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
  userName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const onSubmit = (values) => {
  console.log(values);
};

const phoneRegex = /^[6-9]\d{9}$/;
const validationSchema = Yup.object({
  userName: Yup.string().required("UserName is Required!"),
  email: Yup.string()
    .email("Enter a valid email!")
    .required("Email is Required!"),
  phoneNumber: Yup.string()
    .trim()
    .matches(phoneRegex, "Invalid Phone Number!")
    .required("Phone Number is Required!"),
  password: Yup.string()
    .required("Password is Required!")
    .min(8, "Password must have atleast 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const RegisterForm = () => {
  return (
    <div className="Container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <h1> Register </h1>
          <div className="input-box">
            <Field type="text" placeholder="UserName" name="userName" />
            <FaUser className="icon" />
            <div className="error">
              <ErrorMessage name="userName" />
            </div>
          </div>
          <div className="input-box">
            <Field type="email" placeholder="Email" name="email" />
            <MdEmail className="icon" />
            <div className="error">
              <ErrorMessage name="email" />
            </div>
          </div>
          <div className="input-box">
            <Field type="tel" placeholder="Phone Number" name="phoneNumber" />
            <FaPhoneAlt className="icon" />
            <div className="error">
              <ErrorMessage name="phoneNumber" />
            </div>
          </div>
          <div className="input-box">
            <Field type="password" placeholder="Password" name="password" />
            <FaLock className="icon" />
            <div className="error">
              <ErrorMessage name="password" />
            </div>
          </div>
          <div className="input-box">
            <Field
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
            />
            <FaLock className="icon" />
            <div className="error">
              <ErrorMessage name="confirmPassword" />
            </div>
          </div>

          <button type="submit"> Register </button>
          <div className="register-link">
            <p>
              {" "}
              Already have an account? <Link to="/"> Login</Link>
            </p>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterForm;
