// Created by Tanhapon Tosirikul 2781155t
import { Pressable, View } from "react-native";
import React, { MutableRefObject, useRef, useState } from "react";
import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  Input,
  Text,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useAppNavigation, useUser } from "../../../libs/hook";
import { FlatList, Swipeable } from "react-native-gesture-handler";
import Loading from "../../../components/Loading";
import FoodVariantItem from "../../../components/FoodVariantItem";
import { useFetchFoodVariantsQuery } from "../../../services/FoodVariantService";

const MyFoods: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useAppNavigation();
  const user = useUser();
  const {
    data: foodvariants,
    isLoading,
    isFetching,
    error,
  } = useFetchFoodVariantsQuery({
    user_id: user?.id,
  });

  const filteredFoodVariants = foodvariants?.filter(
    (foodvariant: { brand_snapshot: string; description_snapshot: string }) =>
      foodvariant.brand_snapshot
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      foodvariant.description_snapshot
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  let content;

  // ref of open row
  const openedFoodVariant = useRef<Swipeable>(
    null
  ) as MutableRefObject<Swipeable>;
  const setOpenFoodVariant = (ref: MutableRefObject<Swipeable>) => {
    openedFoodVariant.current = ref.current;
  };
  const handleOpenFoodVariant = (ref: MutableRefObject<Swipeable>) => {
    if (
      openedFoodVariant.current &&
      openedFoodVariant.current !== ref.current
    ) {
      openedFoodVariant.current.close();
    }
    setOpenFoodVariant(ref);
  };

  if (isLoading || isFetching) {
    content = (
      <Box
        flex={1}
        p="0.5"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
        marginTop={1}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Center>
            <Loading />
          </Center>
        </View>
      </Box>
    );
  }

  if (error) {
    content = (
      <Box
        flex={1}
        p="0.5"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
        marginTop={1}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Center>
            <Heading color="darkBlue.500" fontSize="lg">
              No food entries for this date. {"\n"}
              Please select another date or create food entry for this date.
            </Heading>
          </Center>
        </View>
      </Box>
    );
  }

  if (!foodvariants) {
    <Flex flex={1}>
      <Box
        width="100%"
        p="4"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
      >
        <HStack justifyContent="space-between" alignItems="center" height={7}>
          <HStack>
            <Text fontSize="md" fontWeight="bold">
              Foods with Expense
            </Text>
          </HStack>
          <Pressable onPress={() => navigation.navigate("CreateFood")}>
            <FontAwesome name="pencil-square-o" size={30} color="black" />
          </Pressable>
        </HStack>
      </Box>

      <Box
        flex={1}
        p="0.5"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
        marginTop={1}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Center>
            <Heading color="darkBlue.500" fontSize="lg">
              No data available.
            </Heading>
          </Center>
        </View>
      </Box>
    </Flex>;
  }

  if (foodvariants) {
    content = (
      <Box
        flex={1}
        p="0.5"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
        marginTop={1}
      >
        <FlatList
          data={filteredFoodVariants}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <Center m={1}>
              <Divider width="95%"></Divider>
            </Center>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("AddEntryByMyFood", {
                  foodvariant_id: item.id,
                })
              }
            >
              <FoodVariantItem
                item={item}
                handleOpenFoodVariant={handleOpenFoodVariant}
              />
            </Pressable>
          )}
        />
      </Box>
    );
  }

  return (
    <Flex flex={1}>
      <Box
        width="100%"
        p="4"
        colorScheme="light50"
        bg="white"
        borderColor="gray"
      >
        <HStack justifyContent="space-between" alignItems="center" height={7}>
          <HStack>
            <Input
              flex={0.9}
              placeholder="Search..."
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)}
            />
          </HStack>
          <Pressable onPress={() => navigation.navigate("CreateFood")}>
            <FontAwesome name="pencil-square-o" size={30} color="black" />
          </Pressable>
        </HStack>
      </Box>
      {content}
    </Flex>
  );
};

export default MyFoods;
