import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables'
import { cuisineData } from '../../FormData'
import DeletModal from '../../components/deleteModal/DeletModal';
import Delete from "../../assests/delete.svg";
import Edit from "../../assests/view.svg";
import './ManageCusine.scss'
import { Outlet, useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import { API } from '../../Utils/API/Api';
import PuffLoader from "react-spinners/PuffLoader";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'react-hook-form';
import { setCuisineList } from '../../store/slices/CuisineSlices';

const override = {
  display: "block",
  margin: "15% auto",

  color: "#628c2a",
};


const ManageCusine = () => {
  const columns = [
    {
      name: <div style={{fontSize: 18 , fontWeight:'600'}}>Sr</div>,
      cell: (row, index) => <div style={{fontSize: 16}}>{index + 1}</div>,
    
    },
    {
      name: <div style={{fontSize: 18 , fontWeight:'600'}}>Name</div>, 
      selector: (row) => row.name,
      cell: row => <div style={{fontSize: 16}}>{row.name}</div>,
      sortable: true,
    },
   
    {
      name: <div style={{fontSize: 18 , fontWeight:'600'}}>Action</div>, 
      cell: (row) =><div className="actions">
      <img style={{cursor:'pointer'}} onClick={()=>handleCuisine(row._id)} src={Edit} alt="edit" />
      <img style={{cursor:'pointer'}} onClick={()=>handleDelete(row)} src={Delete} alt="Delete" />
    </div>
    },
  ];

  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate()
  
  const [deleteId , setDeleteId] = useState("")
  const token = localStorage.getItem("token"); 
  const [loading, setLoading] = useState(true);
 const dispatch = useDispatch()
 const {cuisine} = useSelector((state) => state.cuisine)
  


  useEffect(()=>{
    cuisineList()
   },[token])

  const toggler = () => {
    toggle ? setToggle(false) : setToggle(true);
  };

  const handleDelete = (row) => {
    console.log("gfds");
    setDeleteModal(true);
    setDeleteId(row?._id)
  };
 
 const handleNavigation = () => {
  navigate('/manage-cuisine/cuisine-form')
 }

 const handleCuisine = (id) =>{
  navigate(`cuisine-form/${id}`)
 }

 const cuisineList = async () => {
  try {
    const response = await API.getcuisineList(token);
    setLoading(true);
    // setCuisineData(response?.data);
    dispatch(setCuisineList(response?.data)); 
  } catch (error) {
    console.log(error)
  }finally{
    setLoading(false)
  }
};

const handleCuisineDelete = async (e) =>{
  e.preventDefault()
  console.log(deleteId)
  let param = {
    _id:deleteId
  } 
  try {
   console.log({token,param});
    const response = await API.deleteCuisineData( token , param); 
    console.log({response});
  console.log(param)
    if (response?.success) {
      cuisineList()
     setDeleteModal(false)
    } else {
    }
  } catch (error) {
    console.error(error);
  } 

}



  return (
    <>
    <div className='cuisine-container'>
     
    {loading ? (
        <PuffLoader
          color={"#628c2a"}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
    
      <Tables data={cuisine}     title={<span style={{ fontSize: '32px', }}>Cuisine List</span>} columns={columns}  showButton={true} name={'Add Cuisine'}
        onClick={handleNavigation}/>
      ) }
      {deleteModal && (
        <DeletModal closeDeleteModal={() => setDeleteModal(false)} handleSubmit={handleCuisineDelete} />
      )}    
    </div>
    <Outlet />
    </>
  )
}

export default ManageCusine