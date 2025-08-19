import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { Link } from "react-router";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const iconVariants = {
  float: {
    y: [0, -5, 0],
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
  },
};

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-cover bg-center bg-no-repeat text-black px-6 py-12"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1650&q=80')`,
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white/70 backdrop-blur-md p-6 rounded-lg max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 shadow-md"
      >
        {/* Company Info */}
        <motion.div variants={sectionVariants} custom={0}>
          {/* <h1 className="text-2xl font-bold mb-3 text-green-900">SOUL organic</h1> */}
          <Link to="/"> <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold text-2xl">SOUL</span>
            <span className="text-green-600 font-semibold">Organic</span>
          </div></Link>
          <p className="font-semibold">
            Your trusted destination for organic and eco-friendly products.
          </p>
          <p className="mt-2 text-sm">123 SOUL organic, Style City, NY 10001</p>
          <p className="text-sm">Email: support@SOULorganic.com</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={sectionVariants} custom={1}>
          <h2 className="text-lg font-semibold mb-3 text-green-800">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-green-900 transition">Shop</li>
            <Link to='/about'><li className="hover:text-green-900 transition">About Us</li></Link>
            <Link to='/contact'><li className="hover:text-green-900 transition">Contact</li></Link>
            <li className="hover:text-green-900 transition">Privacy Policy</li>
          </ul>
        </motion.div>

        {/* Social Icons */}
        <motion.div variants={sectionVariants} custom={2}>
          <h2 className="text-lg font-semibold mb-3 text-green-800">Follow Us</h2>
          <div className="flex items-center space-x-4 text-green-900 text-xl">
            {[faFacebookF, faInstagram, faTwitter, faLinkedin].map((icon, i) => (
              <motion.a
                key={i}
                href="#"
                variants={iconVariants}
                animate="float"
                whileHover={{ scale: 1.2 }}
                className="transition"
              >
                <FontAwesomeIcon icon={icon} />
              </motion.a>
            ))}
          </div>
          <p className="mt-2 text-sm">Join us here</p>
        </motion.div>

        {/* Newsletter */}
        <motion.div variants={sectionVariants} custom={3}>
          <h3 className="text-xl font-semibold text-green-900">Stay in the Loop</h3>
          <p className="mt-2 text-sm">Subscribe for offers, giveaways & more!</p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 rounded-l-md text-black focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 rounded-r-md hover:scale-80 hover:bg-green-700 transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </motion.div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className=" text-xl font-semibold text-black mt-8"
      >
        &copy; {new Date().getFullYear()} SOUL organic. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
