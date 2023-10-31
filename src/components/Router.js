import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import ManageCategories from "../pages/categories/ManageCategories";
import ManageUser from "../pages/users/ManageUser";
import ManageRestaurant from "../pages/restaurant/ManageRestaurant";
import ManageCusine from "../pages/cusine/ManageCusine";
import ChangePassword from "../pages/changePassword/ChangePassword";
import Logout from "../pages/logout/Logout";
import Dashboard from "../pages/dashboard/Dashboard";
import LoginPage from "../pages/login/LoginPage";
import RestaurantForm from "./formsComponent/restaurantForm/RestaurantForm";
import CuisineForm from "./formsComponent/cuisineForm/CuisineForm";
import CategoriesForm from "./formsComponent/categoryForm/CategoriesForm";
import ManageReview from "./manageReview/ManageReview";

const RoutesComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/manage-users" element={<ManageUser />} />
        <Route path="/manage-categories" element={<Outlet />}>
          <Route path="category-form" element={<CategoriesForm />} />
          <Route path="category-form/:id" element={<CategoriesForm />} />
          <Route path="" element={<ManageCategories />} />
        </Route>
        <Route path="/manage-restaurants" element={<Outlet />}>
          <Route path="restaurant-form" element={<RestaurantForm />} />
          <Route path="restaurant-form/:id" element={<RestaurantForm />} />
          <Route path="restaurant-form/:id/manage-reviews" element={<ManageReview />} />
          <Route path="" element={<ManageRestaurant />} />
        </Route>
        <Route path="/manage-cuisine" element={<Outlet />}>
          <Route path="cuisine-form" element={<CuisineForm />} />
          <Route path="cuisine-form/:id" element={<CuisineForm />} />
          <Route path="" element={<ManageCusine />} />
        </Route>
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/manage-restaurants/restaurant-form"
          element={<RestaurantForm />}
        />
      </Routes>
    </div>
  );
};

export default RoutesComponent;
