import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listItem } from "./List";
import "./menu.scss";
import { useNavigate } from "react-router-dom";
import Logout from "../../pages/logout/Logout";
import LogoutIcon from "@mui/icons-material/Logout";

const Menu = ({ show, toggleMenu }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    setModalOpen(false);
    navigate("/login");
  };

  const handleNavigations = (item) => {
    navigate(item.link);
    toggleMenu();
  };

  const handleModal = () => {
    toggleMenu();
    setTimeout(() => {
      setModalOpen(true);
    }, 500);
  };

  console.log({ pathname });
  return (
    <div className={`menu ${show ? "menu" : "open"}`}>
      <div className="items">
        {listItem.map((item, index) => {
          return (
            <div
              key={index}
              className={
                pathname === item.link || pathname?.includes(item?.related)
                  ? "menuItem active"
                  : "menuItem"
              }
              onClick={() => {
                console.log(item);
                item.id === 7 ? handleModal() : handleNavigations(item);
              }}
            >
              {item.icon} {item.name}
            
            </div>
          );
        })}
      </div>
      {modalOpen && (
                <Logout closeModal={() => setModalOpen(false)} />
              )}
    </div>
  );
};

export default Menu;
