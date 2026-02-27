import { alea } from "seedrandom";
import { Table, Round, MatchFormat } from "../model/objects";
import {
  tournamentSlice,
  addPlayerMidTournament,
  tableHasResults,
  allTablesHaveResults,
} from "./tournament-slice";
import { createRound } from "../model/round";
import { getTournamentHistoryBeforeRound } from "../model/tournament";

const reducer = tournamentSlice.reducer;

function makeTable(overrides: Partial<Table> = {}): Table {
  return {
    number: 1,
    teams: [["alice"], ["bob"]],
    wins: [0, 0],
    draws: 0,
    ...overrides,
  };
}

function makeRound(tables: Table[]): Round {
  return {
    players: tables.flatMap((t) => t.teams.flat()),
    tables,
    dropped: [],
  };
}

describe("tableHasResults", () => {
  test("bye table always has results", () => {
    const table = makeTable({ teams: [["alice"]], wins: [0] });
    expect(tableHasResults(table)).toBe(true);
  });

  test("table with no wins and no draws has no results", () => {
    const table = makeTable({ wins: [0, 0], draws: 0 });
    expect(tableHasResults(table)).toBe(false);
  });

  test("table where team A has wins has results", () => {
    const table = makeTable({ wins: [2, 0], draws: 0 });
    expect(tableHasResults(table)).toBe(true);
  });

  test("table where team B has wins has results", () => {
    const table = makeTable({ wins: [0, 2], draws: 0 });
    expect(tableHasResults(table)).toBe(true);
  });

  test("table with only draws has results", () => {
    const table = makeTable({ wins: [0, 0], draws: 3 });
    expect(tableHasResults(table)).toBe(true);
  });

  test("table with wins and draws has results", () => {
    const table = makeTable({ wins: [1, 1], draws: 1 });
    expect(tableHasResults(table)).toBe(true);
  });
});

describe("allTablesHaveResults", () => {
  test("round with no tables has all results", () => {
    const round = makeRound([]);
    expect(allTablesHaveResults(round)).toBe(true);
  });

  test("round where all tables have results", () => {
    const round = makeRound([
      makeTable({ number: 1, wins: [2, 0], draws: 0 }),
      makeTable({ number: 2, wins: [0, 2], draws: 0 }),
      makeTable({ number: 3, wins: [1, 1], draws: 1 }),
    ]);
    expect(allTablesHaveResults(round)).toBe(true);
  });

  test("round where one table is pending", () => {
    const round = makeRound([
      makeTable({ number: 1, wins: [2, 0], draws: 0 }),
      makeTable({ number: 2, wins: [0, 0], draws: 0 }),
    ]);
    expect(allTablesHaveResults(round)).toBe(false);
  });

  test("round where all tables are pending", () => {
    const round = makeRound([
      makeTable({ number: 1, wins: [0, 0], draws: 0 }),
      makeTable({ number: 2, wins: [0, 0], draws: 0 }),
    ]);
    expect(allTablesHaveResults(round)).toBe(false);
  });

  test("bye table does not block all-results detection", () => {
    const round = makeRound([
      makeTable({ number: 1, wins: [2, 0], draws: 0 }),
      makeTable({ number: 2, teams: [["charlie"]], wins: [0] }),
    ]);
    expect(allTablesHaveResults(round)).toBe(true);
  });

  test("mix of done tables, bye, and pending table returns false", () => {
    const round = makeRound([
      makeTable({ number: 1, wins: [2, 0], draws: 0 }),
      makeTable({ number: 2, teams: [["charlie"]], wins: [0] }),
      makeTable({ number: 3, wins: [0, 0], draws: 0 }),
    ]);
    expect(allTablesHaveResults(round)).toBe(false);
  });
});

// A minimal pre-built state with one tournament and one completed round.
// Players p1–p4 played round 1: p1 beat p2 at table 1, p3 beat p4 at table 2.
function stateWithOneRound() {
  return {
    registry: {
      t1: {
        id: "t1",
        name: "Test Tournament",
        matchFormat: MatchFormat.HeadToHead,
        players: ["p1", "p2", "p3", "p4"],
        availablePlayers: [],
        rounds: [
          {
            players: ["p1", "p2", "p3", "p4"],
            tables: [
              { number: 1, teams: [["p1"], ["p2"]], wins: [2, 1], draws: 0 },
              { number: 2, teams: [["p3"], ["p4"]], wins: [2, 0], draws: 0 },
            ],
            dropped: [],
          },
        ],
      },
    },
  };
}

