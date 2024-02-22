import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const pdfsPropsSlice = createSlice({
  name: "pdfsProps",
  initialState,
  reducers: {
    updatePdfProps(state, action) {
      const { index, pdfProps } = action.payload;
      state[index] = pdfProps;
    },
    setError(state, action) {
      state = action.payload;
    },
  },
});

export default pdfsPropsSlice.reducer;
