import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: 'three',
};

const threeSlice = createSlice({
    name: 'three',
    initialState,
    reducers: {
        changeName: (state, { payload }) => {
            state.name = payload;
        }
    },
});

export const { changeName } = threeSlice.actions;

export default threeSlice.reducer;
