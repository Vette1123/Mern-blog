import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

const cookies = new Cookies();

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

    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.isLoading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default commentSlice.reducer;
