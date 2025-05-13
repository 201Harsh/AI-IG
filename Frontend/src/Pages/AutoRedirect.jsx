import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoRedirect = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    const IsLogin = localStorage.getItem("IsLogin");
    if (IsLogin) {
      Navigate("/home");
    } else {
      Navigate("/start");
    }
  }, []);
};

export default AutoRedirect;
