import React, { useEffect, useState } from "react";
import "./CategoriesForm.scss";
import InputField from "../../input/InputField";
import { Switch } from "antd";
import { useForm } from "react-hook-form";
import Button from "../../button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { API } from "../../../Utils/API/Api";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Clear from "@mui/icons-material/Clear";
import PuffLoader from "react-spinners/PuffLoader";

export const categorySchema = Yup.object().shape({
  name: Yup.string().max(25).required("Please Enter Category Name"),
});

const CategoriesForm = () => {
  const [toggle, setToggle] = useState(false);
  const [defaultName, setDefaultName] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [categoryImageArray, setCategoryImageArray] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [apiImages, setApiImages] = useState([]);

  let defaultValues = {
    name: defaultName ? defaultName : "",
    files: imagesPreview
      ? imagesPreview.map((el) => {
          return el.length;
        })
      : "0",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(categorySchema),
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      categoryDetails();
      reset(defaultValues);
    }
  }, [id, defaultName]);

  const onSubmitted = (data) => {
    if (!id) {
      submitCategoty(data);
    } else {
      updateCategoryDetails(data);
    }
  };

  const submitCategoty = async (data) => {
    console.log({ data });
    if (categoryImageArray.length === 0) {
      return toast.error("No category files were selected");
    }

    data["status"] = toggle;
    data["files"] = categoryImageArray;
    if (id) {
      data["_id"] = id;
      data["previousImages"] = apiImages;
    }

    try {
      setLoading(true);
      const response = await API.createCategory(data, token);

      if (response?.success) {
        toast.success(response?.message);
      } else {
        const errorMessage = errors.response?.message || "No Files Upload";
        toast.error(errorMessage);
      }
      navigate("/manage-categories");
    } catch (error) {
      console.log(error);
      toast.error("No Files Upload");
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryDetails = async (data) => {
    data["status"] = toggle;
    data["files"] = categoryImageArray;
    data["_id"] = id;
    data["previousImages"] = apiImages;

    try {
      setLoading(true);
      const response = await API.updateCategory(token, data);
      console.log(response);
      setCategoryImageArray([]);
      if (response?.success) {
        categoryDetails();
        toast.success("Category updated successfully!");
        navigate("/manage-categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  const categoryDetails = async () => {
    let param = {
      categoryId: id,
    };
    try {
      const response = await API.categoryDetails(token, param);
      console.log(response?.data);
      const nameFromAPI = response?.data?.name;
      setDefaultName(nameFromAPI);
      const imagesData = Array.from(response?.data?.image);
      setApiImages(response?.data?.image);
      setToggle(response?.data?.status);
      setImagesPreview([...imagesData, ...selectedImages]);

      // console.log(imagesPreview.map((me)=> {return me.length}))
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectedFiles = (event) => {
    const selectedFiles = event.target.files;
    console.log(selectedFiles);
    const selectedFilesArray = Array.from(selectedFiles);
    const res = [...categoryImageArray, ...selectedFilesArray];
    setCategoryImageArray(res);

    const imageArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });

    const arr = [...imagesPreview, ...imageArray];
    setSelectedImages([...imageArray]);
    console.log(arr);
    setImagesPreview(arr);
  };

 

  const deleteCategory = (index) => {
    let imageTemp = imagesPreview;

    let localMenu = imageTemp.filter((item)=> item?._id)
     let localImageIndex = index - localMenu.length

     console.log(index)
     let tempImages = categoryImageArray
     tempImages.splice(localImageIndex , 1);
     setCategoryImageArray([...tempImages])

     imageTemp.splice(index , 1);
     setImagesPreview([...imageTemp])


    // const updatedCategoryImageArray = [...categoryImageArray];
    // const updatedImagesPreview = [...imagesPreview];

    // updatedCategoryImageArray.splice(index, 1);
    // updatedImagesPreview.splice(index, 1);

    // setCategoryImageArray(updatedCategoryImageArray);
    // setImagesPreview(updatedImagesPreview);
  };

  console.log({ imagesPreview });

  const renderCategoryPreviews = (data) => {
    const imageUrls = imagesPreview.map((data) => {
      if (typeof data === "string" && data.slice(0, 4) === "blob") {
        return data;
      } else {
        return `http://ploshadmin.oursitedemo.com/backend/images/${data.name}`;
      }
    });

    return imageUrls.map((imageUrl, index) => (
      <>
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index}`}
          width="100px"
          height="100px"
          style={{ marginTop: "12px", objectFit: "cover", marginLeft:'20px' }}
        />
        <Clear
          style={{ color: "#628c2a", cursor: "pointer", marginBottom: "80px" }}
          onClick={() =>
            imagesPreview[index]?._id
              ? deleteCategoryPreview(
                  imagesPreview[index]?._id,
                  imagesPreview[index]?.name
                )
              : deleteCategory(index)
          }
        />
      </>
    ));
  };

  const deleteCategoryPreview = async (imageId) => {
    const params = {
      categoryId: id,
      imageId: imageId,
    };

    try {
      const response = await API.deleteCategoryImages(token, params);
      // setImagesPreview([])
      categoryDetails();
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  // const updatedCategorymageArray = [setDeleteImageData];
  // setCategoryImageArrayPreview(updatedCategorymageArray);

  const toggler = () => {
    setToggle(!toggle);
  };

  return (
    <div className="categoryForm-container">
      <div className="category_heading">
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

        <h4>Add Category</h4>
      </div>
      <form onSubmit={handleSubmit(onSubmitted)} className="category-form">
        <InputField
          control={control}
          label="Category Name"
          type="text"
          name={"name"}
        />

        <div className="category-input">
          <label>
            Category Images{" "}
            <span
              style={{ color: "red", marginTop: "10px", marginLeft: "3px" }}
            >
              *
            </span>
          </label>
          <input
            type="file"
            name="image"
            multiple="true"
            id="restaurant"
            accept="image/jpeg , image/png , image/webp"
            onChange={onSelectedFiles}
            register={{ ...register("image") }}
          />
          {errors && (
            <small className="errorsImages">{errors["image"]?.message}</small>
          )}
          {location.pathname === "/manage-categories/category-form" ? (
            <div className="categoryimgcontainer">
              {imagesPreview &&
                imagesPreview.map((image, index) => {
                  return (
                    <div className="preview-category-img" key={index}>
                      <img src={image} alt="" />
                      <Clear
                        style={{ color: "#628c2a", cursor: "pointer" }}
                        onClick={() => deleteCategory(index)}
                      />
                    </div>
                  );
                })}
            </div>
          ) : (
            <div>{renderCategoryPreviews()}</div>
          )}
        </div>

        <div className="status">
          <p>Status</p>

          <Switch checked={toggle} onChange={toggler} />
        </div>

        <div className="btn-container">
          <Button name={`Submit`} loading={loading} />
        </div>
      </form>
    </div>
  );
};

export default CategoriesForm;
