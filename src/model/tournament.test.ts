import { createMockTournament } from "../testing/mock-tournament";
import { MatchFormat } from "./objects";
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
