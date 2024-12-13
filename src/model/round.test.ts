import { createMockTournament } from "../testing/mock-tournament";
import { MatchFormat } from "./objects";
import { createRound } from "./round";

test("pairings for first round", () => {
  const tournament = createMockTournament({
    matchFormat: MatchFormat.SinglePlayer,
    playerCount: 6,
  });
  const round = createRound(tournament, 0);
  expect(round.players).toEqual(expect.arrayContaining(tournament.players));
  expect(round.tables.length).toBe(3);
  expect(round.dropped).toEqual([]);
  const seatedPlayers = [];
  for (const table of round.tables) {
    expect(table.teams.length).toBe(2);
    for (const team of table.teams) {
      expect(team.length).toBe(1);
      seatedPlayers.push(...team);
    }
    expect(table.wins).toEqual([0, 0]);
    expect(table.draws).toBe(0);
  }

  expect(seatedPlayers).toEqual(expect.arrayContaining(tournament.players));
});
