import React from 'react'
import Logo from '../../assests/login.png'
import InputField from '../../components/input/InputField'
import './LoginPage.scss'
import {  useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import {API} from '../../Utils/API/Api'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


export const loginSchema = Yup.object().shape({
  email: Yup.string().email().required("Please Enter Your Email"),
  password:Yup.string().required('Please Enter Your Password')
});


const LoginPage = () => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate()
 

  const onSubmitted = async (data) => {
       console.log(data);

  
    try{
      let response =  await  API.getUserLogin(data) 
      console.log(response,"aaa")
      if(response?.success){
        // toast.success("Login successfully",response)
        console.log(response)
        localStorage.setItem('token', response.token)
       return navigate('/')
      }else{ 
        toast.error(response?.data.message  || 'Invalid Credential')
      }
    } catch (err) {
      console.log(err)
    }
     
   };


 


  return (
    <div className='login-container'>
      <img src={Logo} alt="logo" />


      <form onSubmit ={handleSubmit(onSubmitted)} className='login-content'>
        <h2>Login</h2>
        <InputField
            label="Email"
            type="email"
            control={control}
            name={"email"} 
            required={true}
          />
          <InputField
            label="Password"
            type="password"
            control={control} 
            name={"password"}
        
          />


          <button type='submit' className='login-btn'>Login</button>
         
      </form>
    </div>
  )
}

export default LoginPage