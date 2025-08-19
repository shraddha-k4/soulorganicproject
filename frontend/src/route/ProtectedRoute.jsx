// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../useContext/AuthProvider";


// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { authed, role } = useAuth();

//   if (!authed) return <Navigate to="/login" replace />;

//   if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
//     return (
//       <div className="text-center text-red-500 mt-20 text-xl">
//         🚫 Access Denied – Only {allowedRoles.join(" or ")} allowed
//       </div>
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;




// src/route/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../useContext/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authed, role } = useAuth();

  if (!authed) return <Navigate to="/profile" replace />;
  if (!allowedRoles.includes(role)) return <div className="text-red-600 text-center mt-20">Access Denied</div>;

  return children;
};

export default ProtectedRoute;
