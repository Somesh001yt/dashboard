import React, { useEffect, useState } from "react";
import Tables from "../../components/Tables";
import { categoryData } from "../../FormData";
import Delete from "../../assests/delete.svg";
import Edit from "../../assests/view.svg";
import DeletModal from "../../components/deleteModal/DeletModal";
import { Switch } from "antd";
import Button from "../../components/button/Button";
import "./ManageCategories.scss";
import { useNavigate } from "react-router-dom";
import { API } from "../../Utils/API/Api";
import PuffLoader from "react-spinners/PuffLoader";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryList } from "../../store/slices/CategorySlice";


const override = {
  display: "block",
  margin: "15% auto",

  color: "#628c2a",
};

const ManageCategories = () => {
  const columns = [
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Sr</div>,
      cell: (row, index) => <div style={{ fontSize: 16 }}>{index + 1}</div>,
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600'}}> Image</div>,
      selector: (row) => (
        <img className="food-img" src={`http://ploshadmin.oursitedemo.com/backend/images/${row?.image[0]?.name}`} alt="Delete" />
      ),
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600'}}>Name</div>,
      selector: (row) => row.name,
      cell: (row) => <div style={{ fontSize: 16 }}>{row?.name}</div>,
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Status</div>,
      cell: (row) => <Switch className="custom-switch" checked={row?.status}  onClick={() => handleStatus(row._id, row.status)} />,
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Action</div>,
      cell: (row) => (
        <div className="actions">
          <img
            style={{ cursor: "pointer" }}
            onClick={() =>handleEdit(row?._id)}
            src={Edit}
            alt="edit"
          />
          <img
            style={{ cursor: "pointer" }}
            onClick={()=>handleDelete(row)}
            src={Delete}
            alt="Delete"
          />
        </div>
      ),
    },
  ];

  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [deleteId , setDeleteId] = useState("")
  const [loading, setLoading] = useState(true); 
    const token = localStorage.getItem("token"); 
    const dispatch = useDispatch()
 const {category} = useSelector((state) => state.category)
  
 


    useEffect(()=>{
      categoryList()
    },[token])

 

  const handleDelete = async (row) => {
    console.log("gfds" , row.id);
    setDeleteModal(true);
    setDeleteId(row?._id)
   
  };

  const handleStatus = async (id, status) => {
    setLoading(false);

    const vals = {
      categoryId: id,
      status: `${!status}`,
    };

    console.log(vals);

    try {
      const response = await API.categoryUpdateStatus(token, vals);
      console.log(response);
      categoryList();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleNavigation = () => {
    navigate("/manage-categories/category-form");
  };

  const handleEdit = (id) => {
    navigate(`category-form/${id}`);
  };
  

  const categoryList = async () => {
    
    try {
      const response = await API.categoryList(token);
      
      setLoading(true)
      // setCategoryData(response?.data);
      dispatch(setCategoryList(response?.data));
      console.log(response)
    } catch (error){ 
      console.log(error)
    } finally {
      setLoading(false)
    }
  };


  const handleCategoryDelete = async (e) =>{
    e.preventDefault()
    console.log(deleteId)
    let param = {
      _id:deleteId
    } 
    try {
     console.log({token,param});
      const response = await API.deleteCategoryData( token , param); 
      console.log({response});
    console.log(param)
      if (response?.success) {
        categoryList()
       setDeleteModal(false)
      } else {
      }
    } catch (error) {
      console.error(error);
    } 

  }

 
  return (
    <div className="category-container">
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
        data={category}
        columns={columns}
        title={<span style={{ fontSize: '32px', }}>Categories List</span>}
        showButton={true}
        name={"Add Category"}
        onClick={handleNavigation}
      /> ) }
      {deleteModal && (
        <DeletModal handleSubmit={handleCategoryDelete} closeDeleteModal={() => setDeleteModal(false)} />
      )}
    </div>
  );
};

export default ManageCategories;
