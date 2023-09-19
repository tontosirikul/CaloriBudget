import { apiSlice } from "../features/slices/apiSlice";

const DashboardService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAverageDailyExpense: builder.query<any, any>({
      query: ({ days, user_id }) => ({
        url: `/dashboard/averagedailyexpense/${days}/${user_id}`,
        method: "GET",
      }),
      providesTags: ["foodentries"],
    }),
    getWeeklySummary: builder.query<any, any>({
      query: ({ date, user_id }) => ({
        url: `/dashboard/weeklysummary/${date}/${user_id}`,
        method: "GET",
      }),
      providesTags: ["foodentries"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAverageDailyExpenseQuery, useGetWeeklySummaryQuery } =
  DashboardService;
