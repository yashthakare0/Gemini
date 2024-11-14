import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  mode: "light" | "dark" | null;
  switchChecked: boolean;
}

const initialState: ThemeState = {
  mode: null,
  switchChecked: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    updateTheme(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
    },
    updateSwitch(state, action: PayloadAction<boolean>) {
      state.switchChecked = action.payload;
    },
  },
});

export const { updateTheme, updateSwitch } = themeSlice.actions;

export default themeSlice.reducer;