// A state with two completed rounds.
function stateWithTwoRounds() {
  return {
    registry: {
      t1: {
        id: "t1",
        name: "Test Tournament",
        matchFormat: MatchFormat.HeadToHead,
        players: ["p1", "p2", "p3", "p4"],
        availablePlayers: [],
        rounds: [
          {
            players: ["p1", "p2", "p3", "p4"],
            tables: [
              { number: 1, teams: [["p1"], ["p2"]], wins: [2, 1], draws: 0 },
              { number: 2, teams: [["p3"], ["p4"]], wins: [2, 0], draws: 0 },
            ],
            dropped: [],
          },
          {
            players: ["p1", "p2", "p3", "p4"],
            tables: [
              { number: 1, teams: [["p1"], ["p3"]], wins: [2, 0], draws: 0 },
              { number: 2, teams: [["p2"], ["p4"]], wins: [1, 2], draws: 0 },
            ],
            dropped: [],
          },
        ],
      },
    },
  };
}

describe("addPlayerMidTournament", () => {
  test("adds player to tournament.players", () => {
    const state = reducer(stateWithOneRound(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    expect(state.registry["t1"].players).toContain("p5");
  });

  test("gives the new player a bye in the existing round", () => {
    const state = reducer(stateWithOneRound(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    const round = state.registry["t1"].rounds[0];
    const byeTable = round.tables.find((t: any) => t.teams.length === 1 && t.teams[0][0] === "p5");
    expect(byeTable).toBeDefined();
    expect(byeTable!.wins).toEqual([2]);
  });

  test("gives the new player a bye in every existing round", () => {
    const state = reducer(stateWithTwoRounds(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    for (const round of state.registry["t1"].rounds) {
      const byeTable = round.tables.find((t: any) => t.teams.length === 1 && t.teams[0][0] === "p5");
      expect(byeTable).toBeDefined();
      expect(byeTable!.wins).toEqual([2]);
    }
  });

  test("does not change existing pairings in previous rounds", () => {
    const state = reducer(stateWithOneRound(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    const round = state.registry["t1"].rounds[0];

    // The two original tables must remain exactly as they were.
    expect(round.tables[0].teams).toEqual([["p1"], ["p2"]]);
    expect(round.tables[0].wins).toEqual([2, 1]);
    expect(round.tables[0].draws).toBe(0);

    expect(round.tables[1].teams).toEqual([["p3"], ["p4"]]);
    expect(round.tables[1].wins).toEqual([2, 0]);
    expect(round.tables[1].draws).toBe(0);

    // Only one extra table (the bye) should have been appended.
    expect(round.tables.length).toBe(3);
  });

  test("does not change existing pairings across multiple rounds", () => {
    const state = reducer(stateWithTwoRounds(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    const [round0, round1] = state.registry["t1"].rounds;

    expect(round0.tables[0].teams).toEqual([["p1"], ["p2"]]);
    expect(round0.tables[1].teams).toEqual([["p3"], ["p4"]]);
    expect(round0.tables.length).toBe(3); // 2 original + 1 bye

    expect(round1.tables[0].teams).toEqual([["p1"], ["p3"]]);
    expect(round1.tables[1].teams).toEqual([["p2"], ["p4"]]);
    expect(round1.tables.length).toBe(3); // 2 original + 1 bye
  });

  test("adds new player to each round's players list", () => {
    const state = reducer(stateWithTwoRounds(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    for (const round of state.registry["t1"].rounds) {
      expect(round.players).toContain("p5");
    }
  });

  test("new player is included in the next round's pairings", () => {
    const state = reducer(stateWithOneRound(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    const tournament = state.registry["t1"];
    // Create the next round using the model – p5 must appear since they are in
    // round 0's players list and were not dropped.
    const prng = alea("test-seed");
    const nextRound = createRound(prng, tournament, 1);
    const seatedPlayers = nextRound.tables.flatMap((t: any) => t.teams.flat());
    expect(seatedPlayers).toContain("p5");
  });

  test("player history shows byes for all prior rounds", () => {
    const state = reducer(stateWithTwoRounds(), addPlayerMidTournament({ tournamentId: "t1", player: "p5" }));
    const tournament = state.registry["t1"];
    // History before round 2 (index 2) reflects both rounds.
    const history = getTournamentHistoryBeforeRound(tournament, 2);
    const p5History = history.playerHistory.get("p5")!;
    expect(p5History).toBeDefined();
    expect(p5History.byes).toBe(2);
    // Two byes = 6 match points.
    expect(p5History.matchPoints).toBe(6);
  });
});
