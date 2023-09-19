// From https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/ edited by Tanhapon Tosirikul 2781155t
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useLazyGetFoodFromBarcodeQuery } from "../../services/FoodService";
import { useAppNavigation, useUser } from "../../libs/hook";
import { useLazyGetFoodFromOpenFoodFactQuery } from "../../services/OpenFoodFactsService";
import { HStack, Input, VStack, Button, Center } from "native-base";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// from expo example
const BarcodeScanner = () => {
  const navigation = useAppNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const user = useUser();
  const [scanned, setScanned] = useState(false);
  const [getFoodFromBarcode, { isLoading }] = useLazyGetFoodFromBarcodeQuery();
  const [getFoodFromOpenFoodFact] = useLazyGetFoodFromOpenFoodFactQuery();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      barcode: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getBarCodeScannerPermissions();
  }, []);

  const submitManualBarcode: SubmitHandler<any> = async (data) => {
    handleBarCodeScanned({ data: data.barcode });
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const food = await getFoodFromBarcode({
        barcode: data,
        user_id: user?.id,
      }).unwrap();
      if (food) {
        if (food.foodvariants.length !== 0) {
          Alert.alert("Found food with expense", "", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("AddEntryByMyFood", {
                  foodvariant_id: food.foodvariants[0].id,
                });
              },
            },
          ]);
        } else {
          Alert.alert("Found food without expense", "", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("AddEntryByProvidedFood", {
                  food_id: food.id,
                });
              },
            },
          ]);
        }
      } else {
        try {
          const foodFromAPI = await getFoodFromOpenFoodFact(data).unwrap();
          const product = foodFromAPI.products[0];
          console.log(product);
          if (product) {
            const description = product.product_name;
            const brand = product.brands?.split(",")[0] || "";
            const calories = product["energy-kcal_100g"];
            const fat_gram = parseFloat(product.fat_100g);
            const carbs_gram = product.carbohydrates_100g;
            const protein_gram = parseFloat(product.proteins_100g);
            Alert.alert("Found food on OpenFoodFacts", "", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("CreateFoodByAPI", {
                    brandFromAPI: brand,
                    descriptionFromAPI: description,
                    caloriesFromAPI: calories,
                    carbs_gramFromAPI: carbs_gram,
                    fat_gramFromAPI: fat_gram,
                    protein_gramFromAPI: protein_gram,
                    barcodeFromAPI: data,
                  });
                },
              },
            ]);
          } else {
            Alert.alert("No Food Found", "Continue with create your food", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("CreateFood");
                },
              },
            ]);
          }
        } catch (error) {
          console.log(error);
          Alert.alert("No Food Found", "Continue with create your food", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("CreateFood");
              },
            },
          ]);
        }
      }
    } catch (error) {
      Alert.alert("No Food Found", "Continue with create your food", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("CreateFood");
          },
        },
      ]);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1, justifyContent: "center" }}>
          <Center>
            <HStack alignItems="center">
              <Center flex={0.8} ml={1}>
                <Controller
                  name="barcode"
                  rules={{
                    required: true,
                    minLength: 13,
                    maxLength: 13,
                    pattern: /^[0-9]*$/,
                  }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      keyboardType="numeric"
                      placeholder="Enter a barcode"
                      variant="outline"
                      size="xl"
                      style={Platform.OS === "android" ? { height: 30 } : {}}
                      borderColor={errors.barcode ? "error.500" : null}
                      defaultValue={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </Center>
              <Center flex={0.2}>
                <Pressable
                  onPress={handleSubmit(submitManualBarcode)}
                  disabled={isLoading}
                >
                  <FontAwesome name="send-o" size={30} color="black" />
                </Pressable>
              </Center>
            </HStack>
          </Center>
        </View>
        <View style={{ flex: 0.9 }}>
          {scanned === false && (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          {scanned === true && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Scanning complete!</Text>
              <Button onPress={() => setScanned(false)}>Scan again</Button>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BarcodeScanner;
