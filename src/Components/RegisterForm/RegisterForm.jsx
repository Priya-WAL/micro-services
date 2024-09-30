import React, { useEffect, useState } from "react";
import "../LoginForm/LoginForm";
import { FaUser, FaPhoneAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const initialValues = {
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const register = async (data, navigate) => {
  const { confirmPassword, ...dataWithoutPassword } = data;
  dataWithoutPassword.phoneNumber = "+91" + dataWithoutPassword.phoneNumber; // Adding +91 as default country code
  await axios({
    method: "POST",
    url: "http://localhost:3000/user/register",
    data: dataWithoutPassword,
  })
    .then(function (res) {
      console.log(res.data);
      toast.success("Successfully signed up!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    })
    .catch(function (res) {
      console.log(res);
      toast.error("Failed to sign up");
    });
};

const onSubmit = (values, onSubmitProps, navigate) => {
  register(values, navigate);
  onSubmitProps.resetForm();
};

const phoneRegex = /^[6-9]\d{9}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const validationSchema = Yup.object({
  username: Yup.string().required("Username is Required!"),
  email: Yup.string()
    .email("Enter a valid email!")
    .required("Email is Required!"),
  // countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string()
    .trim()
    .matches(phoneRegex, "Invalid Phone Number!")
    .required("Phone Number is Required!"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must have atleast 8 characters, one special character and number"
    )
    .required("Password is Required!")
    .min(8, "Password must have atleast 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  // const [countryCodes, setCountryCodes] = useState([]);

  // Fetch country codes from API
  /* useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countries = response.data.map((country) => ({
          name: country.name.common,
          code: country.idd.root
            ? `${country.idd.root}${
                country.idd.suffixes ? country.idd.suffixes[0] : ""
              }`
            : "N/A",
        }));
        setCountryCodes(countries.filter((country) => country.code !== "N/A"));
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []); */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility for "Password" field
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Toggle password visibility for "Confirm Password" field
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  return (
    <div className="Container-register">
      <div className="Container">
        <ToastContainer />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, onSubmitProps) =>
            onSubmit(values, onSubmitProps, navigate)
          }
        >
          <Form>
            <h1> Register </h1>
            <div className="input-box">
              <Field type="text" placeholder="UserName" name="username" />
              <FaUser className="icon" />
              <div className="error">
                <ErrorMessage name="username" />
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
              <Field
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
              />

              <div className="icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              <div className="error">
                <ErrorMessage name="password" />
              </div>
            </div>
            <div className="input-box">
              <Field
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
              />

              <div className="icon" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              <div className="error">
                <ErrorMessage name="confirmPassword" />
              </div>
            </div>
            <div className="register-link">
              <button type="submit"> Register </button>
            </div>
            <div className="register-link">
              <p>
                Already have an account? <Link to="/"> Login</Link>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;
