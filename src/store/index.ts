import { configureStore } from "@reduxjs/toolkit";
import threeReducer from "./features/threeSlice";

const store = configureStore({
    reducer: {
        three: threeReducer,
    },
});

export default store;