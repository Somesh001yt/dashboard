import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.scss";
import { ToastContainer, toast } from 'react-toastify';

const Logout = ({ closeModal , onsubmit }) => {

 

const handleSubmit = (e) => {
  localStorage.removeItem('token')
  window.location.replace('/login')
  closeModal();
}

  return (
    <div
      className="logout-container"
      onClick={(e) => {
        if (e.target.className === "logout-container") closeModal();
      }}
    >
      <div className="modal">
        <form>
          <h4>Are you sure.</h4>
          <p>you want to logout?</p>
          <div className="confirm-btn">
            <button onClick={closeModal} className="cancel-btn">Cancel</button>
          <button className="confirm-btn" type="submit" onClick={handleSubmit}>
            OK
          </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Logout;
