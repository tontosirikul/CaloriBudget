import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { RootState, useAppThunkDispatch } from "../../features/store";
import { useSelector } from "react-redux";
import { logout } from "../../features/slices/authSlice";
import {
  Box,
  HStack,
  Button,
  Text,
  Center,
  Divider,
  ScrollView,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useAppNavigation } from "../../libs/hook";

interface Props {}

export const Other: React.FC<Props> = () => {
  const navigation = useAppNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppThunkDispatch();

  const signout = async () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProfileSetting", { user: user })}
      >
        <Box width="100%" p="4">
          <HStack justifyContent="space-between" alignItems="center" height={7}>
            <HStack>
              <Box size={6}>
                <Center>
                  <FontAwesome name="user" size={24} color="#0077e6" />
                </Center>
              </Box>
              <Text fontSize="md" marginLeft={2}>
                Profile Setting
              </Text>
            </HStack>

            <FontAwesome name="angle-right" size={24} color="black" />
          </HStack>
        </Box>
      </TouchableOpacity>
      <Center>
        <Divider width="95%" my={1} />
      </Center>
      <TouchableOpacity
        onPress={() => navigation.navigate("GoalSetting", { user: user })}
      >
        <Box width="100%" p="4">
          <HStack justifyContent="space-between" alignItems="center" height={7}>
            <HStack>
              <Box size={6}>
                <Center>
                  <FontAwesome name="bullseye" size={24} color="#0077e6" />
                </Center>
              </Box>
              <Text fontSize="md" marginLeft={2}>
                Goal Setting
              </Text>
            </HStack>
            <FontAwesome name="angle-right" size={24} color="black" />
          </HStack>
        </Box>
      </TouchableOpacity>
      <Center>
        <Divider width="95%" my={1} />
      </Center>
      <TouchableOpacity
        onPress={() => navigation.navigate("ChangePassword", { user: user })}
      >
        <Box width="100%" p="4">
          <HStack justifyContent="space-between" alignItems="center" height={7}>
            <HStack>
              <Box size={6}>
                <Center>
                  <FontAwesome name="lock" size={24} color="#0077e6" />
                </Center>
              </Box>
              <Text fontSize="md" marginLeft={2}>
                Change Password
              </Text>
            </HStack>
            <FontAwesome name="angle-right" size={24} color="black" />
          </HStack>
        </Box>
      </TouchableOpacity>
      <Center>
        <Divider width="95%" my={1} />
      </Center>
      <Center>
        <Button onPress={signout} bg="red.500" width="90%" shadow={3} my={5}>
          <Text color="white">Log out</Text>
        </Button>
      </Center>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
