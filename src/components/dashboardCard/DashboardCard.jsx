import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./DashboardCard.scss";
import dashboardStyles from "./DashboardData";
import ReactApexChart from "react-apexcharts";

const DashboardCard = (props) => {
  return (
    <div className="dashboard_container">
      <div className="dashboard_card">
        <div
          className="dashboard_img"
          style={{ backgroundColor: props.background }}
        >
          {props.icon}
        </div>

        <div className="dashboard_details">
          <h2 className="totals">{props.heading}</h2>
          <h4 className="counts">{props.total}</h4>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
