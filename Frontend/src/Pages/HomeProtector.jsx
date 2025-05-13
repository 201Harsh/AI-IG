import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../Animations/LoadingAnimation";
import { Bounce, toast, ToastContainer } from "react-toastify";

const HomeProtector = ({ children }) => {
  const navigate = useNavigate(); // lowercase "navigate"
  const [loading, setLoading] = useState(true);

  const UserLogin = localStorage.getItem("IsLogin");

  useEffect(() => {
    if (UserLogin) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, []);

  if (loading) {
    return (
      <>
        <LoadingAnimation />
      </>
    );
  }

  return <>{children}</>;
};

export default HomeProtector;
