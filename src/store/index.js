import { configureStore } from "@reduxjs/toolkit";
import   userSlice  from "./slices/UserSlices";
import cuisineSlice from "./slices/CuisineSlices"
import categorySlice from "./slices/CategorySlice"

const store =  configureStore({
    reducer :{
        users : userSlice,
        cuisine : cuisineSlice,
        category: categorySlice,
    }
})

export default store