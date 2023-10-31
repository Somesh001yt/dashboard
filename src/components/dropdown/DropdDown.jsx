import React from "react";
import { MultiSelect } from "react-multi-select-component";
import "./DropDown.scss";
import { Controller } from "react-hook-form";



const DropDown = ({ label, control, name , option }) => { 
  return (
    <div className="dropdown__container">
      <div className="dropdown-content">
        <label className="label">{label}  <span style={{color:'red', marginTop:'10px', marginLeft:'3px'}}>*</span></label>
        <Controller
          name={name} // Make sure this matches the field name in your form schema
          control={control}
          render={({ field: { onChange, onBlur, value } }) => {
          return  <MultiSelect
              options={option || [] }
              value={value || []} // Set the value using field.value
              onChange={(selectedOptions) => onChange(selectedOptions)}
              labelledBy="Select"
              className="dropdown__input"
              
            />
          }}
        />
      </div>
    </div>
  );
};

export default DropDown;
