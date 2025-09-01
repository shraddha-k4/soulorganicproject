// import jwt from 'jsonwebtoken';


// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//      console.log("Decoded Token:",decoded);
//     req.user = {
//       id: decoded.id,
//       role: decoded.role,
//       name: decoded.name,
//     };

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid token",
//       error: error.message
//     });
//   }
// }

// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access Denied: Insufficient Role" });
//     }
//     next();
//   };
// };

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("👉 Extracted Token:", token); // 👈 token येतोय का ते check करा

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); // 👈 terminal वर दिसलं पाहिजे

    req.user = {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({
      message: "Invalid token",
      error: error.message
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("👉 Checking role:", req.user?.role); // 👈 इथेही log
    if (!roles.includes(req.user.role)) {
      console.log("❌ Access Denied for role:", req.user.role);
      return res.status(403).json({ message: "Access Denied: Insufficient Role" });
    }
    next();
  };
};
