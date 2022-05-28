import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import categorySlice from "../slices/categorySlice";
import postSlice from "../slices/postSlice";
import commentSlice from "../slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    category: categorySlice,
    post: postSlice,
    comment: commentSlice,
  },
});
