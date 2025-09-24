import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// Use web storage in client; noop storage in server to avoid SSR errors
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// No-op storage for server or environments without window.localStorage
const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: any) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

// Determine storage based on environment
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Import reducers from the slices
import LayoutReducer from "./layouts/reducer";
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

// Root reducer type
export interface RootState {
  Layout: ReturnType<typeof LayoutReducer>;
  Login: ReturnType<typeof LoginReducer>;
  Account: ReturnType<typeof AccountReducer>;
  ForgetPassword: ReturnType<typeof ForgetPasswordReducer>;
  Profile: ReturnType<typeof ProfileReducer>;
}

// Persist configuration
const persistConfig = {
  key: "ybb-platform",
  storage,
  whitelist: ["Login", "Profile", "Layout"], // Only persist essential data
};

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;