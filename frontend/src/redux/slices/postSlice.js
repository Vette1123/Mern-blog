import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

const resetPost = createAction("post/resetPost");
const resetPostEdit = createAction("post/resetUpdate");
const resetPostDelete = createAction("post/resetDelete");

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
      // thunkAPI.dispatch(resetPost());
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
      const response = await axios.get(
        `${baseURL}posts?category=${data.category}&page=${data.page}&limit=${data.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

//  Add Like to a post
export const toggleLikeAction = createAsyncThunk(
  "post/toggleLike",
  async (postId, thunkAPI) => {
    try {
      const token = new Cookies().get("token");
      const response = await axios.put(
        `${baseURL}posts/likes`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);
// toggle dislike to a post
export const toggleDislikeAction = createAsyncThunk(
  "post/toggleDislike",
  async (postId, thunkAPI) => {
    try {
      const token = new Cookies().get("token");
      const response = await axios.put(
        `${baseURL}posts/dislikes`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

// get post by id
export const getPostByIdAction = createAsyncThunk(
  "post/getById",
  async (postId, thunkAPI) => {
    try {
      const token = new Cookies().get("token");
      const response = await axios.get(`${baseURL}posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
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
// update post
export const updatePostAction = createAsyncThunk(
  "post/update",
  async (data, thunkAPI) => {
    try {
      const token = new Cookies().get("token");
      const response = await axios.put(
        `${baseURL}posts/update/${data?.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // thunkAPI.dispatch(resetPostEdit());
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);
// delete post
export const deletePostAction = createAsyncThunk(
  "post/delete",
  async (postId, thunkAPI) => {
    try {
      const token = new Cookies().get("token");
      const response = await axios.delete(`${baseURL}posts/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // thunkAPI.dispatch(resetPostDelete());
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
  initialState: {
    posts: {},
    isCreated: false,
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
    reset: (state) => {
      state.posts = {};
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
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
      state.isCreated = false;
    });
    builder.addCase(createPostAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
      state.isCreated = true;
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
    // toggle like
    builder.addCase(toggleLikeAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleLikeAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.likes = action?.payload;
    });
    builder.addCase(toggleLikeAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // toggle dislike
    builder.addCase(toggleDislikeAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(toggleDislikeAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.dislikes = action?.payload;
    });
    builder.addCase(toggleDislikeAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // get post by id
    builder.addCase(getPostByIdAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getPostByIdAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.singlePost = action.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getPostByIdAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // update post
    builder.addCase(updatePostAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPostEdit, (state, action) => {
      state.isUpdated = false;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isUpdated = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.updatedPost = action?.payload;
    });
    builder.addCase(updatePostAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // delete post
    builder.addCase(deletePostAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetPostDelete, (state, action) => {
      state.isDeleted = false;
    });

    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isDeleted = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.deletedPost = action?.payload;
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export const { reset, setPageNumber } = postSlice.actions;
export default postSlice.reducer;
