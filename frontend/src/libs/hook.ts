// From https://stackoverflow.com/questions/47924501/add-strong-typing-for-react-navigation-props edited by Tanhapon Tosirikul 2781155t
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootState } from "../features/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import React from "react";

export function selectUser(state: RootState): UserWithGoal | undefined {
  const { user, isLoggedIn } = state.auth;
  return isLoggedIn && user ? user : undefined;
}

export function useUser() {
  const { user } = useSelector((state: RootState) => state.auth);
  return user;
}

export function useDate() {
  const dateString = useSelector((state: RootState) => state.date.date);
  const date = useMemo(() => new Date(dateString), [dateString]);
  return date;
}

export function useAppRoute<RouteName extends keyof RootStackParamList>() {
  const route = useRoute<RouteProp<RootStackParamList, RouteName>>();
  return route.params as RootStackParamList[RouteName];
}

export function useAppNavigation() {
  return useNavigation<StackNavigationProp<RootStackParamList>>();
}
