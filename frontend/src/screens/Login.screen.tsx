// From https://docs.nativebase.io/login-signup-forms edited by Tanhapon Tosirikul 2781155t
import {
  Alert,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect } from "react";
import { RootState, useAppThunkDispatch } from "../features/store";
import { clearMessage } from "../features/slices/messageSlice";
import { login } from "../features/slices/authSlice";
import { useSelector } from "react-redux";
import {
  Box,
  Center,
  Heading,
  FormControl,
  Link,
  Input,
  Button,
  HStack,
  VStack,
  Text,
} from "native-base";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface Props {
  navigation: any;
}

interface IFormInput {
  email: string;
  password: string;
}

export const Login: React.FC<Props> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { message } = useSelector((state: RootState) => state.message);

  const dispatch = useAppThunkDispatch();

  useEffect(() => {
    if (message !== "") {
      Alert.alert(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const signin: SubmitHandler<IFormInput> = async (data) => {
    dispatch(
      login({
        email: data.email,
        password: data.password,
      })
    );
  };
  function dismissKeyboard() {
    if (Platform.OS != "web") {
      Keyboard.dismiss();
    }
  }
  return (
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
      <Center flex={1} px="3">
        <Center w="100%">
          <Box safeArea p="2" py="8" w="90%" maxW="300">
            <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Welcome to CaloriBudget
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: "warmGray.200",
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs"
            >
              Sign in to continue!
            </Heading>
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Controller
                  name="email"
                  rules={{ required: true }}
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Input
                      onChangeText={(value) => onChange(value)}
                      autoCapitalize="none"
                      isRequired={true}
                    />
                  )}
                />
                {errors.email?.type === "required" && (
                  <Text role="alert" style={{ color: "red" }}>
                    email is required
                  </Text>
                )}
              </FormControl>

              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type="password"
                      onChangeText={(value) => onChange(value)}
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.password?.type === "required" && (
                  <Text role="alert" style={{ color: "red" }}>
                    password is required
                  </Text>
                )}
              </FormControl>

              <Button
                mt="2"
                colorScheme="darkBlue"
                onPress={handleSubmit(signin)}
              >
                Sign in
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  I'm a new user.{" "}
                </Text>
                <Link
                  _text={{
                    color: "darkBlue.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={() => navigation.navigate("Signup")}
                >
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </Center>
    </TouchableWithoutFeedback>
  );
};
