import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { mockUserData } from "../data/userData";

const initialState = {
    habits: mockUserData,
    status: "idle",
    error: null,
};

const userDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        addDate: (state, action) => {
            let dataCopy = [...current(state.habits[0].data)];
            
            const match = dataCopy.find(data => data.x === action.payload.x)
            if (!match) {
                state.habits[0].data.push(action.payload)
            }

            if (match) {
                const i = dataCopy.indexOf(match);
                state.habits[0].data.splice(i, 1, action.payload);
            }
        }
    }
}
);

export const { addDate, replaceDate } = userDataSlice.actions;


export default userDataSlice