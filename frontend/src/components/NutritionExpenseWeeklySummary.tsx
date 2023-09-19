// From https://github.com/bartgryszko/react-native-circular-progress edited by Tanhapon Tosirikul 2781155t
import NutritionExpenseSummary from "./NutritionExpenseSummary";
import { Box, Center, Heading, Text } from "native-base";
import NutritionExpenseSummaryBar from "./NutritionExpenseSummaryBar";
import { useGetWeeklySummaryQuery } from "../services/DashboardService";
import { useUser } from "../libs/hook";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { RootState } from "../features/store";
import { TouchableOpacity } from "react-native";
import { useState } from "react";

const NutritionExpenseWeeklySummary = () => {
  const user = useUser();
  const dayOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const { today } = useSelector((state: RootState) => state.today);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(
    new Date(today).getDay()
  );
  const {
    data: weeklySummary,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetWeeklySummaryQuery({
    date: today,
    user_id: user?.id,
  });

  if (isLoading || isFetching) {
    return (
      <Box padding={1}>
        <Loading />
      </Box>
    );
  }

  if (!weeklySummary) {
    return (
      <Box padding={1}>
        <Heading color="darkBlue.500" fontSize="lg">
          Chart Error{"\n"}
        </Heading>
      </Box>
    );
  }

  if (weeklySummary) {
    return (
      <Box padding={1}>
        <Center>
          <Heading>Weekly Summary</Heading>
        </Center>
        <NutritionExpenseSummary
          goal={{
            carbs_percentage_goal:
              weeklySummary[selectedDayIndex].goal.carbs_percentage_goal,
            fat_percentage_goal:
              weeklySummary[selectedDayIndex].goal.fat_percentage_goal,
            protein_percentage_goal:
              weeklySummary[selectedDayIndex].goal.protein_percentage_goal,
            carbs_gram_goal:
              weeklySummary[selectedDayIndex].goal.carbs_gram_goal,
            fat_gram_goal: weeklySummary[selectedDayIndex].goal.fat_gram_goal,
            protein_gram_goal:
              weeklySummary[selectedDayIndex].goal.protein_gram_goal,
            calories_goal: weeklySummary[selectedDayIndex].goal.calories_goal,
            expense_limit: weeklySummary[selectedDayIndex].goal.expense_limit,
          }}
          current={{
            carbs_gram: weeklySummary[selectedDayIndex].totalCarbs,
            fat_gram: weeklySummary[selectedDayIndex].totalFat,
            protein_gram: weeklySummary[selectedDayIndex].totalProtein,
            calories: weeklySummary[selectedDayIndex].totalCalories,
            expense: weeklySummary[selectedDayIndex].totalExpense,
          }}
        />
        {weeklySummary.map((dailySummary: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedDayIndex(index);
            }}
          >
            <NutritionExpenseSummaryBar
              dayOfWeek={dayOfWeek[index]}
              goal={{
                carbs_gram_goal: dailySummary.goal.carbs_gram_goal,
                fat_gram_goal: dailySummary.goal.fat_gram_goal,
                protein_gram_goal: dailySummary.goal.protein_gram_goal,
                calories_goal: dailySummary.goal.calories_goal,
                expense_limit: dailySummary.goal.expense_limit,
              }}
              current={{
                carbs_gram: dailySummary.totalCarbs,
                fat_gram: dailySummary.totalFat,
                protein_gram: dailySummary.totalProtein,
                calories: dailySummary.totalCalories,
                expense: dailySummary.totalExpense,
              }}
              isSelected={selectedDayIndex === index}
            />
          </TouchableOpacity>
        ))}
      </Box>
    );
  }
  return (
    <Box padding={1}>
      <Heading color="darkBlue.500" fontSize="lg">
        Chart Error{"\n"}
      </Heading>
    </Box>
  );
};

export default NutritionExpenseWeeklySummary;
