import React from "react";
import PublicNavbar from "./PublicNavbar";
import PrivateNavbar from "./PrivateNarbar";
import AdminNavbar from "./AdminNavbar";
import { useSelector } from "react-redux";

const Navbar = () => {
  // get the user from the store
  const { isAuthenticated, user } = useSelector((state) => state?.auth);
  const isAdmin = user?.isAdmin;
  return (
    <>
      {isAdmin ? (
        <AdminNavbar />
      ) : isAuthenticated ? (
        <PrivateNavbar />
      ) : (
        <PublicNavbar />
      )}
    </>
  );
};

export default Navbar;
