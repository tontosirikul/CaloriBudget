// From https://redux-toolkit.js.org/ edited by Tanhapon Tosirikul 2781155t
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loaduser } from "./authSlice";

const initialState = { date: new Date().toISOString() };

export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      return { date: action.payload };
    },
    clearDate: () => {
      return { date: new Date().toISOString() };
    },
  },
  extraReducers(builder) {
    builder.addCase(loaduser.fulfilled, () => {
      return { date: new Date().toISOString() };
    });
  },
});

const { actions } = dateSlice;
export const { setDate, clearDate } = actions;
