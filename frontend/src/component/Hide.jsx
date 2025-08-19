import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


import image3 from '../assets/imageslide/image3.png';
import image5 from '../assets/imageslide/image5.png';
import image6 from '../assets/imageslide/image6.png';
import image7 from '../assets/imageslide/image7.png';


// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <div 
    onClick={onClick} 
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
  >
    <FaChevronRight className="text-xl text-gray-800" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div 
    onClick={onClick} 
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
  >
    <FaChevronLeft className="text-xl text-gray-800" />
  </div>
);

const Hide = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const images = [image6, image3, image5, image7];

  return (
    <div className="w-full relative overflow-hidden">
      <Slider {...settings}>
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <motion.img
              src={img}
              alt={`slide-${index}`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full sm:h-[200px] md:h-[300px] lg:h-[400px] object-cover rounded-xl"
            />
          </motion.div>
        ))}
        
      </Slider>
     
    </div>
  );
};

export default Hide;
