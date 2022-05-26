import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import categorySlice from "../slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    category: categorySlice,
  },
});
