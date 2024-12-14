import { zip } from "../base/array";
import { MatchFormat, Round, Table, Team, Tournament } from "../model/objects";
import { getPlayersForRound } from "../model/round";

const PLAYER_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Kevin",
  "Linda",
  "Mabel",
  "Nancy",
  "Oliver",
  "Peggy",
  "Quincy",
  "Randy",
  "Sally",
  "Tom",
  "Ursula",
  "Victor",
  "Wendy",
  "Xander",
  "Yvonne",
  "Zelda",
];

export function createMockTournament({
  matchFormat,
  playerCount,
}: {
  matchFormat: MatchFormat;
  playerCount: number;
}): Tournament {
  return {
    id: "mock-tournament",
    name: "Mock Tournament",
    matchFormat: matchFormat,
    rounds: [],
    players: PLAYER_NAMES.slice(0, playerCount),
  };
}

interface MockPairing {
  teams: Team[];
}

export function createMockRound(
  tournament: Tournament,
  parings: MockPairing[],
): Round {
  const roundIndex = tournament.rounds.length;
  const players = getPlayersForRound(tournament, roundIndex);
  const tables: Table[] = [];
  for (const { teams } of parings) {
    tables.push({
      number: tables.length + 1,
      teams: teams,
      wins: teams.map(() => 0),
      draws: 0,
    });
  }
  return {
    players,
    tables,
    dropped: [],
  };
}

interface MockResults {
  wins: number[];
  draws: number;
}

export function playMockRound(tournament: Tournament, results: MockResults[]) {
  const roundIndex = tournament.rounds.length - 1;
  const round = tournament.rounds[roundIndex];
  for (const [table, result] of zip(round.tables, results)) {
    table.wins = [...result.wins];
    table.draws = result.draws;
  }
}
