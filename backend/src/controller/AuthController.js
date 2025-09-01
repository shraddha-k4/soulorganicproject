import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { User } from '../model/User.js';
import cloudinary from "../config/cloudinary.js";

dotenv.config();


export const signup = async (req, res) => {
    try {
        const { name, email, mobileno, password, role, city, dist, state, pincode, country } = req.body;

        if (!name || !email || !mobileno || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        if (!/^\d{10}$/.test(mobileno)) {
            return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
        }

        if (pincode && !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ message: "Pincode must be exactly 6 digits" });
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already exist" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        // ✅ Upload image to Cloudinary (if file available)
        let imageUrl = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "users",
                crop: "scale"
            });
            imageUrl = result.secure_url;
        }

        // ✅ Create new user with address + image
        const newUser = await User.create({
            name,
            email,
            password: hashpassword,
            mobileno,
            role,
            address: { city, dist, state, pincode, country },
            image: imageUrl
        });

        res.status(201).json({
            message: "Your Account is Created Successfully!!",
            user: newUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error:",
            error: error.message
        });
    }
};


//create log in account
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return res.status(400).json({
                message: "Incorrect Password"
            });
        }


        //Generate token
        const token = jwt.sign({
            id: user.id,
            role: user.role,
            name: user.name,
        }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(200).json({
            message: "Login Successful!", token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                mobileno: user.mobileno,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Login Failed", error: error.message
        });
    }
}

//forgot password
// export const forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(404).json({ message: "User not found with that email" });
//     }

//     // Ideally: generate reset token & email to user
//     // For now, just return a message
//     res.status(200).json({
//         message: "Reset link sent to your email (mocked)",
//     });
// };

// 🔹 Forgot Password (send reset link)


//protected route 
export const protectedRoute = async (req, res) => {
    res.json({
        message: "Welcome! You are Authorized", user: req.user
    });
}


export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password"); // exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({
            message: "Server error while fetching profile",
            error: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, mobileno, role, city, dist, state, pincode, country } = req.body;

        // ✅ Pincode validation
        if (pincode && !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ message: "Pincode must be exactly 6 digits" });
        }

        // ✅ Email uniqueness check
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // ✅ Upload image if provided (accept any field name)
        let imageUrl = "";
        if (req.files && req.files.length > 0) {
            const file = req.files[0]; // पहिली file घेतली
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "users",
                crop: "scale",
            });
            imageUrl = result.secure_url;
        }

        // ✅ Build update object safely
        const updateData = {
            ...(name && { name }),
            ...(email && { email }),
            ...(mobileno && { mobileno }),
            ...(role && { role }),
            ...(city || dist || state || pincode || country
                ? { address: { city, dist, state, pincode, country } }
                : {}),
            ...(imageUrl && { image: imageUrl }),
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



