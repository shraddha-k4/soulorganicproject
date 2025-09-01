import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { Auth_profile_Api, Update_Profile_Api } from '../../api/ApiEndPoints.jsx';
import Footer from '../../page/Footer.jsx';
import customer from '../../assets/images/customer.gif';

const CusUser = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        mobileNo: '',
        role: '',
        profilePhoto: '',
    });
    const [originalProfile, setOriginalProfile] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(Auth_profile_Api, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const user = response.data.user;

                const userProfile = {
                    name: user.name || '',
                    email: user.email || '',
                    mobileNo: user.mobileno?.toString() || '',
                    role: user.role || '',
                    profilePhoto: user.image || '',
                };

                setProfile(userProfile);
                setOriginalProfile(userProfile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            setProfile((prev) => ({
                ...prev,
                profilePhoto: URL.createObjectURL(file),
            }));
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setSelectedFile(null);
        setIsEditing(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('name', profile.name);
            formData.append('email', profile.email);
            formData.append('mobileno', profile.mobileNo);
            formData.append('role', profile.role);

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const response = await axios.put(Update_Profile_Api, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(response.data.message);

            const updatedProfile = {
                ...profile,
                profilePhoto: response.data.user.image,
            };
            setProfile(updatedProfile);
            setOriginalProfile(updatedProfile);
            setSelectedFile(null);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <>
            <div className="flex flex-col-reverse md:flex-row w-full min-h-screen">
                <div className="flex-1 p-4 md:p-6 flex justify-center items-center">
                    <div className="bg-white rounded-xl shadow-[0_0_60px_rgba(251,191,36,0.8)] m-3 p-6 md:p-10 w-full max-w-md">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 text-center">
                            My Profile
                        </h2>

                        <form className="space-y-6" onSubmit={handleUpdate}>
                            <div className="flex flex-col items-center space-y-2">
                                <label htmlFor="profilePhoto" className={`cursor-pointer ${!isEditing && 'pointer-events-none'}`}>
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
                                    {isEditing ? 'Click icon to upload photo' : ''}
                                </span>
                            </div>

                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
                                    placeholder="Enter your name"
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="you@example.com"
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    id="mobileNo"
                                    name="mobileNo"
                                    value={profile.mobileNo}
                                    onChange={(e) => setProfile({ ...profile, mobileNo: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    placeholder="+91 9876543210"
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <input
                                    id="role"
                                    name="role"
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

                            {/* <div >
                                <button
                                    className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        window.location.href = "/profile";
                                    }}
                                >
                                    Logout
                                </button>
                            </div> */}
                            {/* Logout Button - Only Mobile View */}
                            <div className="block md:hidden">
                                <button
                                    className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        window.location.href = "/profile";
                                    }}
                                >
                                    Logout
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

                {/* Image Section */}
                <div className="hidden md:flex items-center justify-center w-full md:w-1/2 p-4 md:p-6">
                    <img
                        src={customer}
                        alt="Customer"
                        className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
                    />
                </div>
            </div>


        </>
    );
};

export default CusUser;



