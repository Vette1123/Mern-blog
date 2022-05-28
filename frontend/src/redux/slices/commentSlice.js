import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const resetComment = createAction("comment/RESET_COMMENT");
const ay5ara = createAction("comment/AY5ARA");

// create comment action
export const createCommentAction = createAsyncThunk(
  "comment/createComment",
  async (data, thunkAPI) => {
    const token = cookies?.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}comments/create`,
        data,
        config
      );
      thunkAPI.dispatch(resetComment());
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);
// delete comment action
export const deleteCommentAction = createAsyncThunk(
  "comment/deleteComment",
  async (data, thunkAPI) => {
    const token = cookies?.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(`${baseURL}comments/${data}`, config);
      thunkAPI.dispatch(resetComment());
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

// update comment action
export const updateCommentAction = createAsyncThunk(
  "comment/updateComment",
  async (data, thunkAPI) => {
    const token = cookies?.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `${baseURL}comments/${data.id}`,
        data,
        config
      );
      thunkAPI.dispatch(ay5ara());
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);
// get comment action
export const getCommentAction = createAsyncThunk(
  "comment/getComment",
  async (data, thunkAPI) => {
    const token = cookies?.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${baseURL}comments/${data}`, config);
      thunkAPI.dispatch(resetComment());
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

// category slice
const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: {},
  },
  extraReducers: (builder) => {
    builder.addCase(createCommentAction.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(resetComment, (state, action) => {
      state.isUpdated = false;
    });

    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.isLoading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // delete comment
    builder.addCase(deleteCommentAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.isLoading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(deleteCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // update comment
    builder.addCase(updateCommentAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateCommentAction.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.isLoading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(updateCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // get comment
    builder.addCase(getCommentAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(ay5ara, (state, action) => {
      state.ra5ara = false;
    });
    builder.addCase(getCommentAction.fulfilled, (state, action) => {
      state.commentDetails = action.payload;
      state.isLoading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.ra5ara = true;
    });
    builder.addCase(getCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default commentSlice.reducer;
