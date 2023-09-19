import { openfoodfactsAPISlice } from "../features/slices/apiSlice";

const OpenFoodFactsService = openfoodfactsAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoodFromOpenFoodFact: builder.query<any, any>({
      query: (barcode) => ({
        url: `/search?code=${barcode}&fields=code,product_name,serving_size,energy-kcal_serving,proteins_serving,carbohydrates_serving,fat_serving,energy-kcal_100g,proteins_100g,carbohydrates_100g,fat_100g,brands`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useLazyGetFoodFromOpenFoodFactQuery } = OpenFoodFactsService;
