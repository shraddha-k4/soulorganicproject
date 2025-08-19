import React, { useState } from "react";
import axios from "axios";
import { Auth_signup_Api } from "../api/ApiEndPoints.jsx";
import { motion } from "framer-motion";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileno: "",
    role: "customer",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(Auth_signup_Api, formData);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <motion.div
      className="max-w-sm mx-auto p-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Sign Up</h2>

      {error && (
        <motion.p
          className="text-red-500 text-sm text-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
      {message && (
        <motion.p
          className="text-green-600 text-sm text-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message}
        </motion.p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <motion.input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <motion.input
          type="password"
          name="password"
          placeholder="Password (min 8 chars)"
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <motion.input
          type="number"
          name="mobileno"
          placeholder="Mobile No"
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <motion.select
          name="role"
          onChange={handleChange}
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-2 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
        </motion.select>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
        >
          Sign Up
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SignupForm;
