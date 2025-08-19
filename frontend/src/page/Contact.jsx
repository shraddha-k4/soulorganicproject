import React, { useState } from 'react';
import { motion } from 'framer-motion';
import contact from '../assets/images/contact.png'; 
import Footer from './Footer.jsx';

// Animation Variants
const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert('Thank you! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
    <div
      className="bg-cover bg-center bg-no-repeat  px-4 py-12 md:px-6 lg:px-12 text-gray-900"
      style={{
        backgroundImage: `url(${contact})`,
      }}
    >
      <motion.div
        // className="max-w-6xl mx-auto bg-white/30 p-8 rounded-2xl shadow-lg"
        // initial="hidden"
        // whileInView="visible"
        // viewport={{ once: true }}
        // variants={fadeInUp}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          variants={fadeInUp}
        >
          Contact <span className="text-green-600">Us</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form - Left Side */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/60 p-6 rounded-xl shadow-md"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </motion.form>

          {/* Contact Info - Right Side */}
          <motion.div
            className="flex flex-col justify-center space-y-6 bg-green-100/60 p-6 rounded-xl shadow-md"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-semibold text-green-700">Reach Us</h2>
            <p>
              <span className="font-medium">📍 Address:</span> SOULorganic HQ, Green Street, Pune, MH 411001
            </p>
            <p>
              <span className="font-medium">📞 Phone:</span> +91 98765 43210
            </p>
            <p>
              <span className="font-medium">✉️ Email:</span> support@soulorganic.in
            </p>
            <p>
              <span className="font-medium">🕒 Working Hours:</span> Mon - Fri, 9 AM to 6 PM
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
    <Footer/>
    </>
  );
};

export default Contact;


