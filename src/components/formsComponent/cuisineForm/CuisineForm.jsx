import React, { useEffect, useMemo, useState } from "react";
import InputField from "../../input/InputField";
import { useForm } from "react-hook-form";
import "./CuisineForm.scss";
import Button from "../../button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { API } from "../../../Utils/API/Api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const cuisineSchema = Yup.object().shape({
  name: Yup.string().required("Please Enter Cuisine Name"),
});

const CuisineForm = () => {
  const [defaultName, setDefaultName] = useState("");
  const [loading, setLoading] = useState(false);

  let defaultValues = {
    name: defaultName ? defaultName : "",
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(cuisineSchema),
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      cuisineDetails();
      reset(defaultValues);
    }
  }, [id, defaultName]);

  const cuisineDetails = async () => {
    let param = {
      cuisineId: id,
    };
    try {
      const response = await API.cuisineDetails(token, param);
      console.log(response?.data);
      const nameFromAPI = response?.data?.name;
      setDefaultName(nameFromAPI);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitted = async (data) => {
    console.log(data);

    try {
      setLoading(true);
      let response;
      if (id) {
        data["_id"] = id;
        response = await API.updateCuisine(data, token);
      } else {
        response = await API.createCuisine(data, token);
      }
      console.log(response);
      if (response?.success) {
        toast.success(response?.message);
      } else {
        toast.error(response?.data.message);
      }
      navigate("/manage-cuisine");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cuisineForm-container">
      <div className="cuisine-heading">
        <ArrowBackIosIcon
 style={{ color: "#628c2a", padding: "10px", fontSize: "45px" , marginLeft:'10px' , marginTop:'-4px'}}
          onClick={() => navigate(-1)}
        />
        <h4>Add  Cuisine</h4>
      </div>
      <form onSubmit={handleSubmit(onSubmitted)} className="cuisine-form">
        <InputField control={control} label=" Cuisine Name" type="text" name={"name"} />

        <div className="btn-component">
          <Button name={`Submit`} loading={loading} />
        </div>
      </form>
    </div>
  );
};

export default CuisineForm;
