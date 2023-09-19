// Created by Tanhapon Tosirikul 2781155t
import React, { MutableRefObject, useEffect } from "react";
import { Alert, Animated, Pressable } from "react-native";
import { Box, Text, HStack, Center, VStack, Divider } from "native-base";
import { Swipeable } from "react-native-gesture-handler";
import { useAppNavigation } from "../libs/hook";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

interface FoodItemProps {
  item: Food;
}

const FoodItem: React.FC<FoodItemProps> = ({ item }) => {
  return (
    <>
      <Box p={2} background="white">
        <HStack>
          <Text fontWeight="semibold">{item.description}</Text>
          {item.brand && <Text fontWeight="semibold"> from {item.brand}</Text>}
        </HStack>
        <HStack>
          <Center flex={0.3}>
            <VStack>
              <Text fontSize="xs">
                {parseFloat(item.serving_size.split(" ")[0] ?? "0").toString() +
                  " " +
                  item.serving_size.split(" ")[1] ?? "units"}
              </Text>
            </VStack>
          </Center>
          <Divider orientation="vertical" mx={2}></Divider>
          <Center flex={0.2}>
            <Ionicons
              name="shield-checkmark-outline"
              size={30}
              color={item.isGeneric === true ? "green" : "gray"}
            />
          </Center>
          <Divider orientation="vertical" mx={2}></Divider>
          <Center flex={0.5}>
            <HStack>
              <VStack mx={0.5}>
                <Center>
                  <Text fontSize="xs">{item.calories ?? 0} </Text>
                  <Text fontSize="xs">(g)</Text>
                  <Text fontSize="xs">Cal</Text>
                </Center>
              </VStack>
              <VStack mx={1}>
                <Center>
                  <Text fontSize="xs">{item.carbs_gram ?? 0} </Text>
                  <Text fontSize="xs">(g)</Text>
                  <Text fontSize="xs">Carbs</Text>
                </Center>
              </VStack>
              <VStack mx={0.5}>
                <Center>
                  <Text fontSize="xs">{item.protein_gram ?? 0} </Text>
                  <Text fontSize="xs">(g)</Text>
                  <Text fontSize="xs">Protein</Text>
                </Center>
              </VStack>
              <VStack mx={0.5}>
                <Center>
                  <Text fontSize="xs">{item.fat_gram ?? 0} </Text>
                  <Text fontSize="xs">(g)</Text>
                  <Text fontSize="xs">Fat</Text>
                </Center>
              </VStack>
            </HStack>
          </Center>
        </HStack>
      </Box>
    </>
  );
};

export default FoodItem;
