import { apiSlice } from "../features/slices/apiSlice";

export type EditFoodVariant = {
  expense: string | undefined;
};

const FoodVariantService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchFoodVariants: builder.query<any, any>({
      query: ({ user_id }) => ({
        url: `/foodvariant/${user_id}`,
        method: "GET",
      }),
      providesTags: ["foodvariants"],
    }),
    editFoodVariant: builder.mutation<
      FoodVariant,
      { foodvariant_id: string; body: EditFoodVariant }
    >({
      query: ({ foodvariant_id, body }) => ({
        url: `/foodvariant/${foodvariant_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["foodvariants"],
    }),
    deleteFoodVariant: builder.mutation<FoodEntry, string>({
      query: (foodvariant_id) => ({
        url: `/foodvariant/${foodvariant_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["foodvariants"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchFoodVariantsQuery,
  useEditFoodVariantMutation,
  useDeleteFoodVariantMutation,
} = FoodVariantService;
