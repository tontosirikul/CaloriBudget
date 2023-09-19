// From https://github.com/software-mansion/react-native-gesture-handler/issues/764#
// and https://www.seniortechclub.com/nuggets/swipe-left-to-delete/#:~:text=There%20is%20a%20common%20but,what%20you%20wish%20to%20do.
// Edited by Tanhapon Tosirikul 2781155t
import React, { MutableRefObject, useEffect } from "react";
import { Alert, Animated, Pressable } from "react-native";
import { Box, Text, HStack, Center, VStack, Divider } from "native-base";
import { Swipeable } from "react-native-gesture-handler";
import { useAppNavigation } from "../libs/hook";
import { FontAwesome } from "@expo/vector-icons";
import { useDeleteFoodVariantMutation } from "../services/FoodVariantService";

interface FoodVaritantItemProps {
  item: FoodVariant;
  handleOpenFoodVariant: (ref: MutableRefObject<Swipeable>) => void;
}

const FoodVariantItem: React.FC<FoodVaritantItemProps> = ({
  item,
  handleOpenFoodVariant,
}) => {
  const navigation = useAppNavigation();
  const swipeableRow = React.useRef<Swipeable>(
    null
  ) as MutableRefObject<Swipeable>;

  const [deleteFoodVariant] = useDeleteFoodVariantMutation();
  const handleDelete = async (id: string) => {
    try {
      const resultAction = await deleteFoodVariant(id);
    } catch (err) {
      console.error(err);
    }
  };
  const animatedEdit = new Animated.Value(1);
  const animatedDelete = new Animated.Value(1);

  const fadeInEdit = () => {
    Animated.timing(animatedEdit, {
      toValue: 0.4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOutEdit = () => {
    Animated.timing(animatedEdit, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate("EditVariant", {
        foodvariant_id: item.id,
      });
      swipeableRow.current?.close();
    });
  };

  const fadeInDelete = () => {
    Animated.timing(animatedDelete, {
      toValue: 0.4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutDelete = () => {
    Animated.timing(animatedDelete, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() =>
      Alert.alert(
        "Delete Confirmation",
        "Are you sure you want to delete entry?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => swipeableRow.current?.close(),
          },
          {
            text: "OK",
            onPress: () => {
              handleDelete(item.id);
              swipeableRow.current?.close();
            },
          },
        ]
      )
    );
  };
  const renderRightActions = () => {
    return (
      <Center flex={0.5}>
        <HStack width="100%" height="100%" flex={1}>
          <Pressable
            style={{ flex: 1 }}
            onPressIn={fadeInEdit}
            onPressOut={fadeOutEdit}
          >
            <Animated.View
              style={{
                backgroundColor: "#16a34a",
                opacity: animatedEdit,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Center>
                <FontAwesome name="pencil-square-o" size={24} color="white" />
              </Center>
            </Animated.View>
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPressIn={fadeInDelete}
            onPressOut={fadeOutDelete}
          >
            <Animated.View
              style={{
                backgroundColor: "#dc2626",
                opacity: animatedDelete,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Center>
                <FontAwesome name="trash-o" size={24} color="white" />
              </Center>
            </Animated.View>
          </Pressable>
        </HStack>
      </Center>
    );
  };

  return (
    <>
      <Swipeable
        renderRightActions={() => renderRightActions()}
        leftThreshold={0.4}
        ref={swipeableRow}
        onSwipeableWillOpen={() => handleOpenFoodVariant(swipeableRow)}
      >
        <Box p={2} background="white">
          <HStack>
            <Text fontWeight="semibold">{item.description_snapshot}</Text>
            {item.brand_snapshot && (
              <Text fontWeight="semibold"> from {item.brand_snapshot}</Text>
            )}
          </HStack>
          <HStack>
            <Center flex={0.3}>
              <VStack>
                <Text fontSize="xs">
                  {parseFloat(
                    item.serving_size_snapshot.split(" ")[0] ?? "0"
                  ).toString() +
                    " " +
                    item.serving_size_snapshot.split(" ")[1] ?? "units"}
                </Text>
              </VStack>
            </Center>
            <Divider orientation="vertical" mx={2}></Divider>
            <Center flex={0.7}>
              <HStack>
                <VStack mx={0.5}>
                  <Center>
                    <Text fontSize="xs">{item.expense ?? 0}</Text>
                    <Text fontSize="xs">(£)</Text>
                    <Text fontSize="xs">Expense</Text>
                  </Center>
                </VStack>
                <VStack mx={0.5}>
                  <Center>
                    <Text fontSize="xs">{item.calories_snapshot ?? 0} </Text>
                    <Text fontSize="xs">(g)</Text>
                    <Text fontSize="xs">Cal</Text>
                  </Center>
                </VStack>
                <VStack mx={1}>
                  <Center>
                    <Text fontSize="xs">{item.carbs_gram_snapshot ?? 0} </Text>
                    <Text fontSize="xs">(g)</Text>
                    <Text fontSize="xs">Carbs</Text>
                  </Center>
                </VStack>
                <VStack mx={0.5}>
                  <Center>
                    <Text fontSize="xs">
                      {item.protein_gram_snapshot ?? 0}{" "}
                    </Text>
                    <Text fontSize="xs">(g)</Text>
                    <Text fontSize="xs">Protein</Text>
                  </Center>
                </VStack>
                <VStack mx={0.5}>
                  <Center>
                    <Text fontSize="xs">{item.fat_gram_snapshot ?? 0} </Text>
                    <Text fontSize="xs">(g)</Text>
                    <Text fontSize="xs">Fat</Text>
                  </Center>
                </VStack>
              </HStack>
            </Center>
          </HStack>
        </Box>
      </Swipeable>
    </>
  );
};

export default FoodVariantItem;
