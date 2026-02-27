import { configureStore } from "@reduxjs/toolkit";
import { playerSlice, addPlayers } from "./player-slice";
import {
  tournamentSlice,
  createTournament,
  registerPlayers,
  createNextRound,
  swapPlayers,
} from "./tournament-slice";
import { MatchFormat } from "../model/objects";

function createTestStore() {
  return configureStore({
    reducer: {
      player: playerSlice.reducer,
      tournament: tournamentSlice.reducer,
    },
  });
}

function setupHeadToHeadTournament() {
  const store = createTestStore();

  store.dispatch(
    addPlayers([
      { id: "alice", name: "Alice" },
      { id: "bob", name: "Bob" },
      { id: "charlie", name: "Charlie" },
      { id: "david", name: "David" },
    ]),
  );

  store.dispatch(
    createTournament({
      tournamentId: "t1",
      name: "Test",
      matchFormat: MatchFormat.HeadToHead,
    }),
  );
  store.dispatch(
    registerPlayers({
      tournamentId: "t1",
      players: ["alice", "bob", "charlie", "david"],
    }),
  );
  store.dispatch(createNextRound("t1"));

  return store;
}

function setupTwoHeadedGiantTournament() {
  const store = createTestStore();

  store.dispatch(
    addPlayers([
      { id: "alice", name: "Alice" },
      { id: "bob", name: "Bob" },
      { id: "charlie", name: "Charlie" },
      { id: "david", name: "David" },
    ]),
  );

  store.dispatch(
    createTournament({
      tournamentId: "t2",
      name: "Test THG",
      matchFormat: MatchFormat.TwoHeadedGiant,
    }),
  );
  store.dispatch(
    registerPlayers({
      tournamentId: "t2",
      players: ["alice", "bob", "charlie", "david"],
    }),
  );
  store.dispatch(createNextRound("t2"));

  return store;
}

function getAllPlayers(store: ReturnType<typeof createTestStore>) {
  const state = store.getState();
  const round = state.tournament.registry["t1"].rounds[0];
  return round.tables.flatMap((table) => table.teams.flat());
}

describe("swapPlayers", () => {
  test("swaps players from different tables in head-to-head format", () => {
    const store = setupHeadToHeadTournament();
    const state = store.getState();
    const round = state.tournament.registry["t1"].rounds[0];

    // In head-to-head with 4 players, there are 2 tables
    expect(round.tables).toHaveLength(2);

    const table1Player = round.tables[0].teams[0][0];
    const table2Player = round.tables[1].teams[0][0];

    store.dispatch(
      swapPlayers({
        tournamentId: "t1",
        roundIndex: 0,
        player1: table1Player,
        player2: table2Player,
      }),
    );

    const newState = store.getState();
    const newRound = newState.tournament.registry["t1"].rounds[0];

    expect(newRound.tables[0].teams[0][0]).toBe(table2Player);
    expect(newRound.tables[1].teams[0][0]).toBe(table1Player);
  });

  test("swaps players between teams at the same table", () => {
    const store = setupHeadToHeadTournament();
    const state = store.getState();
    const round = state.tournament.registry["t1"].rounds[0];

    const teamAPlayer = round.tables[0].teams[0][0];
    const teamBPlayer = round.tables[0].teams[1][0];

    store.dispatch(
      swapPlayers({
        tournamentId: "t1",
        roundIndex: 0,
        player1: teamAPlayer,
        player2: teamBPlayer,
      }),
    );

    const newState = store.getState();
    const newRound = newState.tournament.registry["t1"].rounds[0];

    expect(newRound.tables[0].teams[0][0]).toBe(teamBPlayer);
    expect(newRound.tables[0].teams[1][0]).toBe(teamAPlayer);
  });

  test("all players remain in the round after a swap", () => {
    const store = setupHeadToHeadTournament();
    const beforePlayers = getAllPlayers(store).sort();

    const state = store.getState();
    const round = state.tournament.registry["t1"].rounds[0];
    const p1 = round.tables[0].teams[0][0];
    const p2 = round.tables[1].teams[1][0];

    store.dispatch(
      swapPlayers({ tournamentId: "t1", roundIndex: 0, player1: p1, player2: p2 }),
    );

    const afterPlayers = getAllPlayers(store).sort();
    expect(afterPlayers).toEqual(beforePlayers);
  });

  test("swapping the same player with themselves is a no-op", () => {
    const store = setupHeadToHeadTournament();
    const stateBefore = store.getState().tournament.registry["t1"].rounds[0];

    store.dispatch(
      swapPlayers({
        tournamentId: "t1",
        roundIndex: 0,
        player1: "alice",
        player2: "alice",
      }),
    );

    const stateAfter = store.getState().tournament.registry["t1"].rounds[0];
    expect(stateAfter.tables).toEqual(stateBefore.tables);
  });

  test("swaps teammates within a team in two-headed-giant format", () => {
    const store = setupTwoHeadedGiantTournament();
    const state = store.getState();
    const round = state.tournament.registry["t2"].rounds[0];

    // THG with 4 players: 1 table, 2 teams of 2
    expect(round.tables).toHaveLength(1);
    expect(round.tables[0].teams[0]).toHaveLength(2);

    const teamAPlayer0 = round.tables[0].teams[0][0];
    const teamBPlayer0 = round.tables[0].teams[1][0];

    store.dispatch(
      swapPlayers({
        tournamentId: "t2",
        roundIndex: 0,
        player1: teamAPlayer0,
        player2: teamBPlayer0,
      }),
    );

    const newState = store.getState();
    const newRound = newState.tournament.registry["t2"].rounds[0];

    expect(newRound.tables[0].teams[0][0]).toBe(teamBPlayer0);
    expect(newRound.tables[0].teams[1][0]).toBe(teamAPlayer0);
  });

  test("preserves wins and draws after a swap", () => {
    const store = setupHeadToHeadTournament();
    const state = store.getState();
    const round = state.tournament.registry["t1"].rounds[0];
    const p1 = round.tables[0].teams[0][0];
    const p2 = round.tables[1].teams[0][0];

    store.dispatch(
      swapPlayers({ tournamentId: "t1", roundIndex: 0, player1: p1, player2: p2 }),
    );

    const newRound = store.getState().tournament.registry["t1"].rounds[0];
    // Wins arrays should be unchanged (results belong to teams, not players)
    expect(newRound.tables[0].wins).toEqual([0, 0]);
    expect(newRound.tables[1].wins).toEqual([0, 0]);
    expect(newRound.tables[0].draws).toBe(0);
    expect(newRound.tables[1].draws).toBe(0);
  });
});
