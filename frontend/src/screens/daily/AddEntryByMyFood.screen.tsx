// From https://react-hook-form.com/ edited by Tanhapon Tosirikul 2781155t
import { Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import {
  useAppNavigation,
  useAppRoute,
  useDate,
  useUser,
} from "../../libs/hook";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { RootState } from "../../features/store";
import { useFetchFoodVariantsQuery } from "../../services/FoodVariantService";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
import NutritionExpenseSummary from "../../components/NutritionExpenseSummary";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useCreateEntryByMyFoodMutation } from "../../services/DailyFoodLogService";
import { DatePicker } from "../../components/DatePicker";

const AddEntryByMyFood = () => {
  const navigation = useAppNavigation();
  const user = useUser();
  const dateString = useSelector((state: RootState) => state.date.date);
  const date = useDate();
  const { foodvariant_id } = useAppRoute<"AddEntryByMyFood">();
  const [createEntryByMyFood] = useCreateEntryByMyFoodMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: foodVariant }: { data: FoodVariant | undefined } =
    useFetchFoodVariantsQuery(
      { user_id: user?.id },
      {
        selectFromResult: ({ data, error, isLoading }) => ({
          data: data?.find(
            (foodvarint: FoodVariant) => foodvarint.id === foodvariant_id
          ),
        }),
      }
    );
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleSubmit(submitEntryByMyFood)}
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
      number_of_servings: "1",
      meal_type: "",
      brand: foodVariant?.brand_snapshot,
      description: foodVariant?.description_snapshot,
      serving_size: foodVariant?.serving_size_snapshot,
      calories: foodVariant?.calories_snapshot,
      carbs_gram: foodVariant?.carbs_gram_snapshot,
      fat_gram: foodVariant?.fat_gram_snapshot,
      protein_gram: foodVariant?.protein_gram_snapshot,
      expense: foodVariant?.expense.toString(),
    },
    mode: "onChange",
  });

  if (!foodVariant) {
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
    parseFloat(foodVariant.carbs_gram_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodVariant.carbs_gram_snapshot.toString()) * servings;
  const fatGram =
    servings === -1 ||
    parseFloat(foodVariant.fat_gram_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodVariant.fat_gram_snapshot.toString()) * servings;
  const proteinGram =
    servings === -1 ||
    parseFloat(foodVariant.protein_gram_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodVariant.protein_gram_snapshot.toString()) * servings;
  const calories =
    servings === -1 ||
    parseFloat(foodVariant.calories_snapshot.toString()) === -1
      ? 0
      : parseFloat(foodVariant.calories_snapshot.toString()) * servings;
  const expense =
    servings === -1 || parseFloat(watch("expense") || "0") === -1
      ? 0
      : parseFloat(watch("expense") || "0") * servings;

  const submitEntryByMyFood: SubmitHandler<any> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await createEntryByMyFood({
        ...data,
        foodvariant_id: foodVariant?.id,
        user_id: user?.id,
        goal_id: user?.goal.id,
        date: date,
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
            <DatePicker />
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
            <Text fontSize="sm">{foodVariant.brand_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Description {""}</Text>
            <Text fontSize="sm">{foodVariant.description_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Serving Size {""}</Text>
            <Text fontSize="sm">{foodVariant.serving_size_snapshot}</Text>
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
                {errors.expense && (
                  <Text role="alert" style={{ color: "red" }}>
                    {errors.expense.message?.toString()}
                  </Text>
                )}
              </HStack>
              <Controller
                name="expense"
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
            <Text fontSize="sm">{foodVariant.calories_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Carbs (g) {""}</Text>
            <Text fontSize="sm">{foodVariant.carbs_gram_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Protein (g) {""}</Text>
            <Text fontSize="sm">{foodVariant.protein_gram_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Fat (g) {""}</Text>
            <Text fontSize="sm">{foodVariant.fat_gram_snapshot}</Text>
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

export default AddEntryByMyFood;
