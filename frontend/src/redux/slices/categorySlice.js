import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseURL";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// actions

const resetCategory = createAction("category/RESET_CATEGORY");

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
      thunkAPI.dispatch(resetCategory());
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
// update category action
export const updateCategoryAction = createAsyncThunk(
  "category/updateCategory",
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
        `${baseURL}categories/update/${data?.id}`,
        {
          title: data?.title,
        },
        config
      );
      thunkAPI.dispatch(resetCategory());
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);
// delete category action
export const deleteCategoryAction = createAsyncThunk(
  "category/deleteCategory",
  async (id, thunkAPI) => {
    const token = cookies?.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(
        `${baseURL}categories/delete/${id}`,
        config
      );
      thunkAPI.dispatch(resetCategory());
      return response?.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);
// fetch category action
export const fetchCategoryAction = createAsyncThunk(
  "category/fetchCategory",
  async (id, thunkAPI) => {
    const token = cookies?.get("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${baseURL}categories/${id}`, config);
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
      state.isEdited = false;
    });

    builder.addCase(resetCategory, (state, action) => {
      state.isEdited = false;
    });

    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.category = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isEdited = true;
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
    // update category
    builder.addCase(updateCategoryAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isEdited = false;
    });
    builder.addCase(updateCategoryAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.updatedCategory = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isEdited = true;
    });
    builder.addCase(updateCategoryAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isEdited = false;
    });
    // delete category
    builder.addCase(deleteCategoryAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isEdited = false;
    });
    builder.addCase(deleteCategoryAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.deletedCategory = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isEdited = true;
    });
    builder.addCase(deleteCategoryAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isEdited = false;
    });
    // fetch category
    builder.addCase(fetchCategoryAction.pending, (state, action) => {
      state.isLoading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchCategoryAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.updatedCategory = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchCategoryAction.rejected, (state, action) => {
      state.isLoading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default categorySlice.reducer;
