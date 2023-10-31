import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    cuisine: [],
}

const cuisineSlice = createSlice({
    name:'cuisine',
    initialState,
    reducers:{
        setCuisineList: (state, action) => {
            state.cuisine=action.payload;
            console.log(action.payload)
          },
    
    }
})

export const reducer = cuisineSlice.reducer;
export const {setCuisineList} = cuisineSlice.actions;
export default reducer;
