// From https://docs.nativebase.io/progress#page-title edited by Tanhapon Tosirikul 2781155t
import { Text } from "react-native";
import React from "react";
import { Center, HStack, Progress } from "native-base";

interface NutritionExpenseSummaryBarProps {
  dayOfWeek: string;
  goal: {
    carbs_gram_goal: number;
    fat_gram_goal: number;
    protein_gram_goal: number;
    calories_goal: number;
    expense_limit: number;
  };

  current: {
    carbs_gram: number;
    fat_gram: number;
    protein_gram: number;
    calories: number;
    expense: number;
  };
  isSelected: boolean;
}

const NutritionExpenseSummaryBar: React.FC<NutritionExpenseSummaryBarProps> = ({
  dayOfWeek,
  goal,
  current,
  isSelected,
}) => {
  return (
    <HStack m={1} padding={1} background={isSelected ? "gray.200" : undefined}>
      <Center flex={0.1}>
        <Text>{dayOfWeek}</Text>
      </Center>
      <Progress
        _filledTrack={{
          bg: "rose.700",
        }}
        bgColor="rose.100"
        value={(current?.expense / goal?.expense_limit) * 100}
        flex={0.2}
        m={1}
      />
      <Progress
        _filledTrack={{
          bg: "darkBlue.300",
        }}
        bgColor="darkBlue.100"
        value={(current?.calories / goal?.calories_goal) * 100}
        flex={0.2}
        m={1}
      />
      <Progress
        _filledTrack={{
          bg: "green.600",
        }}
        bgColor="green.100"
        value={(current?.carbs_gram / goal?.carbs_gram_goal) * 100}
        flex={0.2}
        m={1}
      />
      <Progress
        _filledTrack={{
          bg: "orange.400",
        }}
        bgColor="orange.100"
        value={(current?.protein_gram / goal?.protein_gram_goal) * 100}
        flex={0.2}
        m={1}
      />
      <Progress
        _filledTrack={{
          bg: "amber.300",
        }}
        bgColor="amber.100"
        value={(current?.fat_gram / goal?.fat_gram_goal) * 100}
        flex={0.2}
        m={1}
      />
    </HStack>
  );
};

export default NutritionExpenseSummaryBar;
