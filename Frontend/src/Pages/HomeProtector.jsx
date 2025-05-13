import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../Animations/LoadingAnimation";
import { Bounce, toast, ToastContainer } from "react-toastify";

const HomeProtector = ({ children }) => {
  const navigate = useNavigate(); // lowercase "navigate"
  const [loading, setLoading] = useState(true);


  setTimeout(() => {
    setLoading(false);
  }, 5000);


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
