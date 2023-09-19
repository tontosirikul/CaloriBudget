// From https://redux-toolkit.js.org/ edited by Tanhapon Tosirikul 2781155t
import { createSlice } from "@reduxjs/toolkit";
import { loaduser } from "./authSlice";

const initialState = { today: new Date().toISOString() };

export const todaySlice = createSlice({
  name: "today",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loaduser.fulfilled, () => {
      return { today: new Date().toISOString() };
    });
  },
});

const { actions } = todaySlice;
