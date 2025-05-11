import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeProtector = ({ children }) => {
  const Navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Navigate("/");
    }
  }, []);

  return <div>{children}</div>;
};

export default HomeProtector;
