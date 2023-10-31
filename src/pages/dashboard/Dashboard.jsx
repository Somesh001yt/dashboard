import React from 'react'
import './Dashboard.scss'
import DashboardCard from '../../components/dashboardCard/DashboardCard'
import { dashboardData } from '../../components/dashboardCard/DashboardData'
import ApexCharts from 'apexcharts'
import DashboardChar from '../../components/dashboardCard/DashboardChar'



const Dashboard = () => {
  return (
    <div>
    <div className='dashboard'>
        <h2>Welcome to the Administrator Panel</h2>
   
    </div>
      <div style={{display:'flex' ,flexWrap:'wrap' , gap:'2rem' , justifyContent:'center' , alignItems:'center'}}>

        {/* {dashboardData.map((content)=> (

        <DashboardCard       <p>This is thenew dashboard how are you doing now is the time t</p>{...content}/>
        ))}
         */}
         {dashboardData.map((content)=> (

        <DashboardChar  {...content}/>
        ))}

        
      </div>
    </div>
  )
}

export default Dashboard