import {
  createMockTournament,
  playMockRound,
} from "../testing/mock-tournament";
import { MatchFormat } from "./objects";
import { createRound } from "./round";
import { getTournamentHistoryBeforeRound } from "./tournament";

test("history after zero rounds", () => {
  const tournament = createMockTournament({
    matchFormat: MatchFormat.SinglePlayer,
    playerCount: 6,
  });

  const history = getTournamentHistoryBeforeRound(tournament, 0);
  expect(Array.from(history.playerHistory.keys())).toEqual(
    expect.arrayContaining(tournament.players),
  );
  expect(history.standings).toEqual(expect.arrayContaining(tournament.players));
  for (const playerHistory of history.playerHistory.values()) {
    expect(playerHistory.matchPoints).toBe(0);
    expect(playerHistory.possibleMatchPoints).toBe(0);
    expect(playerHistory.byes).toBe(0);
    expect(playerHistory.gamePoints).toBe(0);
    expect(playerHistory.possibleGamePoints).toBe(0);
    expect(Array.from(playerHistory.playedWith.values())).toEqual([]);
    expect(Array.from(playerHistory.playedAgainst.values())).toEqual([]);
    expect(playerHistory.opponentMatchWinPercentage).toBe(33);
    expect(playerHistory.opponentGameWinPercentage).toBe(33);
    expect(playerHistory.matchWinPercentage).toBe(33);
    expect(playerHistory.gameWinPercentage).toBe(33);
  }
});

test("history after one round", () => {
  const tournament = createMockTournament({
    matchFormat: MatchFormat.SinglePlayer,
    playerCount: 6,
  });
  tournament.rounds.push(createRound(tournament, 0));
  const p00 = tournament.rounds[0].tables[0].teams[0][0];
  const p01 = tournament.rounds[0].tables[0].teams[1][0];
  const p10 = tournament.rounds[0].tables[1].teams[0][0];
  const p11 = tournament.rounds[0].tables[1].teams[1][0];
  const p20 = tournament.rounds[0].tables[2].teams[0][0];
  const p21 = tournament.rounds[0].tables[2].teams[1][0];

  playMockRound(tournament, [
    { wins: [2, 1], draws: 0 },
    { wins: [1, 1], draws: 1 },
    { wins: [0, 1], draws: 1 },
  ]);

  tournament.rounds[0].dropped = [p01];

  const history = getTournamentHistoryBeforeRound(tournament, 1);
  expect(Array.from(history.playerHistory.keys())).toEqual(
    expect.arrayContaining(tournament.players),
  );
  expect(history.standings).toEqual(expect.arrayContaining(tournament.players));

  const p00History = history.playerHistory.get(p00)!;
  expect(p00History.matchPoints).toBe(3);
  expect(p00History.possibleMatchPoints).toBe(3);
  expect(p00History.byes).toBe(0);
  expect(p00History.gamePoints).toBe(6);
  expect(p00History.possibleGamePoints).toBe(9);
  expect(Array.from(p00History.playedWith.values())).toEqual([]);
  expect(Array.from(p00History.playedAgainst.values())).toEqual([p01]);
  expect(p00History.opponentMatchWinPercentage).toBe(33);
  expect(p00History.opponentGameWinPercentage.toFixed(2)).toBe("33.33");
  expect(p00History.matchWinPercentage).toBe(100);
  expect(p00History.gameWinPercentage.toFixed(2)).toBe("66.67");

  const p01History = history.playerHistory.get(p01)!;
  expect(p01History.matchPoints).toBe(0);
  expect(p01History.possibleMatchPoints).toBe(3);
  expect(p01History.byes).toBe(0);
  expect(p01History.gamePoints).toBe(3);
  expect(p01History.possibleGamePoints).toBe(9);
  expect(Array.from(p01History.playedWith.values())).toEqual([]);
  expect(Array.from(p01History.playedAgainst.values())).toEqual([p00]);
  expect(p01History.opponentMatchWinPercentage).toBe(100);
  expect(p01History.opponentGameWinPercentage.toFixed(2)).toBe("66.67");
  expect(p01History.matchWinPercentage).toBe(33);
  expect(p01History.gameWinPercentage.toFixed(2)).toBe("33.33");

  for (const p of [p10, p11]) {
    const pHistory = history.playerHistory.get(p)!;
    expect(pHistory.matchPoints).toBe(1);
    expect(pHistory.possibleMatchPoints).toBe(3);
    expect(pHistory.byes).toBe(0);
    expect(pHistory.gamePoints).toBe(4);
    expect(pHistory.possibleGamePoints).toBe(9);
    expect(Array.from(pHistory.playedWith.values())).toEqual([]);
    const opponent = p === p10 ? p11 : p10;
    expect(Array.from(pHistory.playedAgainst.values())).toEqual([opponent]);
    expect(pHistory.opponentMatchWinPercentage.toFixed(2)).toBe("33.33");
    expect(pHistory.opponentGameWinPercentage.toFixed(2)).toBe("44.44");
    expect(pHistory.matchWinPercentage.toFixed(2)).toBe("33.33");
    expect(pHistory.gameWinPercentage.toFixed(2)).toBe("44.44");
  }

  const p20History = history.playerHistory.get(p20)!;
  expect(p20History.matchPoints).toBe(0);
  expect(p20History.possibleMatchPoints).toBe(3);
  expect(p20History.byes).toBe(0);
  expect(p20History.gamePoints).toBe(1);
  expect(p20History.possibleGamePoints).toBe(6);
  expect(Array.from(p20History.playedWith.values())).toEqual([]);
  expect(Array.from(p20History.playedAgainst.values())).toEqual([p21]);
  expect(p20History.opponentMatchWinPercentage).toBe(100);
  expect(p20History.opponentGameWinPercentage.toFixed(2)).toBe("66.67");
  expect(p20History.matchWinPercentage).toBe(33);
  expect(p20History.gameWinPercentage).toBe(33);

  const p21History = history.playerHistory.get(p21)!;
  expect(p21History.matchPoints).toBe(3);
  expect(p21History.possibleMatchPoints).toBe(3);
  expect(p21History.byes).toBe(0);
  expect(p21History.gamePoints).toBe(4);
  expect(p21History.possibleGamePoints).toBe(6);
  expect(Array.from(p21History.playedWith.values())).toEqual([]);
  expect(Array.from(p21History.playedAgainst.values())).toEqual([p20]);
  expect(p21History.opponentMatchWinPercentage).toBe(33);
  expect(p21History.opponentGameWinPercentage).toBe(33);
  expect(p21History.matchWinPercentage).toBe(100);
  expect(p21History.gameWinPercentage.toFixed(2)).toBe("66.67");
});
