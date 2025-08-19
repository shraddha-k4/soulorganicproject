// import React, { useEffect, useState } from 'react';
// import SellerSidebar from './SellerSidebar.jsx';
// import { FaUserCircle } from 'react-icons/fa';
// import axios from 'axios';
// import { Auth_profile_Api } from '../../api/ApiEndPoints.jsx'; // Adjust path if needed

// const User = () => {
//   const [profile, setProfile] = useState({
//     name: '',
//     email: '',
//     mobileNo: '',
//     role: '',
//     profilePhoto: '', // Optional: add logic if photo URL is available
//   });

//   // Fetch profile data from API
//   useEffect(() => {
//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.warn('No token found. User may not be logged in.');
//         return;
//       }

//       const response = await axios.get(Auth_profile_Api, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const user = response.data.user;

//       setProfile({
//         name: user.name || '',
//         email: user.email || '',
//         mobileNo: user.mobileno?.toString() || '',
//         role: user.role || '',
//         profilePhoto: '',
//       });
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     }
//   };

//   fetchProfile();
// }, []);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar for medium and larger screens */}
//       <div className="hidden md:block">
//         <SellerSidebar />
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-6">
//         <h2 className="text-3xl font-bold text-green-800 mb-6">My Profile</h2>

//         <form className="space-y-6 max-w-md">
//           {/* Profile Photo */}
//           <div className="flex flex-col items-center space-y-2">
//             <label htmlFor="profilePhoto" className="cursor-pointer">
//               {profile.profilePhoto ? (
//                 <img
//                   src={profile.profilePhoto}
//                   alt="Profile"
//                   className="w-20 h-20 rounded-full object-cover"
//                 />
//               ) : (
//                 <FaUserCircle className="text-8xl text-gray-500 hover:text-green-600 transition duration-200" />
//               )}
//             </label>
//             <input
//               type="file"
//               id="profilePhoto"
//               name="profilePhoto"
//               accept="image/*"
//               className="hidden"
//             />
//             <span className="text-sm text-gray-600">Click icon to upload photo</span>
//           </div>

//           {/* Name */}
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={profile.name}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter your name"
//               readOnly
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={profile.email}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
//               placeholder="you@example.com"
//               readOnly
//             />
//           </div>

//           {/* Mobile Number */}
//           <div>
//             <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">
//               Mobile Number
//             </label>
//             <input
//               type="tel"
//               id="mobileNo"
//               name="mobileNo"
//               value={profile.mobileNo}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
//               placeholder="+91 9876543210"
//               readOnly
//             />
//           </div>


//           <div>
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//              Role
//             </label>
//             <input
            
//               id="role"
//               name="role"
//               value={profile.role}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-green-500 focus:border-green-500"
//               placeholder="+91 9876543210"
//               readOnly
//             />
//           </div>

         
//         </form>
//       </div>
//     </div>
//   );
// };

// export default User;

import React, { useEffect, useState } from "react";
import SellerSidebar from "../seller/SellerSidebar.jsx";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Auth_profile_Api, Update_Profile_Api } from "../../api/ApiEndPoints.jsx";
import Footer from "../../page/Footer.jsx";

const User = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobileNo: "",
    role: "",
    profilePhoto: "",
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(Auth_profile_Api, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data.user;

        const userProfile = {
          name: user.name || "",
          email: user.email || "",
          mobileNo: user.mobileno?.toString() || "",
          role: user.role || "customer",
          profilePhoto: user.image || "",
        };

        setProfile(userProfile);
        setOriginalProfile(userProfile);
        setRole(user.role || "customer");
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      setProfile((prev) => ({ ...prev, profilePhoto: URL.createObjectURL(file) }));
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setProfile(originalProfile);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("mobileno", profile.mobileNo);
      formData.append("role", profile.role);
      if (selectedFile) formData.append("image", selectedFile);

      const response = await axios.put(Update_Profile_Api, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);

      const updatedProfile = { ...profile, profilePhoto: response.data.user.image };
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setSelectedFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading || role === null) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;
  }

  return (
    <>
      <div className="flex w-full min-h-screen bg-gray-50">
        {/* Sidebar */}
        {role === "seller" && (
          <div className="hidden md:block w-64">
            <SellerSidebar />
          </div>
        )}

        {/* Profile Form */}
        <div className="flex-1 p-6 flex justify-center items-start">
          <div className="bg-white rounded-xl shadow-[0_0_60px_rgba(251,191,36,0.8)] m-3 p-6 md:p-10 w-full max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 text-center">
              My Profile
            </h2>

            <form className="space-y-6" onSubmit={handleUpdate}>
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-2">
                <label
                  htmlFor="profilePhoto"
                  className={`cursor-pointer ${!isEditing && "pointer-events-none"}`}
                >
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-8xl text-gray-500 hover:text-green-600 transition duration-200" />
                  )}
                </label>
                {isEditing && (
                  <input
                    type="file"
                    id="profilePhoto"
                    name="profilePhoto"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                )}
                <span className="text-sm text-gray-600">
                  {isEditing ? "Click icon to upload photo" : ""}
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
                  disabled={!isEditing}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  disabled={!isEditing}
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  value={profile.mobileNo}
                  onChange={(e) => setProfile({ ...profile, mobileNo: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  disabled={!isEditing}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  disabled={!isEditing}
                />
              </div>

              {/* Buttons */}
              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

  
    </>
  );
};

export default User;
