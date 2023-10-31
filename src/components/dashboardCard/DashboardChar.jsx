import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./DashboardChart.scss";

const DashboardChar = (props) => {
  const [chartHeight, setChartHeight] = useState(300);

  const updateChartHeight = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 700) {
      setChartHeight(230); 
    } else {
      setChartHeight(300); 
    }
  }; 

  useEffect(() => {
    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);

    return () => {
      window.removeEventListener("resize", updateChartHeight);
    };
  }, []);


  const chartOptions = {
    legend: {
      show: false,
    },
    labels: [`${props.heading}`],
    colors: ["#628c2a", "#EAEAEA"],
    dataLabels: {
      enabled: false,
    },
   
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
           size: '68%',
          labels: {
            show: true,
            user: {
              show: true,
              showAlways: true,
              color: "#628C2A",
              fontSize: "10px",
              fontWeight: "600",
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
    },
  };

  const chartSeries = [props.total];
  return (
    <div className="dashboard_chart">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="donut"
        height={chartHeight} 
         
        width={400}
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </div>
  );
};

export default DashboardChar;
