import React, { useState, useEffect } from "react";
import axios from "axios";
import { Auth_login_Api, Auth_forgotpass_Api } from "../api/ApiEndPoints.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useContext/AuthProvider.jsx";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();
  const { login, authed, role } = useAuth();

  // ✅ Redirect if already logged in
  //useEffect(() => {
    // if (authed) {
    //   if (role === "seller") {
    //     navigate("/seller/profile");
    //   } else if (role === "customer") {
    //     navigate("/customer-dashboard");
    //   } else {
    //     navigate("/");
    //   }
    // }
  //   if (authed && role === "seller") {
  //     if (window.innerWidth >= 1024) {
  //       // Laptop or desktop
  //       navigate("/seller/profile/user");
  //     } else {
  //       // Mobile or tablet
  //       navigate("/seller/profile");
  //     }
  //   } else if (authed && role !== "seller") {
  //     navigate("/customer-dashboard");
  //   } else {
  //     navigate("/profile");
  //   }

  // }, [authed, role, navigate]);

useEffect(() => {
  if (authed && role === "seller") {
    if (window.innerWidth >= 1024) {
      navigate("/seller/profile/user");
    } else {
      navigate("/seller/profile");
    }
  } else if (authed && role === "customer") {
    navigate("/customer-dashboard");
  }
}, [authed, role, navigate]);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(Auth_login_Api, formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await login(user.role);

      if (user.role === "seller") {
        navigate("/seller/dashboard");
      } else if (user.role === "customer") {
        navigate("/customer-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handlePasswordReset = async () => {
    setResetMessage("");
    try {
      const res = await axios.post(Auth_forgotpass_Api, {
        email: resetEmail,
      });
      setResetMessage(res.data.message);
    } catch (err) {
      setResetMessage(
        err.response?.data?.message || "Failed to send reset link"
      );
    }
  };

  return (
    <motion.div
      className="max-w-sm mx-auto p-4 "
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Login
      </h2>

      {error && (
        <motion.p
          className="text-red-500 text-sm text-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {!showForgot ? (
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
          >
            Log In
          </motion.button>

          <div className="text-center">
            <motion.button
              type="button"
              onClick={() => setShowForgot(true)}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-blue-600 underline"
            >
              Forgot Password?
            </motion.button>
          </div>
        </form>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <motion.button
            onClick={handlePasswordReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600 transition"
          >
            Send Reset Link
          </motion.button>
          {resetMessage && (
            <motion.p
              className="text-sm text-center text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {resetMessage}
            </motion.p>
          )}
          <div className="text-center">
            <motion.button
              onClick={() => setShowForgot(false)}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm underline"
            >
              Back to Login
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoginForm;
