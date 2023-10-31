import "./navbar.scss";
import Logo from "../../assests/logo.png";
import Hamburger from "../../assests/menu.png";
import Close from "../../assests/close.png";
import { useState } from "react";
import User from "../../assests/user.svg";
import Menu from "../menu/Menu";
import { Link } from "react-router-dom";

const Navbar = ({ onCall , show }) => {
  const [open, setOpen] = useState(false);
  const handleIcon = () => {
    setOpen(!open);
    onCall();
  };


  
  return (
    <div className="header">
      <div className="navbar">
        <div className="logo">
          <Link to='/'>
          
          <img src={Logo} alt="logo" />
          </Link>
        </div>
        <div className="icons">
          {/* <div className="rightSide">
            <h4>John dae</h4>
            <img className="user" src={User} alt="user" />
          </div> */}

          <div className="menu-icon">
            <img
              onClick={handleIcon}
              src={`${show ? Hamburger : Close}`}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
