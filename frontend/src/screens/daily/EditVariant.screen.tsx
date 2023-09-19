// From https://react-hook-form.com/ edited by Tanhapon Tosirikul 2781155t
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useAppNavigation, useAppRoute, useUser } from "../../libs/hook";
import {
  Center,
  Text,
  Flex,
  Heading,
  Box,
  FormControl,
  HStack,
  Input,
  Divider,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  EditFoodVariant,
  useEditFoodVariantMutation,
  useFetchFoodVariantsQuery,
} from "../../services/FoodVariantService";

const EditVariant = () => {
  const navigation = useAppNavigation();
  const user = useUser();
  const { foodvariant_id } = useAppRoute<"EditVariant">();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFoodVariant] = useEditFoodVariantMutation();
  const { data: foodVariant }: { data: FoodVariant | undefined } =
    useFetchFoodVariantsQuery(
      { user_id: user?.id },
      {
        selectFromResult: ({ data, error, isLoading }) => ({
          data: data?.find(
            (foodvarint: FoodVariant) => foodvarint.id === foodvariant_id
          ),
        }),
      }
    );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleSubmit(submitEditFoodVariant)}
          disabled={isSubmitting}
        >
          <FontAwesome
            name="check"
            size={30}
            color="black"
            style={{ marginRight: 10 }}
          />
        </Pressable>
      ),
    });
  }, [navigation, isSubmitting]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      expense: foodVariant?.expense.toString(),
    },
    mode: "onChange",
  });

  if (!foodVariant) {
    return (
      <Flex flex={1}>
        <Center>
          <Heading color="darkBlue.500" fontSize="lg">
            No data available.
          </Heading>
        </Center>
      </Flex>
    );
  }

  const submitEditFoodVariant: SubmitHandler<EditFoodVariant> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      const result = await editFoodVariant({
        foodvariant_id: foodVariant.id,
        body: data,
      })
        .unwrap()
        .then(() => navigation.goBack());
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="never"
      >
        <Box width="100%" p="4">
          <Text fontSize="sm" fontWeight="bold">
            Food Details
          </Text>

          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Brand</Text>
            <Text fontSize="sm">{foodVariant.brand_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Description {""}</Text>
            <Text fontSize="sm">{foodVariant.description_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Serving Size {""}</Text>
            <Text fontSize="sm">{foodVariant.serving_size_snapshot}</Text>
          </HStack>
          <FormControl>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              height={7}
              marginY={1}
            >
              <HStack>
                <Text fontSize="sm">Cost per Serving (£) {""}</Text>
                {errors.expense && (
                  <Text role="alert" style={{ color: "red" }}>
                    {errors.expense.message?.toString()}
                  </Text>
                )}
              </HStack>
              <Controller
                name="expense"
                rules={{
                  required: { value: true, message: "(required)" },
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: "(invalid)",
                  },
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    keyboardType="decimal-pad"
                    variant="outline"
                    size="sm"
                    style={Platform.OS === "android" ? { height: 30 } : {}}
                    width="40%"
                    textAlign="right"
                    defaultValue={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </HStack>
          </FormControl>
        </Box>
        <Center>
          <Divider width="95%" my={0.5} />
        </Center>
        <Box width="100%" p="4">
          <Text fontSize="sm" fontWeight="bold">
            Nutrition Facts per Serving Size
          </Text>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Calories (kcal) {""}</Text>
            <Text fontSize="sm">{foodVariant.calories_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Carbs (g) {""}</Text>
            <Text fontSize="sm">{foodVariant.carbs_gram_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Protein (g) {""}</Text>
            <Text fontSize="sm">{foodVariant.protein_gram_snapshot}</Text>
          </HStack>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={7}
            marginY={1}
          >
            <Text fontSize="sm">Fat (g) {""}</Text>
            <Text fontSize="sm">{foodVariant.fat_gram_snapshot}</Text>
          </HStack>
        </Box>
        <Center>
          <Divider width="95%" my={0.5} />
        </Center>
        {/* <Box p={1}>
          <NutritionExpenseSummary
            goal={
              user?.goal || {
                id: 20,
                carbs_percentage_goal: 50,
                fat_percentage_goal: 20,
                protein_percentage_goal: 30,
                carbs_gram_goal: 20,
                fat_gram_goal: 20,
                protein_gram_goal: 20,
                calories_goal: 2000,
                expense_limit: 20,
              }
            }
            current={{
              carbs_gram: !isNaN(carbsGram) ? carbsGram : 0,
              fat_gram: !isNaN(fatGram) ? fatGram : 0,
              protein_gram: !isNaN(proteinGram) ? proteinGram : 0,
              calories: !isNaN(calories) ? calories : 0,
              expense: !isNaN(expense) ? expense : 0,
            }}
          />
        </Box> */}
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditVariant;
