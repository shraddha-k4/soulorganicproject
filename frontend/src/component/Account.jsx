import React, { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import Footer from "../page/Footer.jsx";

const Account = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-md bg-white rounded-2xl p-6"
        style={{
          boxShadow: "0 0 60px rgba(251, 191, 36, 0.7)" // amber glow all 4 sides
        }}
      >
        {/* Render Login or Signup Form */}
        {isLogin ? <LoginForm /> : <SignupForm />}

        {/* Toggle Button */}
        <div className="text-center mt-6">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </div>
      </motion.div>
    </div>
    <Footer/>
    </>
  );
};

export default Account;
