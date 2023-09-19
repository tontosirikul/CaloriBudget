// From https://reactnavigation.org/docs/auth-flow/ edited by Tanhapon Tosirikul 2781155t
import { NavigationContainer } from "@react-navigation/native";
import { AuthTabsNavigator } from "./src/screens/AuthTabs.navigator";
import { Provider, useSelector } from "react-redux";
import store, { RootState, useAppThunkDispatch } from "./src/features/store";
import { UnAuthStacksNavigator } from "./src/screens/UnAuthStacks.navigator";
import { NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import { loaduser } from "./src/features/slices/authSlice";

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Root />
      </NativeBaseProvider>
    </Provider>
  );
}

function isUserWithGoal(user: UserWithGoal | null): user is UserWithGoal {
  return user !== null;
}

export const Root = () => {
  const dispatch = useAppThunkDispatch();

  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loaduser());
  }, [dispatch]);

  if (isLoggedIn && isUserWithGoal(user)) {
    return (
      <NavigationContainer>
        <AuthTabsNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <UnAuthStacksNavigator />
    </NavigationContainer>
  );
};
