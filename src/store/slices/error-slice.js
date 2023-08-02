import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isError:false
}

const ErrorSlice = createSlice({
    name: 'Error',
    initialState: initialState,
    reducers: {
        setError(state, action) {
            state.isError=action.payload
        }
    }
})

export default ErrorSlice
export const ErrorActions = ErrorSlice.actions