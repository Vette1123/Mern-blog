import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";

const initialState = {
  isAuthenticated: false,
  user: undefined,
  isLoading: false,
  isRegister: false,
  appErr: undefined,
  serverErr: undefined,
};

export const registerAuthAction = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${baseURL}users/register`, data);
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

export const loginAuthAction = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${baseURL}users/login`, data);
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = "";
      state.isAuthenticated = "";
      // state.user = "";
      // state.appErr = "";
      state.serverErr = "";
    },
    toggleRegister: (state) => {
      state.isRegister = !state.isRegister;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerAuthAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerAuthAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.user = action.payload;
    });
    builder.addCase(registerAuthAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Login
    builder.addCase(loginAuthAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginAuthAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.user = action.payload;
    });
    builder.addCase(loginAuthAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export const { reset, toggleRegister } = authSlice.actions;

export default authSlice.reducer;
