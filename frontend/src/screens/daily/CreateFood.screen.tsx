// From https://react-hook-form.com/ edited by Tanhapon Tosirikul 2781155t
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import {
  Box,
  Center,
  Text,
  Divider,
  FormControl,
  HStack,
  Input,
  Select,
} from "native-base";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import NutritionExpenseSummary from "../../components/NutritionExpenseSummary";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import { DatePicker } from "../../components/DatePicker";
import { useAppNavigation, useDate, useUser } from "../../libs/hook";
import { useCreateFoodAndEntryMutation } from "../../services/DailyFoodLogService";

interface CreateFoodProps {}

const CreateFood: React.FC<CreateFoodProps> = () => {
  const navigation = useAppNavigation();
  const user = useUser();
  const dateString = useSelector((state: RootState) => state.date.date);
  const date = useDate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createFoodAndEntry] = useCreateFoodAndEntryMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      meal_type: "",
      brand: "",
      description: "",
      serving_size: "",
      expense: "",
      calories: "",
      carbs_gram: "",
      fat_gram: "",
      protein_gram: "",
      number_of_servings: "1",
      isGeneric: false,
      barcode: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    navigation.setOptions({
      title: "Create Food & Entry",
      headerBackTitleVisible: false,
      headerTintColor: "black",
      headerRight: () => (
        <Pressable onPress={handleSubmit(submitFood)} disabled={isSubmitting}>
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

  const servings = parseFloat(watch("number_of_servings"));
  const carbsGram =
    servings === -1 || parseFloat(watch("carbs_gram")) === -1
      ? 0
      : parseFloat(watch("carbs_gram")) * servings;
  const fatGram =
    servings === -1 || parseFloat(watch("fat_gram")) === -1
      ? 0
      : parseFloat(watch("fat_gram")) * servings;
  const proteinGram =
    servings === -1 || parseFloat(watch("protein_gram")) === -1
      ? 0
      : parseFloat(watch("protein_gram")) * servings;
  const calories =
    servings === -1 || parseFloat(watch("calories")) === -1
      ? 0
      : parseFloat(watch("calories")) * servings;
  const expense =
    servings === -1 || parseFloat(watch("expense")) === -1
      ? 0
      : parseFloat(watch("expense")) * servings;

  const submitFood: SubmitHandler<any> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await createFoodAndEntry({
        ...data,
        user_id: user?.id,
        goal_id: user?.goal.id,
        date: date,
      }).unwrap();
      navigation.popToTop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                      fontSize={10}
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
            <FormControl>
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
                <Controller
                  name="brand"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      variant="outline"
                      size="sm"
                      style={Platform.OS === "android" ? { height: 30 } : {}}
                      width="40%"
                      textAlign="right"
                      multiline
                      placeholder="Eg. Aldi (optional)"
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                  )}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                height={7}
                marginY={1}
              >
                <HStack>
                  <Text fontSize="sm">Description {""}</Text>
                  {errors.description && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.description.message?.toString()}
                    </Text>
                  )}
                </HStack>
                <Controller
                  name="description"
                  rules={{
                    required: {
                      value: true,
                      message: "(required)",
                    },
                  }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      variant="outline"
                      size="sm"
                      style={Platform.OS === "android" ? { height: 30 } : {}}
                      width="40%"
                      placeholder="Eg. Chicken breast"
                      textAlign="right"
                      onChangeText={onChange}
                      autoCapitalize="none"
                      multiline
                    />
                  )}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                height={7}
                marginY={1}
              >
                <HStack>
                  <Text fontSize="sm">Serving Size {""}</Text>
                  {errors.serving_size && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.serving_size.message?.toString()}
                    </Text>
                  )}
                </HStack>
                <Controller
                  name="serving_size"
                  rules={{
                    required: {
                      value: true,
                      message: "(required)",
                    },
                    pattern: {
                      value: /^(\d+(\.\d+)?)(\s+\w+)$/,
                      message: "Invalid",
                    },
                  }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      variant="outline"
                      size="sm"
                      style={Platform.OS === "android" ? { height: 30 } : {}}
                      width="40%"
                      placeholder="Eg. 100 g"
                      textAlign="right"
                      multiline
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                  )}
                />
              </HStack>
            </FormControl>
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
            <FormControl>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                height={7}
                marginY={1}
              >
                <HStack>
                  <Text fontSize="sm">Calories (kcal) {""}</Text>
                  {errors.calories && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.calories.message?.toString()}
                    </Text>
                  )}
                </HStack>
                <Controller
                  name="calories"
                  rules={{
                    required: { value: true, message: "(required)" },
                    // validate: {
                    //   validCalories: (value) =>
                    //     (value.toString() !== "" && value >= 0) || "(required)",
                    // },
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
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
                      size="sm"
                      style={Platform.OS === "android" ? { height: 30 } : {}}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                height={7}
                marginY={1}
              >
                <HStack>
                  <Text fontSize="sm">Carbs (g) {""}</Text>
                  {errors.carbs_gram && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.carbs_gram.message?.toString()}
                    </Text>
                  )}
                </HStack>
                <Controller
                  name="carbs_gram"
                  rules={{
                    // validate: {
                    //   validCarbs: (value) =>
                    //     (value.toString() !== "" && value >= 0) || "(required)",
                    // },
                    required: { value: true, message: "(required)" },
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
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
                      value={value}
                    />
                  )}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                height={7}
                marginY={1}
              >
                <HStack>
                  <Text fontSize="sm">Protein (g) {""}</Text>
                  {errors.protein_gram && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.protein_gram.message?.toString()}
                    </Text>
                  )}
                </HStack>
                <Controller
                  name="protein_gram"
                  rules={{
                    // validate: {
                    //   validProtein: (value) =>
                    //     (value.toString() !== "" && value >= 0) || "(required)",
                    // },
                    required: { value: true, message: "(required)" },
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
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
                      value={value}
                    />
                  )}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                height={7}
                marginY={1}
              >
                <HStack>
                  <Text fontSize="sm">Fat (g) {""}</Text>
                  {errors.fat_gram && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.fat_gram.message?.toString()}
                    </Text>
                  )}
                </HStack>
                <Controller
                  name="fat_gram"
                  rules={{
                    // validate: {
                    //   validFat: (value) =>
                    //     (value.toString() !== "" && value >= 0) || "(required)",
                    // },
                    required: { value: true, message: "(required)" },
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
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
                      value={value}
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
    </>
  );
};

export default CreateFood;
