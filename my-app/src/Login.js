import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ onLogin, goToSignup }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      if (value && !value.endsWith("@gmail.com")) {
        setEmailError("Email entered is invalid");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value.length < 5) {
        setPasswordError("Password must be at least 5 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data && res.data.email && res.data.name) {
        // ✅ Store both name and email
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userName", res.data.name);

        setLoginMessage("✅ Login Successful");

        setTimeout(() => {
          setLoginMessage("");
          onLogin(); // Navigate to TodoMain
        }, 1000);
      } else {
        setLoginMessage("❌ Invalid Credentials");
      }
    } catch (err) {
      console.error("Login Error:", err.response || err.message || err);
      setLoginMessage("❌ Server Error");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="overlay"></div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {emailError && <div className="input-error">{emailError}</div>}

        <div style={{ position: "relative" }}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {passwordError && <div className="input-error">{passwordError}</div>}
          <span
            onClick={togglePassword}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Login</button>

        <div className="signup-redirect">
          <p>
            Don't have an account?{" "}
            <button type="button" className="link-button" onClick={goToSignup}>
              Sign up
            </button>
          </p>
          {loginMessage && <p className="status-message">{loginMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
