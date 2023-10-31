import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../../input/InputField";
import "./RestaurantForm.scss";
import Axios from "axios";
import DropdDown from "../../dropdown/DropdDown";
import { Switch } from "antd";
import Button from "../../button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { API } from "../../../Utils/API/Api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ClearIcon from "@mui/icons-material/Clear";
import Clear from "@mui/icons-material/Clear";
import { useLocation } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import Arrow from "../../../assests/arrowwebp";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const categorySchema = Yup.object().shape("");
const cuisineSchema = Yup.object().shape("");

const override = {
  display: "block",
  margin: "15% auto",
};

export const restaurantSchema = Yup.object().shape({
  name: Yup.string().required("Please enter restaurant name"),
  email: Yup.string().email().required("Please enter your email"),
  phone: Yup.string()
    .required("Enter your phone number")
    .matches(phoneRegExp, "Phone number is not valid"),
  address: Yup.string().required("Please enter your restaurant address"),
  //  restaurantImages: Yup.mixed().required("Required"),
  //  menuImages: Yup.mixed().required("Image file is required"),
  category: Yup.array()
    .required("Select one category atleast")
    .of(categorySchema)
    .min(1),
  cuisine: Yup.array()
    .required("Please Select one cuisine atleast")
    .of(cuisineSchema)
    .min(1),
});

