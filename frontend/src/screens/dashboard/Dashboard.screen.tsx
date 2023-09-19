// Created by Tanhapon Tosirikul 2781155t
import { AspectRatio, Box, Center, Heading } from "native-base";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useAppNavigation, useUser } from "../../libs/hook";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import NutritionExpenseWeeklySummary from "../../components/NutritionExpenseWeeklySummary";

export const Dashboard: React.FC = () => {
  const user = useUser();
  const navigation = useAppNavigation();

  return (
    <ScrollView style={styles.container}>
      <Center>
        <Heading m={5}>Welcome, {user?.username}</Heading>
      </Center>
      <Box
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.300"
        borderWidth="1"
        margin={2}
      >
        <NutritionExpenseWeeklySummary />
      </Box>
      <Pressable onPress={() => navigation.navigate("AverageDailyExpense")}>
        <Box
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.300"
          borderWidth="1"
          margin={2}
        >
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Center>
                <FontAwesome name="money" size={150} color="#1a91ff" />
                {/* <AntDesign name="barchart" size={150} color="#1a91ff" /> */}
              </Center>
            </AspectRatio>
            <Center
              bg="darkBlue.500"
              _text={{
                color: "warmGray.50",
                fontWeight: "700",
                fontSize: "xl",
              }}
              bottom="0"
              px="3"
              py="1.5"
            >
              Average Daily Expense
            </Center>
          </Box>
        </Box>
      </Pressable>
      {/* </Center> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
