import { configureStore } from "@reduxjs/toolkit";
import LoadingSlice from "./slices/loading-slice";
import EditSlice from "./slices/edit-slice";
import ErrorSlice from "./slices/error-slice";

const store = configureStore({
  reducer: {
    Loading: LoadingSlice.reducer,
    Edit: EditSlice.reducer,
    Error: ErrorSlice.reducer
  }
})

export default store