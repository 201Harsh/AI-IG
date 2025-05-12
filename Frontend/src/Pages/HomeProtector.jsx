import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../Animations/LoadingAnimation";
import { Bounce, toast, ToastContainer } from "react-toastify";

const HomeProtector = ({ children }) => {
  const navigate = useNavigate(); // lowercase "navigate"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to access this page.");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <>
        <LoadingAnimation />
      </>
    ); // Use the LoadingAnimation component
  }

  return <>{children}</>;
};

export default HomeProtector;
