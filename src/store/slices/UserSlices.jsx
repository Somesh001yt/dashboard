import React from 'react';
import {createSlice} from  '@reduxjs/toolkit'

const initialState ={
       users : [],
      
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUserList: (state, action) => {
            state.users=action.payload;
            console.log(action.payload)
          },
    
    }
})





export const reducer =  userSlice.reducer;
export const {setUserList} = userSlice.actions;
export default reducer;
