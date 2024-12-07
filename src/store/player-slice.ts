import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player, PlayerId } from "../model/objects";
import type { RootState } from "./index";

interface PlayerState {
  registry: any;
}

const initialState: PlayerState = {
  registry: {},
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<Player>) => {
      const id = action.payload.id;
      state.registry[id] = { ...action.payload };
    },
    addPlayers: (state, action: PayloadAction<Player[]>) => {
      for (const player of action.payload) {
        state.registry[player.id] = { ...player };
      }
    },
  },
});

export const { addPlayer, addPlayers } = playerSlice.actions;

function getPlayer(state: RootState, id: PlayerId): Player {
  return state.player.registry[id]!;
}

export function selectPlayer(player: PlayerId): (state: RootState) => Player {
  return (state: RootState) => getPlayer(state, player);
}

export function selectPlayers(
  players: PlayerId[],
): (state: RootState) => Map<PlayerId, Player> {
  return (state: RootState) => {
    const result = new Map<PlayerId, Player>();
    for (const player of players) {
      result.set(player, getPlayer(state, player));
    }
    return result;
  };
}

export function selectAllPlayers(state: RootState): Player[] {
  return Object.values(state.player.registry) as Player[];
}
