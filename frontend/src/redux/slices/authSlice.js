import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const token = cookies.get("token") ? cookies.get("token") : null;
const user = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  isAuthenticated: token,
  user: user,
  isLoading: false,
  isRegister: false,
  appErr: undefined,
  serverErr: undefined,
};

// register user
export const registerAuthAction = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${baseURL}users/register`, data);
      cookies.set("token", response.data.token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      localStorage.setItem("userInfo", JSON.stringify(response?.data.data));
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

// login user
export const loginAuthAction = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${baseURL}users/login`, data);
      cookies.set("token", response.data.token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      localStorage.setItem("userInfo", JSON.stringify(response?.data.data));
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

// logout action

export const logoutAuthAction = createAsyncThunk(
  "auth/logoutUser",
  async (data, thunkAPI) => {
    try {
      cookies.remove("token", { path: "/" });
      localStorage.removeItem("userInfo");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);
// get user info
export const getUserInfoAction = createAsyncThunk(
  "auth/getUserInfo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}users/${data}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });
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
      state.user = "";
      state.appErr = "";
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
      state.appErr = undefined;
      state.serverErr = undefined;
      state.user = action.payload.data;
      state.isAuthenticated = action.payload.token;
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
      state.appErr = undefined;
      state.serverErr = undefined;
      state.user = action.payload.data;
      state.isAuthenticated = action.payload.token;
    });
    builder.addCase(loginAuthAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Logout
    builder.addCase(logoutAuthAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutAuthAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isAuthenticated = false;
      state.user = null;
    });
    builder.addCase(logoutAuthAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // Get user info
    builder.addCase(getUserInfoAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getUserInfoAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.userDetails = action.payload.data;
    });
    builder.addCase(getUserInfoAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export const { reset, toggleRegister } = authSlice.actions;

export default authSlice.reducer;
