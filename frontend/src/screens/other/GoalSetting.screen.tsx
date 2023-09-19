import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  HStack,
  Input,
  Center,
  Divider,
  Text,
  Button,
  ScrollView,
  VStack,
  Heading,
} from "native-base";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, useAppThunkDispatch } from "../../features/store";
import { clearMessage } from "../../features/slices/messageSlice";
import Slider from "@react-native-community/slider";
import { changeGoal } from "../../features/slices/authSlice";
import { useAppNavigation, useUser } from "../../libs/hook";

const GoalSetting: React.FC = () => {
  const user = useUser();
  const navigation = useAppNavigation();
  const { message } = useSelector((state: RootState) => state.message);
  const [showError, setShowError] = useState(false);
  const defaultValue = {
    expense_limit: user?.goal?.expense_limit,
    calories_goal: user?.goal?.calories_goal,
    carbs_percentage_goal: user?.goal?.carbs_percentage_goal,
    fat_percentage_goal: user?.goal?.fat_percentage_goal,
    protein_percentage_goal: user?.goal?.protein_percentage_goal,
    carbs_gram_goal: user?.goal?.carbs_gram_goal,
    fat_gram_goal: user?.goal?.fat_gram_goal,
    protein_gram_goal: user?.goal?.protein_gram_goal,
  };
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty, dirtyFields },
    trigger,
  } = useForm({
    defaultValues: defaultValue,
    mode: "onChange",
  });

  const dispatch = useAppThunkDispatch();

  const formValue = watch();

  function isEqual(
    formValue: GoalSettingData,
    defaultValue: GoalSettingData
  ): boolean {
    return (
      formValue.calories_goal == defaultValue.calories_goal &&
      formValue.carbs_percentage_goal == defaultValue.carbs_percentage_goal &&
      formValue.fat_percentage_goal == defaultValue.fat_percentage_goal &&
      formValue.protein_percentage_goal ==
        defaultValue.protein_percentage_goal &&
      formValue.carbs_gram_goal == defaultValue.carbs_gram_goal &&
      formValue.fat_gram_goal == defaultValue.fat_gram_goal &&
      formValue.protein_gram_goal == defaultValue.protein_gram_goal &&
      formValue.expense_limit == defaultValue.expense_limit
    );
  }

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleGoalChange = (field: string) => {
    // Trigger the validation for the carbPercentage field
    if (field === "carbs") {
      trigger("protein_percentage_goal");
      trigger("fat_percentage_goal");
    } else if (field === "protein") {
      trigger("carbs_percentage_goal");
      trigger("fat_percentage_goal");
    } else {
      trigger("protein_percentage_goal");
      trigger("carbs_percentage_goal");
    }
  };

  useEffect(() => {
    const hasError =
      errors.protein_percentage_goal?.message ||
      errors.carbs_percentage_goal?.message ||
      errors.fat_percentage_goal?.message;
    setShowError(!!hasError);
  }, [
    errors.protein_percentage_goal,
    errors.carbs_percentage_goal,
    errors.fat_percentage_goal,
  ]);

  const setNewGoal: SubmitHandler<GoalSettingData> = async (data) => {
    if (user) {
      try {
        const actionResult = await dispatch(
          changeGoal({ user_id: user.id, data })
        );
        if (changeGoal.fulfilled.match(actionResult)) {
          navigation.goBack();
        }

        if (changeGoal.rejected.match(actionResult)) {
          // handle rejection here
        }
      } catch (err) {
        // handle the error here
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="never"
      >
        <Box width="100%" p="4">
          <FormControl>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              height={7}
            >
              <Text fontSize="md">Expense Limit (£)</Text>
              <Controller
                name="expense_limit"
                rules={{
                  required: true,
                  validate: {
                    validExpense: (value) =>
                      (value !== undefined &&
                        value.toString() !== "" &&
                        value >= 1) ||
                      "must be at least 1",
                  },
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    keyboardType="numeric"
                    variant="outline"
                    size="md"
                    width="40%"
                    textAlign="right"
                    isRequired={true}
                    onChangeText={(text) => {
                      const parsedValue = parseInt(text);
                      if (!isNaN(parsedValue)) {
                        onChange(parsedValue);
                      } else {
                        // onChange(0);
                      }
                    }}
                    defaultValue={value?.toString()}
                  />
                )}
              />
            </HStack>
          </FormControl>
        </Box>
        <Center>
          <Divider width="95%" my={1} />
        </Center>
        <Box width="100%" p="4">
          <FormControl>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              height={7}
            >
              <Text fontSize="md">Calories Goal (kcal)</Text>
              <Controller
                name="calories_goal"
                rules={{
                  validate: {
                    validCalories: (value) =>
                      (value !== undefined &&
                        value.toString() !== "" &&
                        value >= 1000) ||
                      "Calories goal must be at least 1,000",
                  },
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    keyboardType="numeric"
                    isRequired={true}
                    width="40%"
                    textAlign="right"
                    onChangeText={(text) => {
                      const parsedValue = parseInt(text);
                      if (!isNaN(parsedValue)) {
                        onChange(parsedValue);
                        setValue(
                          "carbs_gram_goal",
                          Math.round(
                            (((watch("carbs_percentage_goal") ?? 0) / 100) *
                              (parsedValue ?? 0)) /
                              4
                          )
                        );
                        setValue(
                          "protein_gram_goal",
                          Math.round(
                            (((watch("protein_percentage_goal") ?? 0) / 100) *
                              (parsedValue ?? 0)) /
                              4
                          )
                        );
                        setValue(
                          "fat_gram_goal",
                          Math.round(
                            (((watch("fat_percentage_goal") ?? 0) / 100) *
                              (parsedValue ?? 0)) /
                              9
                          )
                        );
                      }
                    }}
                    defaultValue={value?.toString()}
                  />
                )}
              />
            </HStack>
          </FormControl>
        </Box>
        <Center>
          <Divider width="95%" my={1} />
        </Center>
        <Box paddingX={4} paddingY={4}>
          <Heading fontSize="md">Macronutrients Distribution</Heading>
        </Box>
        <Box paddingX={4}>
          <HStack justifyContent="space-between" my={2}>
            <Text fontWeight="semibold" fontSize={"md"}>
              Total:{" "}
              {(watch("carbs_percentage_goal") ?? 0) +
                (watch("protein_percentage_goal") ?? 0) +
                (watch("fat_percentage_goal") ?? 0)}
              %
            </Text>
            {showError && (
              <Text role="alert" style={{ color: "red" }} fontSize={"md"}>
                {errors.protein_percentage_goal?.message?.toString() ||
                  errors.carbs_percentage_goal?.message?.toString() ||
                  errors.fat_percentage_goal?.message?.toString()}
              </Text>
            )}
          </HStack>
        </Box>
        <Box p={4}>
          <FormControl>
            <Text my={2} fontSize="md">
              Carbs: {watch("carbs_percentage_goal")}%{" "}
              {watch("carbs_gram_goal")}g
            </Text>
            <Controller
              name="carbs_percentage_goal"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Carbs goal is required",
                },
                validate: {
                  checkSumPercentage: (value) =>
                    (value ?? 0) +
                      (watch("protein_percentage_goal") ?? 0) +
                      (watch("fat_percentage_goal") ?? 0) ==
                      100 || "Total % must be 100%",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Slider
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  value={value}
                  onSlidingComplete={(value) => {
                    handleGoalChange("carbs");
                  }}
                  onValueChange={(value) => {
                    onChange(value);
                    setValue(
                      "carbs_gram_goal",
                      Math.round(((watch("calories_goal") ?? 0) * value) / 400)
                    );
                  }}
                  minimumTrackTintColor="#0077e6"
                  maximumTrackTintColor="#000000"
                />
              )}
            />
          </FormControl>
          <FormControl>
            <Text my={2} fontSize="md">
              Protein: {watch("protein_percentage_goal")}%{" "}
              {watch("protein_gram_goal")}g
            </Text>
            <Controller
              name="protein_percentage_goal"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "protein goal is required",
                },
                validate: {
                  checkSumPercentage: (value) =>
                    (value ?? 0) +
                      (watch("carbs_percentage_goal") ?? 0) +
                      (watch("fat_percentage_goal") ?? 0) ==
                      100 || "Total % must be 100%",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Slider
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  value={value}
                  onSlidingComplete={(value) => {
                    // onChange(value);
                    handleGoalChange("protein");
                  }}
                  onValueChange={(value) => {
                    onChange(value);
                    setValue(
                      "protein_gram_goal",
                      Math.round(((watch("calories_goal") ?? 0) * value) / 400)
                    );
                  }}
                  minimumTrackTintColor="#0077e6"
                  maximumTrackTintColor="#000000"
                />
              )}
            />
          </FormControl>
          <FormControl>
            <Text my={2} fontSize="md">
              Fat: {watch("fat_percentage_goal")}% {watch("fat_gram_goal")}g
            </Text>
            <Controller
              name="fat_percentage_goal"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "fat goal is required",
                },
                validate: {
                  checkSumPercentage: (value) =>
                    (value ?? 0) +
                      (watch("carbs_percentage_goal") ?? 0) +
                      (watch("protein_percentage_goal") ?? 0) ==
                      100 || "Total % must be 100%",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Slider
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  value={value}
                  onSlidingComplete={(value) => {
                    handleGoalChange("fat");
                  }}
                  onValueChange={(value) => {
                    onChange(value);
                    setValue(
                      "fat_gram_goal",
                      Math.round(((watch("calories_goal") ?? 0) * value) / 900)
                    );
                  }}
                  minimumTrackTintColor="#0077e6"
                  maximumTrackTintColor="#000000"
                />
              )}
            />
          </FormControl>
        </Box>
        <Center>
          <Divider width="95%" my={1} />
        </Center>
        <Center>
          <Button
            bg="darkBlue.500"
            width="90%"
            shadow={3}
            my={5}
            isDisabled={isEqual(formValue, defaultValue) || !isValid}
            onPress={handleSubmit(setNewGoal)}
          >
            <Text color="white">Save</Text>
          </Button>
        </Center>
        {/* <Center>
          <Button
            bg="light.100"
            width="90%"
            shadow={3}
            my={2}
            onPress={() => reset(defaultValuesRef.current)}
          >
            <Text color="black">Reset</Text>
          </Button>
        </Center> */}
        <Center>
          <VStack>
            {errors.expense_limit && (
              <Text role="alert" style={{ color: "red" }}>
                {errors.expense_limit.message?.toString()}
              </Text>
            )}
            {errors.calories_goal && (
              <Text role="alert" style={{ color: "red" }}>
                {errors.calories_goal.message?.toString()}
              </Text>
            )}
          </VStack>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

interface PropsForm {
  goals: any;
  user: any;
  navigation: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default GoalSetting;
