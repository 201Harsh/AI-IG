import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoRedirector = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      Navigate("/home");
    } else {
      Navigate("/start");
    }
  }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default AutoRedirector;
