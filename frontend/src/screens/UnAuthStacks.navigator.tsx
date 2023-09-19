// From https://reactnavigation.org/docs/stack-navigator/ edited by Tanhapon Tosirikul 2781155t
import React from "react";
import { Login } from "./Login.screen";
import { createStackNavigator } from "@react-navigation/stack";
import { Register } from "./Register.screen";

const Stacks = createStackNavigator();

export const UnAuthStacksNavigator: React.FC = () => {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen
        name="Signin"
        component={Login}
        options={{ title: "Sign in" }}
      />
      <Stacks.Screen
        name="Signup"
        component={Register}
        options={{ title: "Sign up" }}
      />
    </Stacks.Navigator>
  );
};
