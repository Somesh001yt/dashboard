import React, { useMemo } from "react";
import styles from "./InputField.module.scss";
import { Controller, useFormState } from "react-hook-form";

const   InputField = ({
  label,
  type,
  name,
  control,
  required,
  multiple,
  placeholder,
  maxLength
}) => {
  const state = useFormState({ control, name });
  const isErrorExist = useMemo(() => Boolean(state.errors[name]), [state]);
  const errorMessage = useMemo(
    () => state.errors[name]?.message || undefined,
    [state]
  );

  return (
    <Controller
      control={control}
      name={name}  
      rules={{ required: required }}
      render={({ field }) => (
        <div className={styles.input_container}>
          <label className={styles.label} htmlFor="">
            {label}   <span style={{color:'red', marginTop:'10px', marginLeft:'3px'}}>*</span>
          </label>

          <div className={styles.input_field}>
            {type === "file" ? (
              <input
                className={styles.input}
                type={type}
                name={name} 
                onChange={(e) => field.onChange(e.target.files)}
                multiple={multiple}
                placeholder={placeholder}
                accept="image/png, image/gif, image/jpeg"
           
              />
            ) : (
              <input
                className={styles.input}
                type={type}
                name={name} 
                maxLength={maxLength}
                placeholder={placeholder}
                {...field} 
                
              />
            )}
         
          </div>
             {isErrorExist && (
            <small className={styles.error_message}>{errorMessage}</small>
          )}
        </div>
      )}
    />
  );
};

export default InputField;
