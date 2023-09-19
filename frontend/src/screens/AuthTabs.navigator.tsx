// From https://kadikraman.github.io/react-native-beyond-basics/docs/welcome edited by Tanhapon Tosirikul 2781155t
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Dashboard } from "./dashboard/Dashboard.screen";
import { Other } from "./other/Other.screen";
import ProfileSetting from "./other/ProfileSetting.screen";
import GoalSetting from "./other/GoalSetting.screen";
import ChangePassword from "./other/ChangePassword.screen";
import { DailyFoodLog } from "./daily/DailyFoodLog.screen";
import { DatePicker } from "../components/DatePicker";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AddEntry from "./daily/AddEntry.screen";
import CreateFood from "./daily/CreateFood.screen";
import EditEntry from "./daily/EditEntry.screen";
import { Pressable } from "react-native";
import EditVariant from "./daily/EditVariant.screen";
import AddEntryByMyFood from "./daily/AddEntryByMyFood.screen";
import AddEntryByProvidedFood from "./daily/AddEntryByProvidedFood.screen";
import BarcodeScanner from "./daily/BarcodeScanner.screen";
import CreateFoodByAPI from "./daily/CreateFoodByAPI.screen";
import AverageDailyExpense from "./dashboard/AverageDailyExpense.screen";

const DashboardStack = createStackNavigator();
const DailyStack = createStackNavigator();
const OtherStack = createStackNavigator();

interface Props {
  navigation: any;
}

const DashboardNavigator: React.FC<Props> = ({ navigation }) => {
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#f5f5f5" },
      }}
    >
      <DashboardStack.Screen
        name="Dashboard"
        options={{ title: "Dashboard" }}
        component={Dashboard}
      />
      <DashboardStack.Screen
        name="AverageDailyExpense"
        options={{
          title: "Average Daily Expense",
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
        component={AverageDailyExpense}
      />
    </DashboardStack.Navigator>
  );
};

const DailyStackNavigator: React.FC<Props> = ({ navigation }) => {
  return (
    <DailyStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#f5f5f5" },
      }}
    >
      <DailyStack.Screen
        name="DailyFoodLog"
        options={{
          headerTitle: () => <DatePicker />,
          headerLeft: () => null,
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate("AddEntry")}>
              <FontAwesome
                name="pencil-square-o"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
      >
        {() => <DailyFoodLog />}
      </DailyStack.Screen>
      <DailyStack.Screen
        name="AddEntry"
        options={{
          title: "Add Entry",
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      >
        {() => <AddEntry />}
      </DailyStack.Screen>
      <DailyStack.Screen
        name="CreateFood"
        options={{
          title: "Create Food & Entry",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerRight: () => (
            <Pressable>
              <FontAwesome
                name="check"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
      >
        {(props) => <CreateFood {...props} />}
      </DailyStack.Screen>
      <DailyStack.Screen
        name="EditEntry"
        options={{
          title: "Edit Food Entry",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerRight: () => (
            <Pressable>
              <FontAwesome
                name="check"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
        component={EditEntry}
      />
      <DailyStack.Screen
        name="EditVariant"
        options={{
          title: "Edit Food Expense",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerRight: () => (
            <Pressable>
              <FontAwesome
                name="check"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
        component={EditVariant}
      />
      <DailyStack.Screen
        name="AddEntryByMyFood"
        options={{
          title: "Create Entry",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerRight: () => (
            <Pressable>
              <FontAwesome
                name="check"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
        component={AddEntryByMyFood}
      />
      <DailyStack.Screen
        name="AddEntryByProvidedFood"
        options={{
          title: "Create Entry",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerRight: () => (
            <Pressable>
              <FontAwesome
                name="check"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
        component={AddEntryByProvidedFood}
      />
      <DailyStack.Screen
        name="BarcodeScanner"
        options={{
          title: "Barcode Scanner",
          headerBackTitleVisible: false,
          headerTintColor: "black",
          headerRight: () => (
            <Pressable>
              <FontAwesome
                name="check"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
        component={BarcodeScanner}
      />
      <DailyStack.Screen
        name="CreateFoodByAPI"
        options={{
          title: "Create Food & Entry",
          headerBackTitleVisible: false,
          headerTintColor: "black",

          headerRight: () => (
            <Pressable>
              <FontAwesome
                name="check"
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
        component={CreateFoodByAPI}
      />
    </DailyStack.Navigator>
  );
};

const OtherStackNavigator = () => (
  <OtherStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#f5f5f5" },
    }}
  >
    <OtherStack.Screen
      name="Other"
      component={Other}
      options={{
        title: "Other",
      }}
    />
    <OtherStack.Screen
      name="ProfileSetting"
      component={ProfileSetting}
      options={{
        title: "Profile Settings",
        headerBackTitleVisible: false,
        headerTintColor: "black",
      }}
    />
    <OtherStack.Screen
      name="GoalSetting"
      component={GoalSetting}
      options={{
        title: "Goal Settings",
        headerBackTitleVisible: false,
        headerTintColor: "black",
      }}
    />
    <OtherStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        title: "Change Password",
        headerBackTitleVisible: false,
        headerTintColor: "black",
      }}
    />
  </OtherStack.Navigator>
);

const BottomTabs = createBottomTabNavigator();

export const AuthTabsNavigator = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarInactiveTintColor: "#a3a3a3",
        tabBarActiveTintColor: "white",
        tabBarIcon: ({ focused }) => {
          let color;
          let size;
          if (focused) {
            color = "white";
            size = 30;
          } else {
            color = "#a3a3a3";
            size = 24;
          }

          if (route.name === "DashboardStack") {
            return focused ? (
              <MaterialCommunityIcons
                name="view-dashboard-edit"
                size={size}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name="view-dashboard-edit-outline"
                size={size}
                color={color}
              />
            );
          }

          if (route.name === "DailyStack") {
            return focused ? (
              <Ionicons name="book-sharp" size={size} color={color} />
            ) : (
              <Ionicons name="book-outline" size={size} color={color} />
            );
          }

          if (route.name === "OtherStack") {
            return focused ? (
              <Ionicons
                name="md-ellipsis-horizontal-sharp"
                size={size}
                color={color}
              />
            ) : (
              <Ionicons
                name="md-ellipsis-horizontal-outline"
                size={size}
                color={color}
              />
            );
          }

          // Returning null as a fallback
          return null;
        },
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0077e6" },
      })}
    >
      <BottomTabs.Screen
        name="DashboardStack"
        component={DashboardNavigator}
        options={{ title: "Dashboard" }}
      />
      <BottomTabs.Screen
        name="DailyStack"
        component={DailyStackNavigator}
        options={{ title: "Daily" }}
      />
      <BottomTabs.Screen
        name="OtherStack"
        component={OtherStackNavigator}
        options={{ title: "Other" }}
      />
    </BottomTabs.Navigator>
  );
};
