import React, { useState } from "react";
import { motion } from "framer-motion";
import brand1 from "../assets/brandlogo/brand (1).jpeg";
import brand2 from "../assets/brandlogo/brand (2).jpeg";
import brand3 from "../assets/brandlogo/brand (3).jpeg";
import brand4 from "../assets/brandlogo/brand (4).jpeg";
import brand5 from "../assets/brandlogo/brand (5).jpeg";
import brand6 from "../assets/brandlogo/brand (6).jpeg";
import brand7 from "../assets/brandlogo/brand (7).jpeg";

const Brand = () => {
  const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7];
  const [paused, setPaused] = useState(false);

  return (
    <>
      <br />
      <h1 className="font-bold text-3xl md:text-4xl m-3 text-green-700">
        Our Brands
      </h1>

      <div className="relative overflow-hidden w-full py-6 ">
        <motion.div
          className="flex gap-10"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 40, 
            ease: "linear",
          }}
          style={{
            animationPlayState: paused ? "paused" : "running",
          }}
          onMouseEnter={() => setPaused(true)}   // stop on hover
          onMouseLeave={() => setPaused(false)}  // resume
        >
          {[...brands, ...brands].map((brand, index) => (
            <motion.img
              key={index}
              src={brand}
              alt={`brand-${index}`}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain flex-shrink-0 rounded-lg shadow-md"
              whileHover={{ scale: 1.2 }}   // zoom effect
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Brand;
