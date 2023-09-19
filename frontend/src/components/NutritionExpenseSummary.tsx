// From https://github.com/bartgryszko/react-native-circular-progress edited by Tanhapon Tosirikul 2781155t
import React from "react";
import { Box, HStack, Text, VStack, View } from "native-base";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { formatDecimal } from "../libs/formatDecimal";

interface NutritionExpenseSummaryProps {
  goal: {
    carbs_percentage_goal: number;
    fat_percentage_goal: number;
    protein_percentage_goal: number;
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
}

const NutritionExpenseSummary: React.FC<NutritionExpenseSummaryProps> = ({
  goal,
  current,
}) => {
  return (
    <Box
      width="100%"
      p="0.5"
      colorScheme="light50"
      bg="white"
      borderColor="gray"
      marginTop={1}
    >
      <HStack justifyContent="space-evenly" alignItems="center" height="32">
        <VStack justifyContent="center" alignItems="center">
          <Text fontSize="sm" fontWeight="bold" marginBottom={1}>
            Expense
          </Text>

          <AnimatedCircularProgress
            size={69}
            width={2}
            fill={(current?.expense / goal?.expense_limit) * 100}
            tintColor="#be123c"
            onAnimationComplete={() => {}}
            backgroundColor="#e7e5e4"
          >
            {(fill) => (
              <View justifyContent="center" alignItems="center">
                <Text fontSize="xs">{formatDecimal(current?.expense)}</Text>
                <Text fontSize="xs">£</Text>
                <Text fontSize="xs">{goal?.expense_limit}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </VStack>

        <VStack flex={1} alignItems="center" justifyContent="space-around">
          <Text fontSize="sm" fontWeight="bold" marginBottom={1}>
            Calories
          </Text>
          <AnimatedCircularProgress
            size={69}
            width={2}
            fill={(current?.calories / goal?.calories_goal) * 100}
            tintColor="#4aa9ff"
            onAnimationComplete={() => {}}
            backgroundColor="#e7e5e4"
          >
            {(fill) => (
              <View justifyContent="center" alignItems="center">
                <Text fontSize="xs">{formatDecimal(current?.calories)}</Text>
                <Text fontSize="xs">kcal</Text>
                <Text fontSize="xs">{goal?.calories_goal} </Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </VStack>

        <VStack flex={1} alignItems="center">
          <Text fontSize="sm" fontWeight="bold" marginBottom={1}>
            Carb
          </Text>
          <AnimatedCircularProgress
            size={69}
            width={2}
            fill={(current?.carbs_gram / goal?.carbs_gram_goal) * 100}
            tintColor="#16a34a"
            onAnimationComplete={() => {}}
            backgroundColor="#e7e5e4"
          >
            {(fill) => (
              <View justifyContent="center" alignItems="center">
                <Text fontSize="xs">{formatDecimal(current?.carbs_gram)}</Text>
                <Text fontSize="xs">grams</Text>
                <Text fontSize="xs">{goal?.carbs_gram_goal}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </VStack>

        <VStack flex={1} alignItems="center">
          <Text fontSize="sm" fontWeight="bold" marginBottom={1}>
            Protein
          </Text>
          <AnimatedCircularProgress
            size={69}
            width={2}
            fill={(current?.protein_gram / goal?.protein_gram_goal) * 100}
            tintColor="#fb923c"
            onAnimationComplete={() => {}}
            backgroundColor="#e7e5e4"
          >
            {(fill) => (
              <View justifyContent="center" alignItems="center">
                <Text fontSize="xs">
                  {formatDecimal(current?.protein_gram)}
                </Text>
                <Text fontSize="xs">grams</Text>
                <Text fontSize="xs">{goal?.protein_gram_goal}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </VStack>

        <VStack flex={1} alignItems="center">
          <Text fontSize="sm" fontWeight="bold" marginBottom={1}>
            Fat
          </Text>
          <AnimatedCircularProgress
            size={69}
            width={2}
            fill={(current?.fat_gram / goal?.fat_gram_goal) * 100}
            tintColor="#fcd34d"
            onAnimationComplete={() => {}}
            backgroundColor="#e7e5e4"
          >
            {(fill) => (
              <View justifyContent="center" alignItems="center">
                <Text fontSize="xs">{formatDecimal(current?.fat_gram)}</Text>
                <Text fontSize="xs">grams</Text>
                <Text fontSize="xs">{goal?.fat_gram_goal} </Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </VStack>
      </HStack>
    </Box>
  );
};

export default NutritionExpenseSummary;
