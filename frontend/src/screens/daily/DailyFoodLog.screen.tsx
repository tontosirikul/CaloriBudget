// Created by Tanhapon Tosirikul 2781155t
import { MutableRefObject, useRef } from "react";
import {
  Center,
  Heading,
  SectionList,
  Box,
  Flex,
  View,
  Divider,
} from "native-base";
import NutritionExpenseSummary from "../../components/NutritionExpenseSummary";
import Loading from "../../components/Loading";
import FoodEntryItem from "../../components/FoodEntryItem";
import MealTypeSection from "../../components/MealTypeSection";
import { Swipeable } from "react-native-gesture-handler";
import { useDate, useUser } from "../../libs/hook";
import {
  SectionAfterTransform,
  useFetchDailyLogQuery,
} from "../../services/DailyFoodLogService";

export const DailyFoodLog = () => {
  const user = useUser();
  const date = useDate();
  const {
    data: dailyLog,
    isLoading,
    isFetching,
    error,
  } = useFetchDailyLogQuery({
    date: date.toISOString(),
    user_id: user?.id,
  });

  // ref of open row
  const openedFoodEntry = useRef<Swipeable>(
    null
  ) as MutableRefObject<Swipeable>;
  const setOpenFoodEntry = (ref: MutableRefObject<Swipeable>) => {
    openedFoodEntry.current = ref.current;
  };
  const handleOpenFoodEntry = (ref: MutableRefObject<Swipeable>) => {
    if (openedFoodEntry.current && openedFoodEntry.current !== ref.current) {
      openedFoodEntry.current.close();
    }
    setOpenFoodEntry(ref);
  };

  if (isLoading || isFetching) {
    return (
      <Flex flex={1}>
        <Box
          flex={1}
          p="0.5"
          colorScheme="light50"
          bg="white"
          borderColor="gray"
          marginTop={1}
        >
          <Loading />
        </Box>
      </Flex>
    );
  }

  if (
    error &&
    "data" in error &&
    JSON.stringify(error.data).includes("No DailyFoodLog Found")
  ) {
    return (
      <Flex flex={1}>
        <NutritionExpenseSummary
          goal={
            user?.goal || {
              id: 0,
              carbs_percentage_goal: 50,
              fat_percentage_goal: 20,
              protein_percentage_goal: 30,
              carbs_gram_goal: 20,
              fat_gram_goal: 20,
              protein_gram_goal: 20,
              calories_goal: 2000,
              expense_limit: 20,
            }
          }
          current={{
            carbs_gram: 0,
            fat_gram: 0,
            protein_gram: 0,
            calories: 0,
            expense: 0,
          }}
        />
        <Box
          flex={1}
          p="0.5"
          colorScheme="light50"
          bg="white"
          borderColor="gray"
          marginTop={1}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Center>
              <Heading color="darkBlue.500" fontSize="lg">
                No food entries for this date. {"\n"}
                Please select another date or create food entry for this date.
              </Heading>
            </Center>
          </View>
        </Box>
      </Flex>
    );
  }

  if (!dailyLog) {
    return (
      <Flex flex={1}>
        <Center>
          <Heading color="darkBlue.500" fontSize="lg">
            No data available.
          </Heading>
        </Center>
      </Flex>
    );
  }

  return (
    <Flex flex={1}>
      <NutritionExpenseSummary
        goal={
          dailyLog?.goal || {
            id: 20,
            carbs_percentage_goal: 50,
            fat_percentage_goal: 20,
            protein_percentage_goal: 30,
            carbs_gram_goal: 20,
            fat_gram_goal: 20,
            protein_gram_goal: 20,
            calories_goal: 2000,
            expense_limit: 20,
          }
        }
        current={{
          carbs_gram: dailyLog?.totalCarbsSum,
          fat_gram: dailyLog?.totalFatSum,
          protein_gram: dailyLog?.totalProteinSum,
          calories: dailyLog?.totalCaloriesSum,
          expense: dailyLog?.totalExpenseSum,
        }}
      />
      <Box
        flex={1}
        p="0.5"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
        marginTop={1}
      >
        <SectionList
          w="100%"
          sections={dailyLog?.foodentries as SectionAfterTransform[]}
          keyExtractor={(item: FoodEntry, index: number) => item.id + index}
          ItemSeparatorComponent={() => (
            <Center m={1}>
              <Divider width="95%"></Divider>
            </Center>
          )}
          renderItem={({ item }: { item: FoodEntry }) => (
            <FoodEntryItem
              item={item}
              key={item.id}
              handleOpenFoodEntry={handleOpenFoodEntry}
            />
          )}
          renderSectionHeader={({
            section,
          }: {
            section: SectionAfterTransform;
          }) => <MealTypeSection section={section} />}
        />
      </Box>
    </Flex>
  );
};
