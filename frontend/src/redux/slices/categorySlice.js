import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// actions

// create category action
export const createCategoryAction = createAsyncThunk(
  "category/createCategory",
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
        `${baseURL}categories/create`,
        {
          title: data?.title,
        },
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
// get all categories action
export const getAllCategoriesAction = createAsyncThunk(
  "category/getAllCategories",
  async (data, thunkAPI) => {
    const token = cookies?.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${baseURL}categories`, config);
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
const categorySlice = createSlice({
  name: "category",
  initialState: { category: {} },
  extraReducers: (builder) => {
    // create category
    builder.addCase(createCategoryAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.category = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createCategoryAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
    // get all categories
    builder.addCase(getAllCategoriesAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getAllCategoriesAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categoryList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getAllCategoriesAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default categorySlice.reducer;
