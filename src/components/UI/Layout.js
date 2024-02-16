import React, { useEffect } from "react";
import Navbar from "../common/Navbar";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchProductsAsync } from "../../features/productsSlice";
import { useDispatch } from "react-redux";

const Layout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, []);
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
