import { configureStore } from "@reduxjs/toolkit";
import { playerSlice } from "./player-slice";
import { tournamentSlice } from "./tournament-slice";

const store = configureStore({
  reducer: {
    player: playerSlice.reducer,
    tournament: tournamentSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
