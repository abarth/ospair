import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player, PlayerId } from "../model/objects";
import { sortedPlayers } from "../model/player";
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
    renamePlayer: (
      state,
      action: PayloadAction<{ id: PlayerId; name: string; club?: string }>,
    ) => {
      const player = state.registry[action.payload.id];
      if (player) {
        player.name = action.payload.name;
        player.club = action.payload.club;
      }
    },
  },
});

export const { addPlayer, addPlayers, renamePlayer } = playerSlice.actions;

function getPlayer(state: RootState, id: PlayerId): Player {
  return state.player.registry[id]!;
}

export function selectPlayer(player: PlayerId): (state: RootState) => Player {
  return (state: RootState) => getPlayer(state, player);
}

export function selectPlayers(
  players: PlayerId[],
): (state: RootState) => Player[] {
  return (state: RootState) => players.map((id) => getPlayer(state, id));
}

export function selectSortedPlayerIds(
  players: PlayerId[],
): (state: RootState) => PlayerId[] {
  return (state: RootState) => {
    const sorted = sortedPlayers(players.map((id) => getPlayer(state, id)));
    return sorted.map((player) => player.id);
  };
}

export function selectAllPlayers(state: RootState): Player[] {
  return Object.values(state.player.registry) as Player[];
}

export function getPlayerMap(players: Player[]): Map<PlayerId, Player> {
  return players.reduce((map, player) => map.set(player.id, player), new Map());
}
