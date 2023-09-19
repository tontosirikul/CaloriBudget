// From https://docs.nativebase.io/login-signup-forms edited by Tanhapon Tosirikul 2781155t
import { KeyboardAvoidingView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { RootState, useAppThunkDispatch } from "../features/store";
import { clearMessage } from "../features/slices/messageSlice";
import { register } from "../features/slices/authSlice";
import { useSelector } from "react-redux";
import {
  Center,
  Heading,
  Box,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Text,
  HStack,
  ScrollView,
} from "native-base";
import Slider from "@react-native-community/slider";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface Props {
  navigation: any;
}

export const Register: React.FC<Props> = ({ navigation }) => {
  const { message } = useSelector((state: RootState) => state.message);
  const [showError, setShowError] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      expense_limit: 20,
      calories_goal: 2000,
      protein_percentage_goal: 30,
      carbs_percentage_goal: 50,
      fat_percentage_goal: 20,
      protein_gram_goal: 150,
      carbs_gram_goal: 250,
      fat_gram_goal: 44,
    },
    mode: "onChange",
  });

  const dispatch = useAppThunkDispatch();

  const handleGoalChange = (field: string) => {
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

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const signup: SubmitHandler<RegisterFormData> = async (data) => {
    dispatch(
      register({
        username: data.username,
        email: data.email,
        password: data.password,
        carbs_percentage_goal: data.carbs_percentage_goal,
        fat_percentage_goal: data.fat_percentage_goal,
        protein_percentage_goal: data.protein_percentage_goal,
        carbs_gram_goal: data.carbs_gram_goal,
        fat_gram_goal: data.fat_gram_goal,
        protein_gram_goal: data.protein_gram_goal,
        calories_goal: data.calories_goal,
        expense_limit: data.expense_limit,
      })
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="never"
      >
        <Center flex={1} px="3">
          <Center w="100%">
            <Box safeArea p="2" w="90%" maxW="300" py="8">
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
                fontWeight="semibold"
              >
                Welcome to CaloriBudget
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontWeight="medium"
                size="xs"
              >
                Sign up to continue!
              </Heading>
              <VStack space={3} mt="5">
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>Username</Text>
                    {errors.username && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.username.message?.toString()}
                      </Text>
                    )}
                  </HStack>

                  <Controller
                    name="username"
                    rules={{
                      required: {
                        value: true,
                        message: "Username is required",
                      },
                    }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input onChangeText={onChange} autoCapitalize="none" />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>Email</Text>
                    {errors.email && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.email.message?.toString()}
                      </Text>
                    )}
                  </HStack>

                  <Controller
                    name="email"
                    rules={{
                      required: { value: true, message: "Email is required" },
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address",
                      },
                    }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input onChangeText={onChange} autoCapitalize="none" />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>Password</Text>
                    {errors.password && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.password.message?.toString()}
                      </Text>
                    )}
                  </HStack>

                  <Controller
                    name="password"
                    rules={{
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                      minLength: { value: 8, message: "Atleast 8 characters" },
                    }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type="password"
                        onChangeText={onChange}
                        autoCapitalize="none"
                        secureTextEntry
                        textContentType={"newPassword"}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>Confirm Password</Text>
                    {errors.confirmPassword && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.confirmPassword.message?.toString()}
                      </Text>
                    )}
                  </HStack>

                  <Controller
                    name="confirmPassword"
                    rules={{
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                      minLength: { value: 8, message: "Atleast 8 characters" },
                      validate: {
                        checkpassword: (value) =>
                          value == watch("password") ||
                          "Passwords do not match",
                      },
                    }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type="password"
                        onChangeText={onChange}
                        autoCapitalize="none"
                        secureTextEntry
                        textContentType={"password"}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>Expense Limit per day (£)</Text>
                    {errors.expense_limit && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.expense_limit.message?.toString()}
                      </Text>
                    )}
                  </HStack>
                  <Controller
                    name="expense_limit"
                    rules={{
                      // required: {
                      //   value: true,
                      //   message: "Expense limit is required",
                      // },
                      // min: {
                      //   value: 1,
                      //   message: "atleast 1",
                      // },
                      validate: {
                        validExpense: (value) =>
                          (value.toString() !== "" && value >= 1) ||
                          "must be at least 1",
                      },
                    }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        keyboardType="numeric"
                        isRequired={true}
                        onChangeText={(text) => {
                          const parsedValue = parseInt(text);
                          if (!isNaN(parsedValue)) {
                            onChange(parsedValue);
                          } else {
                            // onChange(0);
                          }
                        }}
                        defaultValue={value.toString()}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>Calories Goal per day (kcal)</Text>
                    {errors.calories_goal && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.calories_goal.message?.toString()}
                      </Text>
                    )}
                  </HStack>
                  <Controller
                    name="calories_goal"
                    rules={{
                      validate: {
                        validCalories: (value) =>
                          (value.toString() !== "" && value >= 1000) ||
                          "Calories goal must be at least 1,000",
                      },
                    }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        keyboardType="numeric"
                        isRequired={true}
                        onChangeText={(text) => {
                          const parsedValue = parseInt(text);
                          if (!isNaN(parsedValue)) {
                            onChange(parsedValue);
                            setValue(
                              "carbs_gram_goal",
                              Math.round(
                                ((watch("carbs_percentage_goal") / 100) *
                                  parsedValue) /
                                  4
                              )
                            );
                            setValue(
                              "protein_gram_goal",
                              Math.round(
                                ((watch("protein_percentage_goal") / 100) *
                                  parsedValue) /
                                  4
                              )
                            );
                            setValue(
                              "fat_gram_goal",
                              Math.round(
                                ((watch("fat_percentage_goal") / 100) *
                                  parsedValue) /
                                  9
                              )
                            );
                          } else {
                            // onChange(0);
                            setValue("carbs_gram_goal", 0);
                          }
                        }}
                        defaultValue={value.toString()}
                      />
                    )}
                  />
                </FormControl>
                <Heading fontSize="md">Macronutrients Distribution</Heading>
                <HStack justifyContent="space-between" my={2}>
                  <Text fontWeight="semibold">
                    Total:{" "}
                    {watch("carbs_percentage_goal") +
                      watch("protein_percentage_goal") +
                      watch("fat_percentage_goal")}
                    %
                  </Text>
                  {showError && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.protein_percentage_goal?.message ||
                        errors.carbs_percentage_goal?.message ||
                        errors.fat_percentage_goal?.message}
                    </Text>
                  )}
                </HStack>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>
                      Carbs: {watch("carbs_percentage_goal")}%{" "}
                      {watch("carbs_gram_goal")}g
                    </Text>
                    {/* {errors.carbs_percentage_goal && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.carbs_percentage_goal.message?.toString()}
                      </Text>
                    )} */}
                  </HStack>
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
                          value +
                            watch("protein_percentage_goal") +
                            watch("fat_percentage_goal") ==
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
                            Math.round((watch("calories_goal") * value) / 400)
                          );
                        }}
                        minimumTrackTintColor="#0077e6"
                        maximumTrackTintColor="#000000"
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>
                      Protein: {watch("protein_percentage_goal")}%{" "}
                      {watch("protein_gram_goal")}g
                    </Text>
                    {/* {errors.protein_percentage_goal && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.protein_percentage_goal.message?.toString()}
                      </Text>
                    )} */}
                  </HStack>
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
                          value +
                            watch("carbs_percentage_goal") +
                            watch("fat_percentage_goal") ==
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
                            Math.round((watch("calories_goal") * value) / 400)
                          );
                        }}
                        minimumTrackTintColor="#0077e6"
                        maximumTrackTintColor="#000000"
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <HStack justifyContent="space-between">
                    <Text>
                      Fat: {watch("fat_percentage_goal")}%{" "}
                      {watch("fat_gram_goal")}g
                    </Text>
                    {/* {errors.fat_percentage_goal && (
                      <Text role="alert" style={{ color: "red" }}>
                        {errors.fat_percentage_goal.message?.toString()}
                      </Text>
                    )} */}
                  </HStack>
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
                          value +
                            watch("carbs_percentage_goal") +
                            watch("protein_percentage_goal") ==
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
                            Math.round((watch("calories_goal") * value) / 900)
                          );
                        }}
                        minimumTrackTintColor="#0077e6"
                        maximumTrackTintColor="#000000"
                      />
                    )}
                  />
                </FormControl>

                <Button
                  mt="2"
                  colorScheme="darkBlue"
                  onPress={handleSubmit(signup)}
                  isDisabled={!isValid}
                >
                  Sign up
                </Button>
                <HStack mt="6" justifyContent="center">
                  <Text
                    fontSize="sm"
                    color="coolGray.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                  >
                    Already has an account.{" "}
                  </Text>
                  <Link
                    _text={{
                      color: "darkBlue.500",
                      fontWeight: "medium",
                      fontSize: "sm",
                    }}
                    onPress={() => navigation.navigate("Signin")}
                  >
                    Sign In
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
