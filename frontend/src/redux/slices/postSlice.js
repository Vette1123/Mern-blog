import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

const resetPost = createAction("post/reset");

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
      thunkAPI.dispatch(resetPost());
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

// get all posts action
export const getAllPostsAction = createAsyncThunk(
  "post/getAll",
  async (data, thunkAPI) => {
    try {
      const token = new Cookies().get("token");
      const response = await axios.get(`${baseURL}posts?category=${data}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
  reducers: {
    reset: (state) => {
      state.posts = {};
    },
  },
  extraReducers: (builder) => {
    //   create post
    builder.addCase(createPostAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPost, (state, action) => {
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
    });
    //  get all posts
    builder.addCase(getAllPostsAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getAllPostsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.postList = action.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getAllPostsAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
