import { createAsyncThunk } from "@reduxjs/toolkit";
import { signupAPI } from "../../apis/signup";
import { deleteUserAPI } from "../../apis/user";

interface SignupData {
  email: string;
  password: string;
  username: string;
  nickname: string;
  aboutMe?: string;
  age?: number;
}

interface DeleteUserData {
  password: string;
}
interface Error {
  status: number;
  errorCode: string;
  message: string;
}

export const signupUserThunk = createAsyncThunk<
  { message: string },
  SignupData,
  { rejectValue: Error }
>("user/signup", async (signupData, thunkAPI) => {
  try {
    const signupResult = await signupAPI(signupData);
    return { message: signupResult.data.message };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});

export const deleteUserThunk = createAsyncThunk<
  { messasge: string },
  DeleteUserData,
  { rejectValue: Error }
>("user/delete", async (DeleteUserData, thunkAPI) => {
  try {
    const deleteResult = await deleteUserAPI(DeleteUserData.password);
    return { messasge: deleteResult.data.message };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      errorCode: error.response.data.errorCode,
      status: error.response.status,
      message: error.response.data.message,
    });
  }
});
