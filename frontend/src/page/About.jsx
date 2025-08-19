import React from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer.jsx';

// Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5
    }
  })
};

const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const About = () => {
  return (
    <>
    <div
      className="bg-cover bg-center bg-no-repeat text-gray-800 px-4 py-12 sm:px-6 lg:px-12"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/537432292/photo/young-soybean-plants-growing-in-cultivated-field.jpg?s=612x612&w=0&k=20&c=i8O8R6yQ4hKzX1Ah6SJZmphvwPgnyj-f9X47NDYQOQc=')",
      }}
    >
      <div className="max-w-6xl mx-auto bg-white/20 p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          About   <span className="text-orange-500">SOUL<span className="text-green-600 font-semibold">Organic</span></span>
         
         
        </motion.h1>

        {/* Introduction */}
        <motion.p
          className="text-base md:text-lg text-gray-700 mb-10 text-center max-w-3xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          At <span className="font-semibold">SOULorganic</span>, we’re passionate about bringing you high-quality, organic, and eco-friendly products that support a healthy lifestyle and a greener planet.
        </motion.p>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-3">🌿 Our Mission</h2>
            <p className="text-gray-700">
              To provide sustainable, organic alternatives to everyday products while empowering communities and supporting ethical farming practices.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md"
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-3">🌏 Our Vision</h2>
            <p className="text-gray-700">
              To be a leading force in the global shift toward sustainable living — making eco-conscious choices easy and accessible for everyone.
            </p>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <motion.h2
          className="text-2xl font-semibold mb-8 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Why Choose Us?
        </motion.h2>

        <div className="grid sm:grid-cols-2  md:grid-cols-4 gap-6 text-center">
          {[
            {
              icon: "✅",
              title: "Certified Organic",
              text: "We ensure all products meet strict organic standards.",
            },
            {
              icon: "🚚",
              title: "Fast Delivery",
              text: "Reliable and eco-friendly packaging & shipping.",
            },
            {
              icon: "💚",
              title: "Eco-Conscious",
              text: "We reduce plastic use and support reusables.",
            },
            {
              icon: "⭐",
              title: "Customer Satisfaction",
              text: "Thousands of happy customers across India.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-500"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index + 1}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default About;
