import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router";
import { playerSlice, addPlayers } from "../store/player-slice";
import {
  tournamentSlice,
  createTournament,
  registerPlayers,
  createNextRound,
  swapPlayers,
} from "../store/tournament-slice";
import { MatchFormat } from "../model/objects";
import PairingEditor from "./PairingEditor";

function createTestStore() {
  return configureStore({
    reducer: {
      player: playerSlice.reducer,
      tournament: tournamentSlice.reducer,
    },
  });
}

type TestStore = ReturnType<typeof createTestStore>;

function renderEditor(store: TestStore, tournamentId: string, roundNumber = 1) {
  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[`/tournament/${tournamentId}/round/${roundNumber}`]}
      >
        <Routes>
          <Route
            path="/tournament/:tournamentId/round/:roundNumber"
            element={<PairingEditor />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

function setupTournament(playerCount = 4) {
  const store = createTestStore();
  const players = [
    { id: "alice", name: "Alice" },
    { id: "bob", name: "Bob" },
    { id: "charlie", name: "Charlie" },
    { id: "david", name: "David" },
    { id: "eve", name: "Eve" },
  ].slice(0, playerCount);

  store.dispatch(addPlayers(players));
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
      players: players.map((p) => p.id),
    }),
  );
  store.dispatch(createNextRound("t1"));
  return store;
}

describe("PairingEditor", () => {
  test("renders all player chips", () => {
    const store = setupTournament(4);
    renderEditor(store, "t1");

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("David")).toBeInTheDocument();
  });

  test("renders table cards with table numbers", () => {
    const store = setupTournament(4);
    renderEditor(store, "t1");

    // With 4 players in head-to-head: 2 tables
    expect(screen.getByText("Table 1")).toBeInTheDocument();
    expect(screen.getByText("Table 2")).toBeInTheDocument();
  });

  test("renders bye table for odd player count", () => {
    const store = setupTournament(5); // 5 players → 2 tables + 1 bye
    renderEditor(store, "t1");

    expect(screen.getByText("Bye")).toBeInTheDocument();
  });

  test("renders 'vs' separator between teams", () => {
    const store = setupTournament(4);
    renderEditor(store, "t1");

    const vsElements = screen.getAllByText("vs");
    expect(vsElements.length).toBeGreaterThan(0);
  });

  test("player chips are draggable for current round", () => {
    const store = setupTournament(4);
    renderEditor(store, "t1");

    const chip = screen.getByText("Alice").closest('[draggable]');
    expect(chip).toHaveAttribute("draggable", "true");
  });

  test("swaps players after drag and drop between tables", () => {
    const store = setupTournament(4);
    renderEditor(store, "t1");

    const state = store.getState();
    const round = state.tournament.registry["t1"].rounds[0];
    const table1Player = round.tables[0].teams[0][0];
    const table2Player = round.tables[1].teams[0][0];

    const playerRegistry = state.player.registry;
    const chip1 = screen.getByText(playerRegistry[table1Player].name);
    const chip2 = screen.getByText(playerRegistry[table2Player].name);

    // Perform drag from chip1 to chip2
    fireEvent.dragStart(chip1, {
      dataTransfer: { effectAllowed: "move", setData: () => {} },
    });
    fireEvent.dragOver(chip2);
    fireEvent.drop(chip2);

    // Verify the store state was updated
    const newState = store.getState();
    const newRound = newState.tournament.registry["t1"].rounds[0];
    expect(newRound.tables[0].teams[0][0]).toBe(table2Player);
    expect(newRound.tables[1].teams[0][0]).toBe(table1Player);
  });

  test("does not swap when dropping a player on themselves", () => {
    const store = setupTournament(4);
    renderEditor(store, "t1");

    const stateBefore = store.getState().tournament.registry["t1"].rounds[0];
    const chip = screen.getByText("Alice");

    fireEvent.dragStart(chip, {
      dataTransfer: { effectAllowed: "move", setData: () => {} },
    });
    fireEvent.dragOver(chip);
    fireEvent.drop(chip);

    const stateAfter = store.getState().tournament.registry["t1"].rounds[0];
    expect(stateAfter.tables).toEqual(stateBefore.tables);
  });

  test("drag state clears after dragEnd without a drop", () => {
    const store = setupTournament(4);
    renderEditor(store, "t1");

    const stateBefore = store.getState().tournament.registry["t1"].rounds[0];
    const chip = screen.getByText("Alice");

    fireEvent.dragStart(chip, {
      dataTransfer: { effectAllowed: "move", setData: () => {} },
    });
    fireEvent.dragEnd(chip);

    const stateAfter = store.getState().tournament.registry["t1"].rounds[0];
    expect(stateAfter.tables).toEqual(stateBefore.tables);
  });

  test("player chips are not draggable for past rounds", () => {
    const store = setupTournament(4);

    // Add a second round, making the first round non-current
    store.dispatch(createNextRound("t1"));

    // Render round 1 (now a past round)
    renderEditor(store, "t1", 1);

    // Chips should not be draggable
    const chip = screen.getByText("Alice").closest('[draggable]');
    expect(chip).toBeNull();
  });
});
