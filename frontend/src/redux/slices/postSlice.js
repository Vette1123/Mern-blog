import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

// create a post action
export const createPostAction = createAsyncThunk(
  "post/create",
  async (data, thunkAPI) => {
    try {
      const token = new Cookies().get("token");
      const formData = new FormData();
      formData.append("title", data?.title);
      formData.append("description", data?.description);
      formData.append("category", data?.category);
      formData.append("image", data?.image[0]);

      const response = await axios.post(`${baseURL}posts/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

// post slice
const postSlice = createSlice({
  name: "post",
  initialState: { posts: {} },
  extraReducers: (builder) => {
    //   create post
    builder.addCase(createPostAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isSuccess = false;
    });
    builder.addCase(createPostAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
      state.isSuccess = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createPostAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isSuccess = false;
    });
  },
});

export default postSlice.reducer;
