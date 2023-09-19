// From https://redux-toolkit.js.org/ edited by Tanhapon Tosirikul 2781155t
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = { message: "" };

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      return { message: action.payload };
    },
    clearMessage: () => {
      return { message: "" };
    },
  },
});

const { actions } = messageSlice;
export const { setMessage, clearMessage } = actions;
