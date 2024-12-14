import {
  createMockRound,
  createMockTournament,
  playMockRound,
} from "../testing/mock-tournament";
import { MatchFormat, PlayerId } from "./objects";
import { createRound } from "./round";

test("pairings for first round", () => {
  const tournament = createMockTournament({
    matchFormat: MatchFormat.HeadToHead,
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

test("pairings for second round", () => {
  const tournament = createMockTournament({
    matchFormat: MatchFormat.HeadToHead,
    playerCount: 8,
  });
  tournament.rounds.push(
    createMockRound(tournament, [
      {
        teams: [[tournament.players[0]], [tournament.players[1]]],
      },
      {
        teams: [[tournament.players[2]], [tournament.players[3]]],
      },
      {
        teams: [[tournament.players[4]], [tournament.players[5]]],
      },
      {
        teams: [[tournament.players[6]], [tournament.players[7]]],
      },
    ]),
  );
  playMockRound(tournament, [
    { wins: [2, 1], draws: 0 },
    { wins: [1, 2], draws: 0 },
    { wins: [1, 1], draws: 1 },
    { wins: [1, 1], draws: 1 },
  ]);
  const round = createRound(tournament, 1);
  expect(round.players).toEqual(expect.arrayContaining(tournament.players));
  expect(round.tables.length).toBe(4);
  // Winners from the first round are seated first
  expect(round.tables[0].teams.flat()).toEqual(
    expect.arrayContaining([tournament.players[0], tournament.players[3]]),
  );
  const previousMatches = [
    [tournament.players[0], tournament.players[1]].sort(),
    [tournament.players[2], tournament.players[3]].sort(),
    [tournament.players[4], tournament.players[5]].sort(),
    [tournament.players[6], tournament.players[7]].sort(),
  ];
  function checkForRematch(players: PlayerId[]) {
    const sortedPlayers = [...players].sort();
    for (const match of previousMatches) {
      expect(sortedPlayers).not.toEqual(expect.arrayContaining(match));
    }
  }
  for (const table of round.tables.slice(1, 2)) {
    checkForRematch(table.teams.flat());
  }
  // Losers from the first round are seated last
  expect(round.tables[3].teams.flat()).toEqual(
    expect.arrayContaining([tournament.players[1], tournament.players[2]]),
  );
});
