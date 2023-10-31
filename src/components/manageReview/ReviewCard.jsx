import React, { useState } from "react";
import "./ReviewCard.scss";
import Profile from "../../assests/logo.png";
import Delete from "../../assests/delete.svg";
import Edit from "../../assests/view.svg";
import EditReviewModal from "../editReview/EditReview";
import DeletModal from "../deleteModal/DeletModal";
import ProgressBar from "@ramonak/react-progress-bar";
import { API } from "../../Utils/API/Api";
import { useParams } from "react-router-dom";

const ReviewCard = (props ) => {
  const { EditModal, DeleteModalReview } = props;
  const [reviewUserId , setReviewUserId] = useState()

  

  return (
    <div className="review-card">
      <div className="review-card-container">
        <div className="review-info">
          <div className="review-profile">
            <img src={Profile} alt="" />
            <div className="user-detail">
              <h4 className="user-name">{props?.user.name}</h4>
              <p>{props?.user['email']}</p>
            </div>
          </div>

          <div className="review-actions">
            <img
              style={{ cursor: "pointer" }}
              onClick={EditModal} 
              src={Edit}
              alt="edit"
            />
            <img
              style={{ cursor: "pointer" }}
              src={Delete}
              onClick={DeleteModalReview}
              alt="Delete"
            />
          </div>
        </div> 
        {console.log( 'fs',reviewUserId)}

        <div className="authenticity">
          <h4>Authenticity</h4>
          <ProgressBar
            completed={props.authenticity}
            bgColor="#628c2a"
            height="14px"
            labelColor="#fff"
            maxCompleted={10}
            customLabel={props.authenticity}
            className="wrapper"
          />
          <p>{props.authenticity}</p>
        </div>

        <div className="taste">
          <h4>Taste</h4>
          <ProgressBar
            completed={props.taste}
            bgColor="#628c2a"
            height="14px"
            labelColor="#fff"
            maxCompleted={10}
            customLabel={props.taste}
            className="wrapper"
          />
          <p>{props.taste}</p>
        </div>

        <div className="review-description">
          <h4>Description:</h4>
          <p>{props.message}</p>
        </div>
      </div>
    
    </div>
  );
};

export default ReviewCard;
