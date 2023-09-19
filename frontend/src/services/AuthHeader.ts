import * as SecureStore from "expo-secure-store";

export default async function AuthHeader() {
  const userString = (await SecureStore.getItemAsync("user")) || "{}";
  const user = JSON.parse(userString);
  if (user && user.userwithtoken) {
    return { Authorization: "Bearer " + user.userwithtoken };
  } else return {};
}
