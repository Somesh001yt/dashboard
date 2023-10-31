import instance from "../../AxiosProvider/axiosInstance";

export const API = {
  async getUserLogin(params) {
    try {
      const response = await instance.post("/admin/login", {
        ...params,
      });
      console.log(response);
      if (response?.data?.success) {
        return response?.data;
      } else if (response?.response?.data?.success) {
        return response?.response?.data;
      } else {
        return response?.data;
      }
      // console.log(response)
      // return response?.data
    } catch (error) {
      return error?.response;
    }
  },

  async getUserList(token) {
    try {
      const response = await instance.get(
        "/user/list",

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async userUpdateStatus(token, params) {
    try {
      const response = await instance.post(
        "/user/update_status",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async changePassword(params, token) {
    try {
      const response = await instance.post(
        "/user/change_password",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async createCategory(params, token) {
    let formData = new FormData();

    formData.append("name", params.name);
    formData.append("status", params.status);

    //  formData.append("files", params.files[0]);

    Array.from(params?.files).forEach((image) => {
      formData.append("files", image);
    });

    try {
      const response = await instance.post(
        "/create/category",

        formData,

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async categoryList(token) {
    try {
      const response = await instance.get("/list/category", {
        headers: {
          "x-access-token": token,
        },
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async categoryDetails(token, params) {
    try {
      const response = await instance.post(
        "/details/category",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async categoryUpdateStatus(token, params) {
    try {
      const response = await instance.post(
        "/update_status/category",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async updateCategory(token, params) {
    let formData = new FormData();

    formData.append("name", params.name);
    formData.append("status", params.status);
    if (params?.previousImages.length !== 0) {
      params?.previousImages?.map((image, i) => {
        console.log(image);
        formData.append(`previousImages[${i}][_id]`, image._id);
        formData.append(`previousImages[${i}][name]`, image.name);
      });
    }
    formData.append("_id", params._id);
    Array.from(params?.files).forEach((image) => {
      formData.append("files", image);
    });

    try {
      const response = await instance.post(
        "/update/category",

        formData,

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async deleteCategoryImages(token, params) {
    try {
      const response = await instance.post(
        "/delete_image/category",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async deleteCategoryData(token, params) {
    try {
      const response = await instance.post(
        "/delete/category",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async getrestaurantForm(params, token) {
    let formData = new FormData();

    formData.append("name", params?.name);
    formData.append("email", params?.email);
    // formData.append("category", params?.category[0]);

    if (params?.category?.length !== 0) {
      params?.category?.map((data, i) => {
        formData.append(`category[${i}]`, data);
      });
    }

    if (params?.cuisine?.length !== 0) {
      params?.cuisine?.map((data, i) => {
        formData.append(`cuisine[${i}]`, data);
      });
    }

    // formData.append("cuisine", params?.cuisine[0]);
    formData.append("phone", params?.phone);
    formData.append("description", params?.description);
    Array.from(params?.restaurantImages).forEach((image) => {
      formData.append("restaurantImages", image);
    });
    Array.from(params?.menuImages).forEach((image) => {
      formData.append("menuImages", image);
    });
    formData.append("address", params?.address);
    formData.append("latitude", params?.latitude);
    formData.append("longitude", params?.longitude);

    try {
      const response = await instance.post(
        "/create/restaurant",

        formData,

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log("check", response?.message);

      return response?.data;
    } catch (error) {
      console.log("check", error);
      return error.response;
    }
  },

  async getrestaurantList(token) {
    try {
      const response = await instance.get("/list/restaurant", {
        headers: {
          "x-access-token": token,
        },
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async restaurantDetails(token, params) {
    try {
      const response = await instance.post(
        "/details/restaurant",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async restaurantUpdateStatus(token, params) {
    try {
      const response = await instance.post(
        "/update_status/restaurant",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async updateRestaurant(token, params) {
    let formData = new FormData();

    formData.append("_id", params?._id);
    formData.append("name", params?.name);
    formData.append("status", params?.status);
    formData.append("email", params?.email);
    formData.append("address", params?.address);
    formData.append("latitude", params?.latitude);
    formData.append("longitude", params?.longitude);
    formData.append("description", params?.description);
    formData.append("phone", params?.phone);
    if (params?.category?.length !== 0) {
      params?.category?.map((data, i) => {
        formData.append(`category[${i}]`, data.value);
      });
    }

    if (params?.cuisine?.length !== 0) {
      params?.cuisine?.map((data, i) => {
        formData.append(`cuisine[${i}]`, data.value);
      });
    }

    Array.from(params?.restaurantImages).forEach((image) => {
      formData.append("restaurantImages", image);
    });
    Array.from(params?.menuImages).forEach((image) => {
      formData.append("menuImages", image);
    });

    if (params?.previousRestaurantImage.length > 0) {
      params?.previousRestaurantImage?.map((image, i) => {
        console.log("img", image);
        formData.append(`previousRestaurantImages[${i}][_id]`, image._id);
        formData.append(`previousRestaurantImages[${i}][name]`, image.name);
      });
    }

    if (params?.previousMenuImage.length !== 0) {
      params?.previousMenuImage?.map((image, i) => {
        console.log(image);
        formData.append(`previousMenuImages[${i}][_id]`, image._id);
        formData.append(`previousMenuImages[${i}][name]`, image.name);
      });
    }

    try {
      const response = await instance.post(
        "/update/restaurant",

        formData,

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async deleteRestaurantData(token, params) {
    try {
      const response = await instance.post(
        "/delete/restaurant",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async deleteRestaurantImages(token, params) {
    try {
      const response = await instance.post(
        "/deleteRestaurantImage/restaurant",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async deleteMenuImages(token, params) {
    try {
      const response = await instance.post(
        "/deleteMenuImage/restaurant",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async createCuisine(params, token) {
    try {
      const response = await instance.post(
        "/create/cuisine",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  },

  async getcuisineList(token) {
    try {
      const response = await instance.get("/list/cuisine", {
        headers: {
          "x-access-token": token,
        },
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  },

  async cuisineDetails(token, params) {
    try {
      const response = await instance.post(
        "/details/cuisine",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async updateCuisine(params, token) {
    try {
      const response = await instance.post(
        "/update/cuisine",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteCuisineData(token, params) {
    try {
      const response = await instance.post(
        "/delete/cuisine",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);

      return response?.data;
    } catch (error) {
      console.log({ error });
      return error.response;
    }
  },

  async reviewsList(params, token) {
    try {
      const response = await instance.post(
        "/list/review",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteReviews(token, params) {
    try {
      const response = await instance.delete(`/delete/review/${params.id}`, {
        headers: {
          "x-access-token": token,
        },
      });
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  },

  async UpdateReviews(token, params) {
    try {
      const response = await instance.post(
        "/update/review",

        { ...params },

        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
