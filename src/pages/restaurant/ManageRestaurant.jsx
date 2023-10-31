import React, { useEffect, useState } from "react";
import Tables from "../../components/Tables";
import { restaurantData } from "../../FormData";
import "./ManageRestaurant.scss";
import DeletModal from "../../components/deleteModal/DeletModal";
import Delete from "../../assests/delete.svg";
import Edit from "../../assests/view.svg";
import { Switch } from "antd";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import axios from "axios";
import { API } from "../../Utils/API/Api";
import PuffLoader from "react-spinners/PuffLoader";
import Review from '../../assests/review.png'

const override = {  
  display: "block",
  margin: "15% auto",

  color: "#628c2a",
};

const ManageRestaurant = () => {
  const columns = [
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 , }}>Sr</div>,
      cell: (row, index) => <div style={{ width:50, fontSize: 16 }}>{index + 1}</div>,
     width:'90px'
    },
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Restaurant Image</div>,
      selector: (row) => (
        <img
          className="restaurant-img"
          src={`http://ploshadmin.oursitedemo.com/backend/images/${row?.restaurantImages[0]?.name}`}
          alt="Restaurant"
        />
      ),
    },
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Restaurant Name</div>,
      selector: (row) => row.name,
      cell: (row) => <div style={{ fontSize: 16 }}>{row.name}</div>,
      sortable: true,
    },

    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Email</div>,
      selector: (row) => <div style={{ fontSize: 16 }}>{row.email}</div>,
    },
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Phone</div>,
      selector: (row) => <div style={{ fontSize: 16 }}>{row.phone}</div>,
    
    },
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Address</div>,
      selector: (row) => <div style={{ fontSize: 15 }}>{handleAddress && row.address}</div>,
     
    },
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Status</div>,
      cell: (row) => (
        <Switch
          className="switch-status"
          checked={row?.status}
          onClick={() => handleStatus(row._id, row.status)}
        />
      ),
  
    },
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Actions</div>,
      cell: (row) => (
        <div className="actions">
          <img
            style={{ cursor: "pointer" }}
            onClick={()=>handleRestaurant(row?._id)}
            src={Edit}
            alt="edit"
          />
          <img
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(row)}
            src={Delete}
            alt="Delete"
          />
        </div>
      ),
    },
    {
      name: <div style={{ fontSize: 17, fontWeight : 600 }}>Reviews</div>,
      cell: (row) => (
        <div >
        <img
          style={{ cursor: "pointer", width:'30px',  objectFit:'contain'}}
          onClick={()=>handleReviews(row?._id)}
          src={Review}
          alt="edit"
          
        />
      </div>
      ),
    }
  ];

  const [deleteModal, setDeleteModal] = useState(false);
  const [restaurantData, setRestaurantData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    restaurantListData();
  }, [token]);

  const toggler = () => {
    toggle ? setToggle(false) : setToggle(true);
  };

  const handleDelete = (row) => {
    console.log("gfds");
    console.log(row?._id);
    setDeleteId(row?._id);
    setDeleteModal(true);
  };

  const handleNavigation = () => {
    navigate("/manage-restaurants/restaurant-form");
  };

  const handleRestaurant = (id) => {
    navigate(`restaurant-form/${id}`);
  };

  const handleReviews = (id) => {
    navigate(`/manage-restaurants/restaurant-form/${id}/manage-reviews`);
  };



  const handleAddress = async (currentPosition) => {
    console.log(currentPosition, "adsfadffas");
    try {
      await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentPosition?.coords?.latitude},${currentPosition?.coords?.longitude}&key=AIzaSyDNT05S2QZ-GflOY23q69Ps0_l04DXgEMY`
      )
        .then((resp) => resp.json())
        .then((json) => {
          console.log("json2", json);
          return json;
        });
    } catch (e) {
      console.log("ERROR IS ", e);
    }
  };

  const restaurantListData = async () => {
    try {
      const response = await API.getrestaurantList(token);
      setLoading(true);
      console.log('address' ,response , response?.address);
      setRestaurantData(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleStatus = async (id, status) => {
    setLoading(false);

    const vals = {
      restaurantId: id,
      status: `${!status}`,
    };

    console.log(vals);

    try {
      const response = await API.restaurantUpdateStatus(token, vals);
      console.log(response);
      restaurantListData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    console.log(deleteId);
    let param = {
      _id: deleteId,
    };
    try {
      console.log({ token, param });
      const response = await API.deleteRestaurantData(token, param);
      console.log({ response });
      console.log(param);
      if (response?.success) {
        restaurantListData();
        setDeleteModal(false);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="restaurant-container  ">
      {loading ? (
        <PuffLoader
          color={"#628c2a"}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <Tables
          columns={columns}
          title={<span style={{ fontSize: '32px', }}>Restaurant List</span>}
          data={restaurantData}
          showButton={true}
          name={"Add Restaurant"}
          onClick={handleNavigation}
        />
      )}
      {deleteModal && (
        <DeletModal
          handleSubmit={handleSubmitDelete}
          closeDeleteModal={() => setDeleteModal(false)}
        />
      )}  
    </div>
  );
};

export default ManageRestaurant;
