import React, { useEffect, useState } from "react";
import "./ManageReview.scss";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate, useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import reviewsData from "./ReviewData";
import { API } from "../../Utils/API/Api";
import DeletModal from "../deleteModal/DeletModal";
import EditReviewModal from "../editReview/EditReview";
import { toast } from "react-toastify";
import PuffLoader from "react-spinners/PuffLoader";

const override = {
  display: "block",
  margin: "15% auto",
};

const ManageReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState();
  const [editModal, setEdtiModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reviewId, setReviewId] = useState();
  const [editIds, setEditIds] = useState();
  const [uniqueId, setUniqueId] = useState();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [loadingReviews, setLoadingReviews] = useState(true);

  const handleEdit = (content) => {
    setEdtiModal(true);
    setEditData(content);
    setEditIds(content?._id);
  };
  console.log(editData);
  const handleDelete = (id) => {
    setDeleteModal(true);
    setReviewId(id);
  };

  const getReviewsList = async () => {
    let param = {
      restaurantId: id,
    };
    try {
      const response = await API.reviewsList(param, token);
      console.log(response);
      setReviews(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteButton = async () => {
    let params = {
      id: reviewId,
    };
    try {
      const response = await API.deleteReviews(token, params);
      console.log("asadfd", response);
      if (response?.success) {
        toast.success(response?.message);
        getReviewsList();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteModal(false);
    }
  };

  const onUpdateReview = async (formData) => {
    let params = {
      restaurant: id,
      _id: editIds,
      user: editIds,
      message: editData?.message,
      authenticity: editData?.authenticity,
      taste: editData?.taste,
      ...formData,
    };
    console.log(params);
    setLoading(true);
    try {
      const response = await API.UpdateReviews(token, params);
      console.log(response);
      if (response?.success) {
        toast.success(response?.message);
        getReviewsList();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEdtiModal(false);
      setLoading(false);
    }
  };

  console.log(reviews);

  useEffect(() => {
    if (id) {
      getReviewsList().then(() => {
        setLoadingReviews(false);
      });
    }
  }, [id]);

  return (
    <div className="review-container">
      <div className="review_icon">
        <ArrowBackIosIcon
          style={{ color: "#628c2a", padding: "10px", fontSize: "45px" , marginLeft:'10px'}}
          onClick={() => navigate(-1)}
        />
        <h2 className="review-heading">Manage Reviews</h2>
      </div>
      {loadingReviews ? (
        <PuffLoader
          color={"#628C2A"}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : reviews && reviews.length > 0 ? (
        reviews.map((content) => (
          <ReviewCard
            {...content}
            EditModal={() => handleEdit(content)}
            DeleteModalReview={() => handleDelete(content?._id)}
            editModal={editModal}
            deleteModal={deleteModal}
          />
        ))
      ) : (
        <h2 style={{fontSize:'24px' , marginLeft:'56px' }}>No Reviews</h2>
      )}

      {editModal && (
        <EditReviewModal
          reviewData={editData}
          updateModal={onUpdateReview}
          loadingBtn={loading}
          closeDeleteModal={() => setEdtiModal(false)}
        />
      )}
      {deleteModal && (
        <DeletModal
          closeDeleteModal={() => setDeleteModal(false)}
          handleSubmit={onDeleteButton}
        />
      )}
    </div>
  );
};

export default ManageReview;
