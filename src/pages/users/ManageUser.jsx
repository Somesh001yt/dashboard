import React, { useEffect, useState } from "react";
import "./ManageUser.scss";
import Tables from "../../components/Tables";
import { ColorPicker, Switch } from "antd";
import Delete from "../../assests/delete.svg";
import DeletModal from "../../components/deleteModal/DeletModal";
import axios from "axios";
import { API } from "../../Utils/API/Api";
import PuffLoader from "react-spinners/PuffLoader";
import { useDispatch, useSelector } from "react-redux";
import { setUserList } from "../../store/slices/UserSlices";


const override = {
  display: "block",
  margin: "15% auto",

  color: "#628c2a",
};

const ManageUser = (categoryId) => {
  const columns = [
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Sr</div>,
      cell: (row, index) => <div style={{ fontSize: 16 }}>{index + 1}</div>,
    
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Name</div>,
      selector: (row) => row.name,
      cell: (row) => <div style={{ fontSize: 16 }}>{row.name}</div>,
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Email</div>,
      selector: (row) => <div style={{ fontSize: 16 }}>{row.email}</div>,
      sortable: true,
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Phone</div>,
      selector: (row) => <div style={{ fontSize: 16 }}>{row.phone}</div>,
    },
    {
      name: <div style={{ fontSize: 18 , fontWeight:'600' }}>Status</div>,
      cell: (row) => (
        <>
          {" "}
          <Switch
            className="custom-switch"
            checked={row.status}
            onClick={() => handleStatus(row._id, row.status)}
          />
          {loading && (
            <PuffLoader
              color={"#628c2a"}
              cssOverride={override}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </>
      ),
    },
    
  ];

  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState();
  const dispatch = useDispatch();
  const {users} = useSelector((state) => state.users); 


  useEffect(() => {
    getUserData();
  }, [token]);

  const getUserData = async () => {
    try {
      const response = await API.getUserList(token);
      setLoading(true);
      console.log(response);
      //  setUserData(response?.data);
      dispatch(setUserList(response?.data))
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggler = () => {
    toggle ? setToggle(false) : setToggle(true);
  };

  const handleDelete = (row) => {
    setDeleteModal(true);
    console.log(row._id);
    setUserId(row?._id);
  };

  const handleStatus = async (id, status) => {
    setLoading(false);

    const vals = {
      user_id: id,
      status: `${!status}`,
    };

    console.log(vals);

    try {
      const response = await API.userUpdateStatus(token, vals);
      console.log(response);
      getUserData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
          data={users}
          title={<span style={{ fontSize: '32px', fontWeight:'500' }}>Users List</span>}
          defaultSortAsc={false}
        />
      )}
      {deleteModal && (
        <DeletModal
          closeDeleteModal={() => setDeleteModal(false)}
          categoryId={categoryId}
        />
      )}
    </div>
  );
};

export default ManageUser;
