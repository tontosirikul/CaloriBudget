import { apiSlice } from "../features/slices/apiSlice";

type FetchDailyLogInput = {
  date: string;
  user_id: number | undefined;
};

export type DailyLogBeforeTransform = {
  id: number;
  date: string;
  goal: Goal;
  goal_id: number;
  user_id: number;
  foodentries: SectionBeforeTransform[];
};

export type SectionBeforeTransform = {
  mealtype: string;
  data: FoodEntry[];
};

export type DailyLogAfterTransform = {
  id: number;
  date: string;
  goal: Goal;
  goal_id: number;
  user_id: number;
  foodentries: SectionAfterTransform[];
  totalCaloriesSum: number;
  totalExpenseSum: number;
  totalCarbsSum: number;
  totalProteinSum: number;
  totalFatSum: number;
};

export type SectionAfterTransform = {
  mealtype: string;
  data: FoodEntry[];
  mealtypeCaloriesSum: number;
  mealtypeExpenseSum: number;
};

export type EditFoodEntry = {
  expense_snapshot: string | undefined;
  meal_type: string | undefined;
  number_of_servings: string | undefined;
};

const DailyFoodLogService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchDailyLog: builder.query<DailyLogAfterTransform, FetchDailyLogInput>({
      query: ({ date, user_id }) => ({
        url: `/dailylog?date=${date}&user_id=${user_id}`,
        method: "GET",
      }),
      providesTags: ["foodentries"],
      transformResponse: (
        response: DailyLogBeforeTransform
      ): DailyLogAfterTransform => {
        let totalCaloriesSum = 0;
        let totalExpenseSum = 0;
        let totalCarbsSum = 0;
        let totalProteinSum = 0;
        let totalFatSum = 0;

        const foodentries: SectionAfterTransform[] = response.foodentries.map(
          (section: SectionBeforeTransform): SectionAfterTransform => {
            let mealtypeCaloriesSum = 0;
            let mealtypeExpenseSum = 0;

            for (let entry of section.data) {
              const servings = entry.number_of_servings;
              mealtypeCaloriesSum += servings * (entry.calories_snapshot ?? 0);
              mealtypeExpenseSum += servings * (entry.expense_snapshot ?? 0);
              totalCarbsSum += servings * (entry.carbs_gram_snapshot ?? 0);
              totalProteinSum += servings * (entry.protein_gram_snapshot ?? 0);
              totalFatSum += servings * (entry.fat_gram_snapshot ?? 0);
            }
            totalCaloriesSum += mealtypeCaloriesSum;
            totalExpenseSum += mealtypeExpenseSum;

            return {
              ...section,
              mealtypeCaloriesSum,
              mealtypeExpenseSum,
            };
          }
        );

        return {
          ...response,
          foodentries,
          totalCaloriesSum,
          totalExpenseSum,
          totalCarbsSum,
          totalProteinSum,
          totalFatSum,
        };
      },
    }),
    createFoodAndEntry: builder.mutation<any, any>({
      query: (body) => ({
        url: "/dailylog/createfood",
        method: "POST",
        body,
      }),
      invalidatesTags: ["foodentries", "foods", "foodvariants"],
    }),
    createEntryByMyFood: builder.mutation<any, any>({
      query: (body) => ({
        url: "/dailylog/createentry/myfood",
        method: "POST",
        body,
      }),
      invalidatesTags: ["foodentries", "foodvariants"],
    }),
    createEntryByProvidedFood: builder.mutation<any, any>({
      query: (body) => ({
        url: "/dailylog/createentry/providedfood",
        method: "POST",
        body,
      }),
      invalidatesTags: ["foodentries", "foodvariants", "foods"],
    }),
    editFoodEntry: builder.mutation<
      FoodEntry,
      {
        entry_id: string;
        body: EditFoodEntry;
      }
    >({
      query: ({ entry_id, body }) => ({
        url: `/editfoodentry/${entry_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["foodentries"],
    }),
    deleteFoodEntry: builder.mutation<FoodEntry, string>({
      query: (entry_id) => ({
        url: `/deletefoodentry/${entry_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["foodentries"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useFetchDailyLogQuery,
  useCreateFoodAndEntryMutation,
  useCreateEntryByMyFoodMutation,
  useCreateEntryByProvidedFoodMutation,
  useEditFoodEntryMutation,
  useDeleteFoodEntryMutation,
} = DailyFoodLogService;
