import { playerSlice, addPlayer, renamePlayer } from "./player-slice";

const reducer = playerSlice.reducer;

test("renamePlayer changes the player's name", () => {
  let state = reducer(undefined, addPlayer({ id: "p1", name: "Alice" }));
  state = reducer(state, renamePlayer({ id: "p1", name: "Bob" }));
  expect(state.registry["p1"].name).toBe("Bob");
});

test("renamePlayer changes the player's club", () => {
  let state = reducer(undefined, addPlayer({ id: "p1", name: "Alice", club: "Club A" }));
  state = reducer(state, renamePlayer({ id: "p1", name: "Alice", club: "Club B" }));
  expect(state.registry["p1"].club).toBe("Club B");
});

test("renamePlayer clears the club when not provided", () => {
  let state = reducer(undefined, addPlayer({ id: "p1", name: "Alice", club: "Club A" }));
  state = reducer(state, renamePlayer({ id: "p1", name: "Alice" }));
  expect(state.registry["p1"].club).toBeUndefined();
});

test("renamePlayer does not affect other players", () => {
  let state = reducer(undefined, addPlayer({ id: "p1", name: "Alice" }));
  state = reducer(state, addPlayer({ id: "p2", name: "Bob" }));
  state = reducer(state, renamePlayer({ id: "p1", name: "Charlie" }));
  expect(state.registry["p2"].name).toBe("Bob");
});
