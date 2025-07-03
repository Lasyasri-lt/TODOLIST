import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 import icons

const Signup = ({ onSignup, goToLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // 👈 track visibility
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Email validation
    if (name === "email") {
      if (value && !value.endsWith("@gmail.com")) {
        setEmailError("Email entered is invalid");
      } else {
        setEmailError("");
      }
    }

    // Password validation
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
    if (emailError || passwordError) return;
    try {
      const res = await axios.post("http://localhost:8080/auth/signup", form);
      if (res.data.includes("Signup Successful")) {
        setSuccessMessage("✅ Signup Successful!");
        setForm({ name: "", email: "", password: "" }); // Clear form
        setTimeout(() => {
          onSignup(); // Navigate to login if needed
        }, 3000);
      } else {
        setSuccessMessage(res.data); // Email already exists
      }
    } catch (err) {
      setSuccessMessage("❌ Signup failed");
    }
  };
    return (
    <div className="signup-wrapper">
      <div className="overlay" />
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
{emailError && <div className="input-error">{emailError}</div>}

        {/* Password with Eye icon */}
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
              cursor: "pointer"
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Signup</button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <button type="button" className="link-button" onClick={goToLogin}>
            Login
          </button>
        </p>

        {successMessage && (
          <div className="input-success" style={{ marginTop: "10px", color: "white" }}>
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
