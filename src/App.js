import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import "./App.scss";
import RoutesComponent from "./components/Router";

function App() {
  const [showMenu, setshowMenu] = useState(true); 
  const location = useLocation();
  const nonMenuItems = ["/login"];

  return (
    <div className="App">
      {nonMenuItems?.includes(location?.pathname) ? (
        ""
      ) : (
        <Navbar onCall={() => setshowMenu(!showMenu)} show={showMenu} />
      )}

      <div className="container">
        {nonMenuItems?.includes(location?.pathname) ? (
          ""
        ) : (
          <div className="menuContainer">
            <Menu show={showMenu} toggleMenu={() => setshowMenu(!showMenu)} />
          </div>
        )}
        <div className="contentContainer">
          <div className="routes">
            <RoutesComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
