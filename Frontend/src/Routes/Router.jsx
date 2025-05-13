import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "../Pages/Start";
import Home from "../Pages/Home";
import HomeProtector from "../Pages/HomeProtector";
import AutoRedirect from "../Pages/AutoRedirect";

const Router = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutoRedirect />} />
        <Route path="/start" element={<Start />} />
        <Route
          path="/home"
          element={
            <HomeProtector>
              <Home />
            </HomeProtector>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
