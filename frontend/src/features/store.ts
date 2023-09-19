// From https://redux-toolkit.js.org/ edited by Tanhapon Tosirikul 2781155t
import { configureStore, ThunkDispatch, Action } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { authSlice } from "./slices/authSlice";
import { messageSlice } from "./slices/messageSlice";
import { apiSlice, openfoodfactsAPISlice } from "./slices/apiSlice";
import { dateSlice } from "./slices/dateSlice";
import { todaySlice } from "./slices/todayDateSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    message: messageSlice.reducer,
    date: dateSlice.reducer,
    today: todaySlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [openfoodfactsAPISlice.reducerPath]: openfoodfactsAPISlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      openfoodfactsAPISlice.middleware
    ),

  devTools: true,
});
export default store;

export type RootState = ReturnType<typeof store.getState>;

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;

export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>();
