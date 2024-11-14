import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import themeSlice from "./theme/themeSlice";
import promptSlice from "./prompt/promptSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducers = combineReducers({
  user: userSlice,
  theme: themeSlice,
  prompt: promptSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
