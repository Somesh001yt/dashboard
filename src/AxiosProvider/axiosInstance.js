import useToken from 'antd/es/theme/useToken';
import axios from 'axios';
import {  toast } from 'react-toastify';

const instance = axios.create({
   baseURL: "http://ploshadmin.oursitedemo.com:4600/api",
  // baseURL:'http://192.168.1.174:4600/api/',
  timeout: 1000000,
  
});


instance.interceptors.response.use(response  => {
  return response
}, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('token')
       setTimeout(NavigateTimeout, 1500)


    toast.error("Your session is expried please login again.")
  }

  return error.response

  // return Promise.reject()

}
)

const NavigateTimeout = () => {
  window.location.replace('/login')

}

export default instance;


