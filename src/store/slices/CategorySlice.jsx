import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    category: [],
}

const categorySlice = createSlice({
    name:'category',
    initialState,
    reducers:{
        setCategoryList: (state, action) => {
            state.category=action.payload
            console.log(action.payload)
          },
    
    }
})

export const reducer = categorySlice.reducer;
export const {setCategoryList} = categorySlice.actions;
export default reducer;