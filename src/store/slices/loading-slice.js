import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isLoading:true
}

const LoadingSlice = createSlice({
    name: 'Loading',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.isLoading=action.payload
        }
    }
})

export default LoadingSlice
export const LoadingActions = LoadingSlice.actions