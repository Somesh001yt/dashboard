import React, { useState } from "react";
import "./DeleteModal.scss";
import { API } from "../../Utils/API/Api";

const DeletModal = ({ closeDeleteModal  , handleSubmit , }) => {
 

  const handleCancel = () => {
    closeDeleteModal()
  }

  return (
    <div
      className="delete-container"
      onClick={(e) => {
        if (e.target.className === "delete-container") closeDeleteModal();
      }}
    >
      <div className="modal">
        <div>
          <h4>Are you sure?</h4>
          <p>You want to Delete</p>
          <div className="confirm-btn">
            <button onClick={handleCancel }className="cancel-btn">Cancel</button>
          <button className="confirm-btn" type="button" onClick={handleSubmit}>
            Confirm
          </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletModal;
