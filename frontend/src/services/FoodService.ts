import { apiSlice } from "../features/slices/apiSlice";

const FoodService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchFood: builder.query<Food[], number | undefined>({
      query: (user_id) => ({
        url: `/users/${user_id}/food`,
        method: "GET",
      }),
      providesTags: ["foods"],
    }),
    getFoodFromBarcode: builder.query<Food, any>({
      query: ({ barcode, user_id }) => ({
        url: `/users/${user_id}/barcode/${barcode}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useFetchFoodQuery, useLazyGetFoodFromBarcodeQuery } =
  FoodService;
