
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBoxOpen, FaPlus, FaShoppingBag, FaBars, FaUserAlt } from 'react-icons/fa';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { FaLocationDot } from 'react-icons/fa6';

const SellerSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
   
    {to:'/seller/profile/user',label: 'Profile', icon:<FaUserAlt/>},
    { to: '/seller/dashboard', label: 'Dashboard', icon: <FaBoxOpen /> },
    { to: '/seller/add-product', label: 'Add Product', icon: <FaPlus /> },
    { to: '/seller/my-products', label: 'My Products', icon: <FaBoxOpen /> },
    { to: '/seller/orders', label: 'Orders', icon: <FaShoppingBag /> },
    {to:'/customer/orders',label:'My Orders',icon:<FaShoppingBag/>},
    {to:'/address',label:'My Address',icon:<FaLocationDot/>},
  ];

  return (
    <>
      <div className="md:hidden p-2 bg-gray-100">
        <button onClick={() => setIsOpen(!isOpen)} className="text-xl">
          <FaBars />
        </button>
      </div>
      <div className={`md:w-64 w-full bg-green-600 text-white h-full md:block ${isOpen ? 'block' : 'hidden'}`}>
        <Link to='/seller/profile'><div className="p-4 font-bold text-3xl">Seller Panel</div></Link>
        <ul>
          {links.map((link) => (
            <li key={link.to} className={`p-3 hover:bg-green-700 ${location.pathname === link.to ? 'bg-green-700' : ''}`}>
              <Link to={link.to} className="flex items-center gap-2">
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SellerSidebar;


