import React, { useEffect, useState } from "react";
import "./EditReview.scss";
import Logo from "../../assests/logo.png";
import ProgressBar from "@ramonak/react-progress-bar";
import Slider from "@mui/material/Slider";
import { API } from "../../Utils/API/Api";
import Button from "../button/Button";
import PuffLoader from "react-spinners/PuffLoader";

const EditReviewModal = ({
  closeDeleteModal,
  reviewData,
  updateModal,
  loadingBtn,
}) => {
  const [authenticity, setAuthenticity] = useState(reviewData?.authenticity);
  const [taste, setTaste] = useState(reviewData?.taste);
  const [message, setMessage] = useState(reviewData?.message);

  console.log(reviewData);

  const handleChange = (value) => {
    setAuthenticity(value?.target?.value);
  };
  const handleTaste = (value) => {
    setTaste(value?.target?.value);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
    console.log("Description updated:", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      authenticity,
      taste,
      message,
    };

    console.log(formData);
    updateModal(formData);
  };

  const handleCancel = () => {
    closeDeleteModal();
  };

  return (
    <div
      className="editReview_container"
      onClick={(e) => {
        if (e.target.className === "editReview_container") closeDeleteModal();
      }}
    >
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal_profile">
          <img className="modal_image" src={Logo} alt="" />
          <div className="modalUser_detail">
            <h4 className="modalUser_name">Abhi</h4>
            <p>abhi@gmail.com</p>
          </div>
        </div>

        <div className="authenticity">
          <h4>Authenticity</h4>
          <Slider
            size="large"
            defaultValue={authenticity}
            max={10}
            className="authenticitySlider"
            sx={{
              width: 320,
              color: "success.main",
            }}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={handleChange}
          />

          <p className="ratingNum"> {authenticity}</p>
        </div>

        <div className="taste">
          <h4>Taste</h4>
          <Slider
            size="large"
            defaultValue={taste}
            max={10}
            className="silderComp"
            sx={{
              width: 320,
              color: "success.main",
            }}
            aria-label="Small"
            valueLabelDisplay="auto"
            onChange={handleTaste}
          />
          <p className="ratingNumber">{taste}</p>
        </div>

        <div className="review_description">
          <h4>Description:</h4>
          <textarea
            className="text_area"
            name=""
            id=""
            cols="30"
            rows="10"
            value={message}
            onChange={handleDescription}
          ></textarea>
        </div>
        <div className="confirm_btn">
          <button onClick={handleCancel} className="cancel_btn">
            Cancel
          </button>
          <button className="confirm_btn" type="submit" disabled={loadingBtn}>
            {loadingBtn ? <PuffLoader color={"#fff"} size={20} /> : "Confirm"}
          </button>
          {/* <Button name={'Confirm'} loading={loadingBtn}/> */}
        </div>
      </form>
    </div>
  );
};

export default EditReviewModal;
