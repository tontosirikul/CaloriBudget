import { Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import React, { useEffect } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  ScrollView,
  VStack,
} from "native-base";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RootState, useAppThunkDispatch } from "../../features/store";
import { clearMessage } from "../../features/slices/messageSlice";
import { useSelector } from "react-redux";
import { changePassword } from "../../features/slices/authSlice";
import { useAppNavigation, useUser } from "../../libs/hook";

type passwordSettingData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword: React.FC = () => {
  const user = useUser();
  const navigation = useAppNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { message } = useSelector((state: RootState) => state.message);

  const dispatch = useAppThunkDispatch();

  useEffect(() => {
    if (message !== "") {
      Alert.alert(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const newPasswordSubmit: SubmitHandler<passwordSettingData> = async (
    data
  ) => {
    try {
      const actionResult = await dispatch(
        changePassword({
          id: user?.id?.toString() || "",
          current_password: data.currentPassword,
          new_password: data.newPassword,
        })
      );
      if (changePassword.fulfilled.match(actionResult)) {
        navigation.goBack();
      }

      if (changePassword.rejected.match(actionResult)) {
      }
    } catch (err) {}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="never"
        style={{ backgroundColor: "white" }}
      >
        <Center w="100%">
          <Box safeArea p="2" w="90%" maxW="300" py="8">
            <VStack space={3} mt="5">
              <FormControl>
                <HStack justifyContent="space-between">
                  <Text>Current Password</Text>
                  {errors.currentPassword && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.currentPassword.message?.toString()}
                    </Text>
                  )}
                </HStack>

                <Controller
                  name="currentPassword"
                  rules={{
                    required: {
                      value: true,
                      message: "Current password is required",
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
                  <Text>New Password</Text>
                  {errors.newPassword && (
                    <Text role="alert" style={{ color: "red" }}>
                      {errors.newPassword.message?.toString()}
                    </Text>
                  )}
                </HStack>

                <Controller
                  name="newPassword"
                  rules={{
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    minLength: { value: 8, message: "Atleast 8 characters" },
                    validate: {
                      checksamepassword: (value) =>
                        value != watch("currentPassword") ||
                        "Use other password",
                    },
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
                  <Text>Confirm New Password</Text>
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
                        value == watch("newPassword") ||
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
              <Button
                mt="2"
                colorScheme="darkBlue"
                isDisabled={!isValid}
                onPress={handleSubmit(newPasswordSubmit)}
              >
                Save
              </Button>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;
