import React from 'react';
import SellerSidebar from './SellerSidebar.jsx';
import SellerNavbar from './SellerNavbar.jsx';
import seller from '../../assets/images/selle.png';

const SellerProfile = () => {
  return (
    <>
      <div className="flex min-h-screen bg-white">
        {/* Sidebar for medium and larger screens */}
        <div className="hidden md:block">
          <SellerSidebar />
        </div>
        {/* Welcome to Seller Profile */}

        {/* Navbar for mobile screens only */}
        <div className="md:hidden w-full">
          <SellerNavbar />

        </div>

        <div className="hidden md:block relative h-screen w-full">
          {/* Background Image */}
          <img
            src={seller}
            alt="seller"
            className="absolute inset-0 sm:w-40 md:w-190 md:h-100 md:object-contain lg:w-full lg:h-full lg:object-cover z-0"
          />

          {/* Gradient Text Overlay */}
          <div className="absolute inset-0 flex z-10 p-4">
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold text-center bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent">
              Welcome to Seller Profile
            </h1>
          </div>
        </div>

      </div>

    </>
  );
};

export default SellerProfile;