import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { endpoint } from "../../apiConfig";

class AuthService {
  login = (data: {
    email: string;
    password: string;
  }): Promise<UserWithGoal> => {
    return axios
      .post(endpoint + "/signin", data)
      .then(async (response) => {
        if (response.data.userwithtoken) {
          await SecureStore.setItemAsync("user", JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch((error) => {
        throw new Error(
          error.response.data.message ? error.response.data.message : "Error"
        );
      });
  };
  logout = async () => {
    await SecureStore.deleteItemAsync("user");
  };
  register = async (data: RegisterFormData) => {
    return axios
      .post(endpoint + "/signup", data)
      .then(async (response) => {
        if (response.data.userwithtoken) {
          await SecureStore.setItemAsync("user", JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch((error) => {
        throw new Error(
          error.response.data.message ? error.response.data.message : "Error"
        );
      });
  };
}
export default new AuthService();
