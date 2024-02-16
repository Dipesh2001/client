import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mainAxios } from "../app/api";
import service from "../services.json";
import { errorToast, successToast } from "../app/helper";

const initialState = {
  productsList: [],
  status: "idle",
  error: null,
  rowsCount: 0,
  updateStatus: false,
  editProductData: {},
};

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProductsAsync",
  async (state, { rejectWithValue }) => {
    try {
      const response = await mainAxios.get(service.fetchAllProducts);
      return response.data;
    } catch (err) {
      console.log({ err });
      return rejectWithValue(err);
    }
  }
);

export const addProductAsync = createAsyncThunk(
  "products/addProductAsync",
  async (state, { rejectWithValue }) => {
    try {
      const response = await mainAxios.post(service.addProduct, state);
      return response.data;
    } catch (err) {
      console.log({ err });
      return rejectWithValue(err);
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  "products/updateProductAsync",
  async ({ editId, values }, { rejectWithValue }) => {
    try {
      const response = await mainAxios.put(
        service.updateProduct.concat(`/${editId}`),
        values
      );
      return response.data;
    } catch (err) {
      console.log({ err });
      return rejectWithValue(err);
    }
  }
);

export const deleteProductAsync = createAsyncThunk(
  "products/deleteProductAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await mainAxios.delete(
        service.deleteProduct.concat(`/${id}`)
      );
      return response.data;
    } catch (err) {
      console.log({ err });
      return rejectWithValue(err);
    }
  }
);

// getProductAsync
export const getProductAsync = createAsyncThunk(
  "products/getProductAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await mainAxios.get(service.getProduct.concat(`/${id}`));
      console.log({ response });
      return response.data.data;
    } catch (err) {
      console.log({ err });
      return rejectWithValue(err);
    }
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetEditProduct: (state) => {
      state.editProductData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state, { payload }) => {
        state.status = "loading";
      })
      .addCase(fetchProductsAsync.fulfilled, (state, { payload }) => {
        return {
          ...state,
          productsList: payload.data,
          rowsCount: payload.rowsCount,
        };
      })
      .addCase(fetchProductsAsync.rejected, (state, { payload }) => {
        errorToast("Failed fetch products");
        state.status = "idle";
      })
      .addCase(addProductAsync.fulfilled, (state, { payload }) => {
        return {
          ...state,
          updateStatus: !state.updateStatus,
        };
      })
      .addCase(deleteProductAsync.fulfilled, (state, { payload }) => {
        successToast("Product deleted successfully.");
        return {
          ...state,
          updateStatus: !state.updateStatus,
        };
      })
      .addCase(getProductAsync.fulfilled, (state, { payload }) => {
        return {
          ...state,
          editProductData: payload,
        };
      })
      .addCase(updateProductAsync.fulfilled, (state, { payload }) => {
        successToast("Product updated successfully.");
        return {
          ...state,
          updateStatus: !state.updateStatus,
        };
      });
  },
  //
  //   extraReducers: (builder) => {
  // builder.addCase(fetchProductsAsync.rejected, (state, { payload }) => {
  //   console.log({ payload });
  // });
  // builder
  //   .addMatcher(isAnyOf(fetchProductsAsync.pending), (state, { payload }) => {
  //     console.log({ payload });
  //     return {
  //       ...state,
  //       productsList: payload.data,
  //       rowsCount: payload.rowsCount,
  //     };
  //   })
  //   .addMatcher(
  //     isAnyOf(fetchProductsAsync.rejected),
  //     (state, { payload }) => {
  //       console.log({ payload });
  //       return {
  //         ...state,
  //         error: payload,
  //       };
  //     }
  //   );
  //   },
});

// Action creators are generated for each case reducer function
export const { resetEditProduct } = productsSlice.actions;

export default productsSlice.reducer;
