import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices"

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
})

export default store