import { endpoint } from "../../apiConfig";
import AuthHeader from "./AuthHeader";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

class UserService {
  changeProfileData = async (
    id: string,
    data: {
      email: string;
      username: string;
    }
  ): Promise<UserWithGoal> => {
    let authHeaderObject = await AuthHeader();
    let authHeader = authHeaderObject.Authorization;
    return axios
      .put(endpoint + `/users/${id}`, data, {
        headers: { Authorization: `${authHeader}` },
      })
      .then(async (response) => {
        if (response.data.userwithtoken) {
          const userString = await SecureStore.getItemAsync("user");
          const user = userString ? JSON.parse(userString) : null;
          if (user) {
            user.username = response.data.username;
            user.email = response.data.email;
            user.userwithtoken = response.data.userwithtoken;
            await SecureStore.setItemAsync("user", JSON.stringify(user));
          }
        }
        return response.data;
      })
      .catch((error) => {
        throw new Error(
          error.response.data.message ? error.response.data.message : "Error"
        );
      });
  };

  changePassword = async ({
    id,
    current_password,
    new_password,
  }: {
    id: string;
    current_password: string;
    new_password: string;
  }) => {
    let authHeaderObject = await AuthHeader();
    let authHeader = authHeaderObject.Authorization;
    return axios
      .put(
        endpoint + `/users/changepassword/${id}`,
        { oldpassword: current_password, newpassword: new_password },
        { headers: { Authorization: `${authHeader}` } }
      )
      .then(async (response) => {
        if (response.data.userwithtoken) {
          const userString = await SecureStore.getItemAsync("user");
          const user = userString ? JSON.parse(userString) : null;
          if (user) {
            user.userwithtoken = response.data.userwithtoken;
            await SecureStore.setItemAsync("user", JSON.stringify(user));
          }
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

export default new UserService();
