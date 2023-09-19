import { endpoint } from "../../apiConfig";
import AuthHeader from "./AuthHeader";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

class GoalService {
  async createNewGoal(user_id: number, data: GoalSettingData) {
    let authHeaderObject = await AuthHeader();
    let authHeader = authHeaderObject.Authorization;
    return axios
      .post(
        endpoint + `/goals`,
        { ...data, user_id },
        {
          headers: { Authorization: `${authHeader}` },
        }
      )
      .then(async (response) => {
        if (response.data) {
          const userString = await SecureStore.getItemAsync("user");
          const user = userString ? JSON.parse(userString) : null;
          if (user) {
            user.goal = response.data.goal;
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
  }
}

export default new GoalService();
