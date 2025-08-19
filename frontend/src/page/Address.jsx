import React, { useEffect, useState } from "react";
import axios from "axios";
import { Auth_profile_Api, Update_Profile_Api } from "../api/ApiEndPoints.jsx";
import SellerSidebar from "../dashboard/seller/SellerSidebar.jsx";

const Address = () => {
  const [address, setAddress] = useState({
    city: "",
    dist: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [originalAddress, setOriginalAddress] = useState({}); // Backup for cancel
  const [role, setRole] = useState(null); // User role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(Auth_profile_Api, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data.user;

        const userAddress = {
          city: user?.address?.city || "",
          dist: user?.address?.dist || "",
          state: user?.address?.state || "",
          pincode: user?.address?.pincode || "",
          country: user?.address?.country || "",
        };

        setAddress(userAddress);
        setOriginalAddress(userAddress);
        setRole(user?.role || "customer"); // set role
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("city", address.city);
      formData.append("dist", address.dist);
      formData.append("state", address.state);
      formData.append("pincode", address.pincode);
      formData.append("country", address.country);

      const response = await axios.put(Update_Profile_Api, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
      setAddress(response.data.user.address);
      setOriginalAddress(response.data.user.address);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address");
    }
  };

  const handleCancel = () => {
    setAddress(originalAddress);
    setIsEditing(false);
  };

  if (loading || role === null) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        Loading your address...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="hidden sm:block sm:w-64">
        {role === "seller" && <SellerSidebar />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-[0_0_40px_rgba(34,197,94,0.4)] m-3 p-6 md:p-10 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800">
              My Address
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-white rounded p-2 font-medium bg-green-600 hover:bg-green-700 hover:scale-70"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleUpdate}>
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Enter your city"
                disabled={!isEditing}
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                value={address.dist}
                onChange={(e) =>
                  setAddress({ ...address, dist: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Enter your district"
                disabled={!isEditing}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Enter your state"
                disabled={!isEditing}
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Enter your pincode"
                disabled={!isEditing}
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Enter your country"
                disabled={!isEditing}
              />
            </div>

            {/* Save + Cancel */}
            {isEditing && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Address;
