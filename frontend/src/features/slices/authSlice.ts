// From https://jasonwatmore.com/post/2022/06/15/react-18-redux-jwt-authentication-example-tutorial#auth-slice-js edited by Tanhapon Tosirikul 2781155t
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "./messageSlice";
import AuthService from "../../services/AuthService";
import * as SecureStore from "expo-secure-store";
import UserService from "../../services/UserService";
import GoalService from "../../services/GoalService";

export const loaduser = createAsyncThunk(
  "auth/loaduser",
  async (_, thunkAPI) => {
    try {
      const userString = await SecureStore.getItemAsync("user");
      const user = userString ? JSON.parse(userString) : null;
      if (user && user.userwithtoken) {
        return { user };
      } else {
        throw new Error("User not found in secure storage");
      }
    } catch (error: any) {
      const message = error.message || error.toString();
      // This line triggers the alert to app.
      // thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterFormData, thunkAPI) => {
    try {
      const responseData = await AuthService.register(data);
      return { user: responseData };
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const responseData = await AuthService.login(data);
      return { user: responseData };
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logout();
});

export const changeProfile = createAsyncThunk(
  "user/changeprofile",
  async (
    { id, data }: { id: string; data: { email: string; username: string } },
    thunkAPI
  ) => {
    try {
      const responseData = await UserService.changeProfileData(id, data);
      return { user: responseData };
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const changeGoal = createAsyncThunk(
  "goal/changegoal",
  async (
    { user_id, data }: { user_id: number; data: GoalSettingData },
    thunkAPI
  ) => {
    try {
      const responseData = await GoalService.createNewGoal(user_id, data);
      return { user: responseData };
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changepassword",
  async (
    {
      id,
      current_password,
      new_password,
    }: {
      id: string;
      current_password: string;
      new_password: string;
    },
    thunkAPI
  ) => {
    try {
      const responseData = await UserService.changePassword({
        id,
        current_password,
        new_password,
      });
      return { user: responseData };
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState: {
  isLoggedIn: boolean;
  user: UserWithGoal | null;
  isLoading: boolean;
} = {
  isLoggedIn: false,
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload.user;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.user = null;
    });
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = null;
    });
    builder.addCase(logout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(loaduser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload.user;
    });
    builder.addCase(changeProfile.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(changeProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      if (state.user) {
        state.user.username = action.payload.user.username;
        state.user.email = action.payload.user.email;
        state.user.userwithtoken = action.payload.user.userwithtoken;
      }
    });
    builder.addCase(changeProfile.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(changePassword.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      if (state.user) {
        state.user.userwithtoken = action.payload.user.userwithtoken;
      }
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(changeGoal.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(changeGoal.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      if (state.user) {
        state.user.goal = action.payload.user.goal;
      }
    });
    builder.addCase(changeGoal.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
