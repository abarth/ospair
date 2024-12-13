import { sortedPlayers } from "./player";

test("sorts players", () => {
  const players = [
    { id: "54", name: "Alice" },
    { id: "26", name: "Bob" },
    { id: "78", name: "Charlie" },
  ];
  expect(sortedPlayers(players)).toEqual(players);
  expect(sortedPlayers(Array.from(players).reverse())).toEqual(players);
  expect(sortedPlayers(players.slice(1).concat(players[0]))).toEqual(players);
});
