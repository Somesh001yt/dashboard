import React from 'react'
import styles from './Button.module.scss' 
import PuffLoader from "react-spinners/PuffLoader";


const Button = ({name, type , onClick ,loading}) => { 
  console.log(loading);
  return (
    <>
       <button className={styles.btn} type={type} onClick={onClick}  disabled={loading} >{ loading ? <PuffLoader color={"#fff"} size={20} /> :name}</button>  
    </>
  )
}

export default Button