import React from "react";
import InputField from "../../components/input/InputField";
import {  useForm } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import './ChangePassword.scss'
import Button from '../../components/button/Button'
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { API } from "../../Utils/API/Api";
import { ToastContainer, toast } from 'react-toastify';


export const chnagePasswordSchema = Yup.object().shape({
  oldPassword:Yup.number().required('Please Enter Your Password'),
  newPassword:  Yup.number().required('Please Enter a Strong Password'),
  confirmPassword: Yup.number().required('This Field is required').oneOf([Yup.ref('newPassword'), null], "Password must match")
});



const ChangePassword = () => {

  const { control, handleSubmit } = useForm({
    resolver : yupResolver(chnagePasswordSchema)
  });
  const token = localStorage.getItem('token')
  const onSubmit = async  (data  ) => {
    console.log(data,{token})
   
    try {  
      const response = await API.changePassword(data,token)
      console.log(response)
     if(response?.success){
      toast.success(response.message)
     }else{ 
      toast.error(  response?.data.message);
    }
    } catch (error) {
      console.log(error)
    }

   
  };

  return (
    <div className="form-container">
      <h2 className="password-heading">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}  >
  
        <div className="inputControl ">

      
          <InputField
            label="Current Password"
            type="password"
            control={control}
            name={"oldPassword"} 
          />
          <InputField
            label="New Password"
            type="password"
            control={control} 
            name={"newPassword"}
          />
          <InputField
            label="Confirm Password"
            type="password"
            control={control} 
            name={"confirmPassword"}
          />
         <div className="btn-component">
      
         <Button name={'Submit'}/>
         </div>
          </div>
      </form>
    </div>
  );
};

export default ChangePassword;
