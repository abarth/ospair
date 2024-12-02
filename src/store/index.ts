import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { playerSlice } from "./player-slice";
import { tournamentSlice } from "./tournament-slice";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";

const rootReducer = combineReducers({
  player: playerSlice.reducer,
  tournament: tournamentSlice.reducer,
});

const reducer = persistReducer(
  {
    key: "root",
    version: 1,
    storage: localForage,
  },
  rootReducer,
);

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
