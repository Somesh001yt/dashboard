import React, { useEffect, useState } from "react";
import DatatTable from "react-data-table-component";
import PuffLoader from "react-spinners/PuffLoader";

import "../App.scss";

const override = {
  display: "block",
  margin: "15% auto",

  color: "#628c2a",
};

const Tables = ({ title, columns, data, showButton, onClick, name }) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [loading, setLoading] = useState(false); 
  useEffect(()=>{
      setFilteredData(data)
  },[data])
  const handleSearchChange = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    setSearch(searchTerm);
     
    let filtered = data?.filter((item) => {
      return (
        item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        item?.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        String(item?.phone)?.includes(String(searchTerm))
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [search, data]);

  return (
    <div>
      {/* {loading ? (
         <PuffLoader
         color={'#628c2a'}
         cssOverride={override}
         size={50}
         aria-label="Loading Spinner"
         data-testid="loader"
       />
      ) : (   */}
      <DatatTable
        title={title}
        highlightOnHover
        fixedHeader
        pagination
        fixedHeaderScrollHeight="500px"
        columns={columns}
        data={filteredData}
        actions={
          showButton ? (
            <button onClick={onClick} className="dashboard-btn">
              {name}
            </button>
          ) : null
        }
        subHeader
        subHeaderComponent={
          <div className="input-form">
            <h6 className="input-text">Search </h6>
            <input
              type="text"
              placeholder="Search..."
              className="input-control"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        }
        subHeaderAlign="left"
      />
    </div>
  );
};

export default Tables;
