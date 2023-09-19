// From https://redux-toolkit.js.org/ edited by Tanhapon Tosirikul 2781155t
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoint } from "../../../apiConfig";
import { RootState } from "../store";

export const apiSlice = createApi({
  reducerPath: "api/backend",
  baseQuery: fetchBaseQuery({
    baseUrl: endpoint,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.user?.userwithtoken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["foodentries", "foodvariants", "foods"],
  endpoints: () => ({}),
});

export const openfoodfactsAPISlice = createApi({
  reducerPath: "api/openfoodfacts",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://world.openfoodfacts.org/api/v2",
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as RootState).auth.user?.userwithtoken;
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: () => ({}),
});
