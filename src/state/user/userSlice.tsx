import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  email: string;
  logo: string;
}

const userState: UserState = {
  name: "Dev",
  email: "",
  logo: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.logo = action.payload.logo;
    },
  },
});


export const { updateUser } = userSlice.actions;
export default userSlice.reducer;