// From https://react-hook-form.com/ edited by Tanhapon Tosirikul 2781155t
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useEffect, useState } from "react";
import {
  useAppNavigation,
  useAppRoute,
  useDate,
  useUser,
} from "../../libs/hook";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import {
  Center,
  Text,
  Flex,
  Heading,
  Box,
  FormControl,
  HStack,
  Input,
  Divider,
  Select,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NutritionExpenseSummary from "../../components/NutritionExpenseSummary";
import {
  EditFoodEntry,
  SectionAfterTransform,
  useEditFoodEntryMutation,
  useFetchDailyLogQuery,
} from "../../services/DailyFoodLogService";

const EditEntry = () => {
  const navigation = useAppNavigation();
  const user = useUser();
  const dateString = useSelector((state: RootState) => state.date.date);
  const date = useDate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { entry_id, meal_type } = useAppRoute<"EditEntry">();
  const [editFoodEntry] = useEditFoodEntryMutation();
  const { data: foodEntry }: { data: FoodEntry | undefined } =
    useFetchDailyLogQuery(
      { date: date.toISOString(), user_id: user?.id },
      {
        selectFromResult: ({ data, error, isLoading }) => ({
          data: data?.foodentries
            .find(
              (section: SectionAfterTransform) => section.mealtype === meal_type
            )
            ?.data.find((item: FoodEntry) => item.id === entry_id),
        }),
      }
    );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleSubmit(submitEditEntry)}
          disabled={isSubmitting}
        >
          <FontAwesome
            name="check"
            size={30}
            color="black"
            style={{ marginRight: 10 }}
          />
        </Pressable>
      ),
    });
  }, [navigation, dateString, isSubmitting]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      number_of_servings: foodEntry?.number_of_servings.toString(),
      meal_type: foodEntry?.meal_type.toString(),
      expense_snapshot: foodEntry?.expense_snapshot.toString(),
    },
    mode: "onChange",
  });

  if (!foodEntry) {
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

  const servings = parseFloat(watch("number_of_servings") || "1");
  const carbsGram =
    servings === -1 ||
    parseFloat(foodEntry.carbs_gram_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodEntry.carbs_gram_snapshot.toString()) * servings;
  const fatGram =
    servings === -1 || parseFloat(foodEntry.fat_gram_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodEntry.fat_gram_snapshot.toString()) * servings;
  const proteinGram =
    servings === -1 ||
    parseFloat(foodEntry.protein_gram_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodEntry.protein_gram_snapshot.toString()) * servings;
  const calories =
    servings === -1 || parseFloat(foodEntry.calories_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodEntry.calories_snapshot.toString()) * servings;
  const expense =
    servings === -1 || parseFloat(watch("expense_snapshot") || "0") === -1
      ? 0
      : parseFloat(watch("expense_snapshot") || "0") * servings;

  const submitEditEntry: SubmitHandler<EditFoodEntry> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await editFoodEntry({
        entry_id: foodEntry.id,
        body: data,
      })
        .unwrap()
        .then(() => navigation.popToTop());
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <Box width="100%" p="4" borderColor="black" borderWidth={0.2}>
        <HStack justifyContent="space-between">
          <Center flex={0.5}>
            <Text fontSize="md" fontWeight="semibold">
              {date
                ? date.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No date selected"}
            </Text>
          </Center>
          <FormControl flex={0.4}>
            <HStack alignItems="center" height={5} my={1}>
              <Controller
                name="meal_type"
                rules={{
                  required: {
                    value: true,
                    message: "Meal type is required",
                  },
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    selectedValue={value}
                    size="md"
                    style={Platform.OS === "android" ? { height: 30 } : {}}
                    accessibilityLabel="Select meal type"
                    onValueChange={onChange}
                    flex={1}
                    placeholder="Select meal type"
                    borderColor={errors.meal_type ? "error.500" : null}
                  >
                    <Select.Item label="Breakfast" value="BREAKFAST" />
                    <Select.Item label="Lunch" value="LUNCH" />
                    <Select.Item label="Dinner" value="DINNER" />
                    <Select.Item label="Snack" value="SNACK" />
                  </Select>
                )}
              />
            </HStack>
          </FormControl>
        </HStack>
      </Box>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="never"
      >
        <Box width="100%" p="4">
          <Text fontSize="sm" fontWeight="bold">
            Food Details
          </Text>

          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Brand</Text>
            <Text fontSize="sm">{foodEntry.brand_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Description {""}</Text>
            <Text fontSize="sm">{foodEntry.description_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Serving Size {""}</Text>
            <Text fontSize="sm">{foodEntry.serving_size_snapshot}</Text>
          </HStack>
          <FormControl>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              height={7}
              marginY={1}
            >
              <HStack>
                <Text fontSize="sm">Cost per Serving (£) {""}</Text>
                {errors.expense_snapshot && (
                  <Text role="alert" style={{ color: "red" }}>
                    {errors.expense_snapshot.message?.toString()}
                  </Text>
                )}
              </HStack>
              <Controller
                name="expense_snapshot"
                rules={{
                  required: { value: true, message: "(required)" },
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: "(invalid)",
                  },
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    keyboardType="decimal-pad"
                    variant="outline"
                    size="sm"
                    style={Platform.OS === "android" ? { height: 30 } : {}}
                    width="40%"
                    textAlign="right"
                    defaultValue={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </HStack>
          </FormControl>
        </Box>
        <Center>
          <Divider width="95%" my={0.5} />
        </Center>
        <Box width="100%" p="4">
          <Text fontSize="sm" fontWeight="bold">
            Nutrition Facts per Serving Size
          </Text>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Calories (kcal) {""}</Text>
            <Text fontSize="sm">{foodEntry.calories_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Carbs (g) {""}</Text>
            <Text fontSize="sm">{foodEntry.carbs_gram_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Protein (g) {""}</Text>
            <Text fontSize="sm">{foodEntry.protein_gram_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Fat (g) {""}</Text>
            <Text fontSize="sm">{foodEntry.fat_gram_snapshot}</Text>
          </HStack>
        </Box>
        <Center>
          <Divider width="95%" my={0.5} />
        </Center>
        <Box width="100%" p="4">
          <Text fontSize="sm" fontWeight="bold">
            Food Entry
          </Text>
          <FormControl>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              height={5}
            >
              <HStack>
                <Text fontSize="sm">Number of Servings {""}</Text>
                {errors.number_of_servings && (
                  <Text role="alert" style={{ color: "red" }}>
                    {errors.number_of_servings.message?.toString()}
                  </Text>
                )}
              </HStack>
              <Controller
                name="number_of_servings"
                rules={{
                  required: { value: true, message: "(required)" },
                  pattern: {
                    value: /^([1-9]\d*(\.\d{1,2})?|(0\.\d{1,2}))$/,
                    message: "(invalid)",
                  },
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    keyboardType="numeric"
                    isRequired={true}
                    width="40%"
                    textAlign="right"
                    variant="outline"
                    size="sm"
                    style={Platform.OS === "android" ? { height: 30 } : {}}
                    onChangeText={onChange}
                    defaultValue={value}
                    value={value}
                  />
                )}
              />
            </HStack>
          </FormControl>
        </Box>
        <Box p={1}>
          <NutritionExpenseSummary
            goal={
              user?.goal || {
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
              carbs_gram: !isNaN(carbsGram) ? carbsGram : 0,
              fat_gram: !isNaN(fatGram) ? fatGram : 0,
              protein_gram: !isNaN(proteinGram) ? proteinGram : 0,
              calories: !isNaN(calories) ? calories : 0,
              expense: !isNaN(expense) ? expense : 0,
            }}
          />
        </Box>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditEntry;
