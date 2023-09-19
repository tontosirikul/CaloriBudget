// Created by Tanhapon Tosirikul 2781155t
import { Pressable, View } from "react-native";
import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  Input,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useAppNavigation, useUser } from "../../../libs/hook";
import { FlatList } from "react-native-gesture-handler";
import Loading from "../../../components/Loading";
import { useFetchFoodQuery } from "../../../services/FoodService";
import FoodItem from "../../../components/FoodItem";
import { useEffect, useState } from "react";

const All = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useAppNavigation();
  const user = useUser();
  const {
    data: foods,
    isLoading,
    isFetching,
    error,
  } = useFetchFoodQuery(user?.id);

  const filteredFoods = foods?.filter(
    (food) =>
      food.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let content;

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

  if (!foods) {
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
              No data available.
            </Heading>
          </Center>
        </View>
      </Box>
    );
  }

  if (foods) {
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
          data={filteredFoods}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <Center m={1}>
              <Divider width="95%"></Divider>
            </Center>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (item.foodvariants.length != 0) {
                  navigation.navigate("AddEntryByMyFood", {
                    foodvariant_id: item.foodvariants[0].id,
                  });
                } else {
                  navigation.navigate("AddEntryByProvidedFood", {
                    food_id: item.id,
                  });
                }
              }}
            >
              <FoodItem item={item} />
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
          <Input
            flex={0.9}
            placeholder="Search..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <Pressable onPress={() => navigation.navigate("BarcodeScanner")}>
            <FontAwesome name="barcode" size={30} color="black" />
          </Pressable>
        </HStack>
      </Box>
      {content}
    </Flex>
  );
};

export default All;