const RestaurantForm = ({
  formData,
  preview,
  menu,
  onDeleteRestaurant,
  onDeleteMenu,
  details,
  updateRestaurantPreview,
}) => {
  const [categoryData, setCategoryData] = useState([]);
  const [toggle, setToggle] = useState(formData?.status);
  const [imagePreview, setImagePreview] = useState([]);
  const [menuPreview, setMenuPreview] = useState([]);
  const [localRestImgs, setLocalRestImgs] = useState([]);
  const [menuImageArray, setMenuImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localRestaurantImages, setLocalRestaurantImages] = useState();
  const [localMenuImages, setLocalMenuImages] = useState();
  const location = useLocation();

  useEffect(() => {
    if (preview && preview?.length > 0) {
      setImagePreview(preview);
    } else {
      setImagePreview(localRestImgs);
    }
    if (localRestImgs?.length > 0) {
      let localImages = localRestImgs.map((file) => {
        return URL.createObjectURL(file);
      });

      setImagePreview([...preview, ...localImages]);
    }
    if (menu?.length) {
      setMenuPreview(menu);
    } else {
      setMenuPreview(menuImageArray);
    }
    if (menuImageArray?.length > 0) {
      let menuLocalImgs = menuImageArray.map((file) => {
        return URL.createObjectURL(file);
      });
      setMenuPreview([...menu, ...menuLocalImgs]);
    }
  }, [preview.length, menu.length]);

  const mappCategoryValue = (data) => {
    let finalArray = [];
    data.map((data) => {
      const obj = {
        value: data?._id,
        label: data?.name,
      };

      finalArray.push(obj);
    });
    return finalArray;
  };

  const defaultValues = {
    name: formData?.name || "",
    category:
      formData?.category?.length > 0
        ? mappCategoryValue(formData?.category)
        : [],

    cuisine:
      formData?.cuisine?.length > 0 ? mappCategoryValue(formData?.cuisine) : [],

    description: formData?.description || "",
    email: formData?.email || "",
    address: formData?.address || "",
    phone: formData?.phone || "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formData ? defaultValues : {},
    resolver: yupResolver(restaurantSchema),
  });

  const token = localStorage.getItem("token");
  const [cusineData, setCuisineData] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    cuisineList();
    categoryList();
    reset(defaultValues);
  }, [token, id]);

  const onSubmitted = async (data) => {
    console.log({ data });

    if (!id) {
      submitCategoty(data);
    } else {
      updateRestaurantDetails(data);
    }
  };

  const submitCategoty = async (data) => {
    if (localRestImgs.length === 0) {
      return toast.error("No restaurant images were selected");
    }

    if (menuImageArray.length === 0) {
      return toast.error("No menu images were selected");
    }

    const categoryId = data?.category?.map((item) => {
      return item.value;
    });
    const cuisineId = data?.cuisine?.map((item) => {
      return item.value;
    });

    const result = await handleLatitude(data?.address);
    console.log("result", result);
    data["latitude"] = result?.geometry?.location?.lat;
    data["longitude"] = result?.geometry?.location?.lng;
    data["address"] = result?.formatted_address;

    data["status"] = toggle;
    data["restaurantImages"] = localRestImgs;
    data["menuImages"] = menuImageArray;
    if (id) {
      data["_id"] = id;
    }

    console.log(data);
    // data.description = data?.description;
    data.category = categoryId;
    data.cuisine = cuisineId;

    try {
      setLoading(true);
      const response = await API.getrestaurantForm(data, token);
      console.log(response?.message, "resform");

      if (response?.success) {
        toast.success(response?.message);
        navigate("/manage-restaurants");
      } else {
        const errorMessage = errors.response?.message || "No Files Upload";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("No Files Upload");
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const updateRestaurantDetails = async (data) => {
    const result = await handleLatitude(data?.address);
    data["latitude"] = result?.geometry?.location?.lat;
    data["longitude"] = result?.geometry?.location?.lng;
    data["address"] = result?.formatted_address;
    data["_id"] = id;
    data["status"] = toggle;
    data["restaurantImages"] = localRestImgs;
    data["menuImages"] = menuImageArray;
    data["previousRestaurantImage"] = preview;
    data["previousMenuImage"] = menu;

    console.log({ data });

    try {
      setLoading(true);
      const response = await API.updateRestaurant(token, data);
      console.log(response);
      // setLocalRestImgs([]);
      setMenuImageArray([]);
      if (response?.success) {
        toast.success("Restaurant updated successfully!");
        navigate("/manage-restaurants");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the restaurant.");
    } finally {
      setLoading(false);
    }
  };

  const handleLatitude = async (pickupPointAddress) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${pickupPointAddress}&key=AIzaSyCCwS36ujnFSOTUvrTv_-WuG6Lznr0lyTo`
      );
      return response?.data?.results[0];
    } catch (error) {
      console.log(error);
    }
  };

  const toggler = () => {
    setToggle(!toggle);
  };

  const categoryList = async () => {
    try {
      const response = await API.categoryList(token);
      console.log(response?.data);
      let aaa = categoryValue(response?.data);
      console.log(aaa, "aaa");
      setCategoryData(aaa);
    } catch (error) {
      console.log(error);
    }
  };

  const categoryValue = (data) => {
    let finalArray = [];
    data.map((data) => {
      const obj = {
        value: data?._id,
        label: data?.name,
      };

      finalArray.push(obj);
    });
    return finalArray;
  };

  const cuisineList = async () => {
    try {
      const response = await API.getcuisineList(token);
      let list = cuisineValue(response?.data);
      setCuisineData(list);
    } catch (error) {
      console.log(error);
    }
  };

  const cuisineValue = (data) => {
    let finalArray = [];
    data.map((data) => {
      const obj = {
        value: data?._id,
        label: data?.name,
      };

      finalArray.push(obj);
    });
    return finalArray;
  };

  const onSelectedFiles = (event) => {
    console.log("imageUrls", preview);
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const res = [...localRestImgs, ...selectedFilesArray];
    setLocalRestImgs(res, preview);

    const imageArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });

    const arr = [...imagePreview, ...imageArray];
    console.log({ arr });
    setLocalRestaurantImages(imageArray);

    setImagePreview(arr);
  };

  // const deleteRestaurant = (index) => {
  //   setLocalRestImgs((prev) => prev.splice(1));

  //   // Remove the corresponding URL from imagePreview
  //   const updatedImagePreview = [...imagePreview];
  //   updatedImagePreview.splice(index, 1);
  //   setImagePreview(updatedImagePreview);
  // };

  const deleteRestaurant = (data,index) => {
    console.log({data});
    let previewTemp=imagePreview

    let localPrev=previewTemp.filter(me=>me._id)

    let localImgIndex=index-localPrev.length


 
    console.log(index)
    let tempLocal=localRestImgs
    tempLocal.splice(localImgIndex , 1);
    console.log('delete' , tempLocal)
    setLocalRestImgs([...tempLocal])
    console.log('local state',localRestImgs);


    previewTemp.splice(index, 1);
    setImagePreview([...previewTemp]);

    console.log('preview' , imagePreview)
  };

  
  
  const onSelectedMenu = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const res = [...menuImageArray, ...selectedFilesArray];
    setMenuImageArray(res, menu);

    const imageArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });

    console.log("imageurl", { menuPreview, imageArray });

    const arr = [...menuPreview, ...imageArray];
    setLocalMenuImages(imageArray);
    setMenuPreview(arr);
  };

  const deleteMenu = (data ,index) => {
    console.log({data})
     let menuTemp = menuPreview;
   
     let localMenu =menuTemp.filter((item)=> item?._id)
     let localMenuIndex = index - localMenu.length
   
     console.log(index)
     let tempMenu = menuImageArray
     tempMenu.splice(localMenuIndex , 1);
     console.log('menu delete' , tempMenu)
     setMenuImageArray([...tempMenu])
   
     menuTemp.splice(index , 1);
     setMenuPreview([...menuTemp])
      
     };
   


  const handleDeleteRestaurant = (data, index) => {
    console.log("Deleting restaurant image at index", data, index);

    if (data?._id) {
      onDeleteRestaurant(data);
    } else {
      deleteRestaurant(data,index);
    }
  };

  const handleDeleteMenu = (data, index) => {
    console.log("Deleting menu image at index", data, index);
    if (data._id) {
      onDeleteMenu(data);
    } else {
      deleteMenu(data , index);
    }
  };

  const onerror = (error) => {
    console.log(error);
  };

  return (
    <div className="restaurantForm-container">
      <div className="restaurant-reviews">
        <ArrowBackIosIcon
          style={{
            color: "#628c2a",
            padding: "10px",
            fontSize: "45px",
            marginLeft: "10px",
            marginTop: "-4px",
          }}
          onClick={() => navigate(-1)}
        />
        <h4> Add Restaurant </h4>
      </div>
      <form
        onSubmit={handleSubmit(onSubmitted, onerror)}
        className="restaurant-form"
      >
        <DropdDown
          label="Categories"
          control={control}
          name={"category"}
          option={categoryData}
        />
        {errors && (
          <small className="errors">{errors["category"]?.message}</small>
        )}

        <DropdDown
          label="Cuisines"
          control={control}
          name={"cuisine"}
          option={cusineData}
        />
        {errors && (
          <small className="errors">{errors["cuisine"]?.message}</small>
        )}

        <InputField
          control={control}
          label="Restaurant Name"
          type="text"
          name={"name"}
          placeholder={"Enter your restaurant name"}
        />

        {/* <InputField
          control={control}
          label="Owner Name"
          type="text"
          name={" owner name"}
          placeholder={"Enter your full name"}
        /> */}
        <InputField
          control={control}
          label="Restaurant Email"
          type="email"
          name={"email"}
          placeholder={"Enter your restaurant email"}
        />
        <InputField
          control={control}
          label="Restaurant Phone number"
          type="tel"
          maxLength={10}
          name={"phone"}
          placeholder={"Enter your restaurant contact info"}
        />
        <InputField
          control={control}
          label="Restaurant Address"
          type="text"
          name={"address"}
          placeholder={"Enter your address"}
        />
        <label className="label">Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <ReactQuill
              className="description"
              theme="snow"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="restaurant-input">
          <label>
            Restaurant Images{" "}
            <span
              style={{ color: "red", marginTop: "10px", marginLeft: "3px" }}
            >
              *
            </span>
          </label>
          <input
            className="menuinput"
            type="file"
            name="restaurantImages"
            multiple="true"
            id="restaurant"
            accept="image/jpeg , image/png , image/webp"
            onChange={onSelectedFiles}
          />
          {errors && (
            <small className="errorsImages">
              {errors["restaurantImages"]?.message}
            </small>
          )}
          {console.log("mapp", imagePreview)}
          <div className="restaurant-preview-container">
            {imagePreview &&
              imagePreview.map((item, index) => {
                return (
                  <div className="preview-restaurantimg" key={index}>
                    <img
                      src={
                        item?.name
                          ? `http://ploshadmin.oursitedemo.com/backend/images/${item?.name}`
                          : item
                      }
                      alt=""
                    />

                    <Clear
                      style={{ color: "#628c2a", cursor: "pointer" }}
                      onClick={() => handleDeleteRestaurant(item, index)}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="restaurant-input">
          <label>
            Menu Images{" "}
            <span
              style={{ color: "red", marginTop: "10px", marginLeft: "3px" }}
            >
              *
            </span>
          </label>
          <input
            className="menuinput"
            type="file"
            name="menuImages"
            multiple="true"
            id="menu"
            onChange={onSelectedMenu}
          />
          {errors && (
            <small className="errorsImages">
              {errors["menuImages"]?.message}
            </small>
          )}
          <div className="restaurant-preview-container">
            {menuPreview &&
              menuPreview.map((item, index) => {
                return (
                  <div className="preview-restaurantimg" key={index}>
                    <img
                      src={
                        item?.name
                          ? `http://ploshadmin.oursitedemo.com/backend/images/${item?.name}`
                          : item
                      }
                      alt=""
                    />

                    <Clear
                      style={{ color: "#628c2a", cursor: "pointer" }}
                      onClick={() => handleDeleteMenu(item, index)}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="status">
          <p>Status</p>

          <Switch checked={toggle} onChange={toggler} />
        </div>

        <div className="btn-component">
          <Button name={`Submit`} loading={loading} />
        </div>
      </form>
    </div>
  );
};

const FormWrapper = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState();
  const [categorySelected, setCategorySelected] = useState([]);
  const [restaurantPreview, setRestaurantPreview] = useState([]);
  const [menuPreview, setMenuPreview] = useState([]);
  const [toggleBtn, setToggleBtn] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setData({});
      return;
    }

    restaurantDetails();
  }, [token, id]);

  const restaurantDetails = async () => {
    let param = {
      restaurantId: id,
    };

    try {
      const response = await API.restaurantDetails(token, param);
      console.log(response);
      setToggleBtn(response?.data?.status);
      const responseData = response?.data || {};
      setCategorySelected(response?.data.category);
      const restaurantImagesData = Array.from(response?.data?.restaurantImages);
      setRestaurantPreview(restaurantImagesData);
      setMenuPreview(Array.from(response?.data?.menuImages));

      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  // const updateRestaurantPreview = (newData) => {
  //   setRestaurantPreview(...newData);
  // };

  const deleteRestaurant = async (param) => {
    const params = {
      restaurantId: id,
      restaurantImageId: param?._id,
    };

    try {
      const response = await API.deleteRestaurantImages(token, params);
      console.log("API Response:", response);
      restaurantDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const renderImagePreviews = () => {
    const restauarantImageIds = restaurantPreview.map((index) => index?._id);
    const imageUrls = restaurantPreview.map((me) => {
      return {
        _id: me._id,
        name: me.name,
      };
    });

    return imageUrls;
  };

  const renderMenuPreviews = () => {
    const MenuImageIds = menuPreview.map((index) => index?._id);

    const imageUrls = menuPreview.map((me) => {
      return {
        _id: me?._id,
        name: me?.name,
      };
    });

    return imageUrls;
  };

  const deleteMenu = async (param) => {
    const params = {
      restaurantId: id,
      menuImageId: param?._id,
    };
    console.log("parmansasd", params);

    try {
      const response = await API.deleteMenuImages(token, params);
      restaurantDetails();
      console.log("API Response:", response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {data && (
        <RestaurantForm
          formData={data}
          preview={renderImagePreviews()}
          menu={renderMenuPreviews()}
          onDeleteRestaurant={deleteRestaurant}
          onDeleteMenu={deleteMenu}
          onToggle={toggleBtn}
        />
      )}
    </>
  );
};

export default FormWrapper;
