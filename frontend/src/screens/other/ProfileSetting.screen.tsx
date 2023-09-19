import React, { useEffect } from "react";
import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Box,
  HStack,
  Button,
  Text,
  Center,
  Input,
  Divider,
  FormControl,
  ScrollView,
} from "native-base";
import { useSelector } from "react-redux";
import { RootState, useAppThunkDispatch } from "../../features/store";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { clearMessage } from "../../features/slices/messageSlice";
import { changeProfile } from "../../features/slices/authSlice";
import { useAppNavigation, useUser } from "../../libs/hook";

interface IFormInput {
  username: string;
  email: string;
}

const ProfileSetting: React.FC = () => {
  const user = useUser();
  const navigation = useAppNavigation();
  const { message } = useSelector((state: RootState) => state.message);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: { email: user?.email || "", username: user?.username || "" },
    mode: "onChange",
  });
  const dispatch = useAppThunkDispatch();

  useEffect(() => {
    if (message !== "") {
      Alert.alert(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const changeProfileSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const actionResult = await dispatch(
        changeProfile({ id: user?.id?.toString() || "", data })
      );

      if (changeProfile.fulfilled.match(actionResult)) {
        navigation.goBack();
      }

      if (changeProfile.rejected.match(actionResult)) {
      }
    } catch (err) {}
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
              <Text fontSize="md">Username</Text>
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
                  <Input
                    variant="outline"
                    size="md"
                    width="40%"
                    defaultValue={value}
                    textAlign="right"
                    onChangeText={onChange}
                    autoCapitalize="none"
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
              <Text fontSize="md">Email</Text>
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
                  <Input
                    variant="outline"
                    size="md"
                    width="60%"
                    onChangeText={onChange}
                    autoCapitalize="none"
                    defaultValue={value}
                    textAlign="right"
                  />
                )}
              />
            </HStack>
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
            isDisabled={!isDirty || !isValid}
            onPress={handleSubmit(changeProfileSubmit)}
          >
            <Text color="white">Save</Text>
          </Button>
        </Center>
        <Center>
          {errors.username && (
            <Text role="alert" style={{ color: "red" }}>
              {errors.username.message?.toString()}
            </Text>
          )}
          {errors.email && (
            <Text role="alert" style={{ color: "red" }}>
              {errors.email.message?.toString()}
            </Text>
          )}
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default ProfileSetting;
