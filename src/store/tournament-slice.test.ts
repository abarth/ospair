import { Table, Round } from "../model/objects";
import { tableHasResults, allTablesHaveResults } from "./tournament-slice";

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
