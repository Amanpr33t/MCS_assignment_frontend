import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEdit: false,
    title:null,
    taskInfo: null,
    completionDate: null,
    taskId:null
}

const EditSlice = createSlice({
    name: 'Edit',
    initialState: initialState,
    reducers: {
        setEdit(state, action) {
            state.title=action.payload.title
            state.isEdit = action.payload.isEdit
            state.taskInfo = action.payload.taskInfo
            state.completionDate = action.payload.completionDate
            state.taskId = action.payload.taskId
        }
    }
})

export default EditSlice
export const EditActions = EditSlice.actions