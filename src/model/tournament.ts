import { average, sum } from "../base/math";
import {
  PlayerId,
  Round,
  Table,
  Team,
  MatchResult,
  TeamIndex,
  Tournament,
  RoundIndex,
} from "./objects";

// Whether the match was contested or a bye.
enum MatchType {
  // The team had an opponent during this match.
  Contested,

  // The team had a bye during this match.
  Bye,
}

// The result of a match from the perspective of a single team.
class MatchRecord {
  constructor(
    // Whether the match was contested or a bye.
    public matchType: MatchType,

    // The number of game wins the team had.
    public wins: number,

    // The number of game losses the team had.
    public losses: number,

    // The number of draws the team had.
    public draws: number,
  ) {}

  // The overall result of the match from the perspective of the team.
  get matchResult(): MatchResult {
    if (this.wins > this.losses) {
      return MatchResult.Win;
    }
    if (this.losses > this.wins) {
      return MatchResult.Loss;
    }
    return MatchResult.Draw;
  }

  // The number of match points the team scored.
  get matchPoints(): number {
    const matchResult = this.matchResult;
    switch (matchResult) {
      case MatchResult.Win:
        return 3;
      case MatchResult.Draw:
        return 1;
      case MatchResult.Loss:
        return 0;
    }
    throw new Error(`Unknow match result: ${matchResult}`);
  }

  // The maximum number of match points the team could have scored.
  get possibleMatchPoints(): number {
    return 3;
  }

  // The number of game points the team scored.
  get gamePoints(): number {
    return 3 * this.wins + this.draws;
  }

  // The maximum number of game points the team could have scored.
  get possibleGamePoints(): number {
    return 3 * (this.wins + this.losses + this.draws);
  }
}

// Get the match record for a team from a table.
function getMatchRecordFromTable(
  table: Table,
  teamIndex: TeamIndex,
): MatchRecord {
  // If there is only one team in the table, the team gets a bye.
  const matchType =
    table.teams.length === 1 ? MatchType.Bye : MatchType.Contested;
  const wins = table.wins[teamIndex];
  // The number of losses is the sum of the wins of all other teams.
  const losses = sum(table.wins.filter((value, index) => index !== teamIndex));
  const draws = table.draws;
  return new MatchRecord(matchType, wins, losses, draws);
}

// The minimum match win percentage and game win percentage that a player can have.
const MIN_MATCH_WIN_PERCENTAGE = 33.0;

// The minimum game win percentage that a player can have.
const MIN_GAME_WIN_PERCENTAGE = 33.0;

class PlayerHistory {
  // The number of match points the player has scored.
  //
  // Match points are awarded as follows:
  //
  // - 3 points for a win or a bye
  // - 1 point for a draw
  // - 0 points for a loss
  matchPoints: number = 0;

  // The maximum number of match points the player could have scored.
  possibleMatchPoints: number = 0;

  // The number of byes the player has received.
  byes: number = 0;

  // The number of game points the player has scored.
  //
  // Game points are awarded as follows:
  //
  // - 3 points for a game win
  // - 1 point for a draw
  // - 0 points for a game loss
  gamePoints: number = 0;

  // The maximum number of game points the player could have scored.
  possibleGamePoints: number = 0;

  // The players the player has played with.
  playedWith: Set<PlayerId> = new Set();

  // The players the player has played against.
  playedAgainst: Set<PlayerId> = new Set();

  // The average match win percentage of the players the player has played
  // against.
  opponentMatchWinPercentage: number = 0;

  // The average game win percentage of the players the player has played
  // against.
  opponentGameWinPercentage: number = 0;

  // The match win percentage of the player.
  get matchWinPercentage(): number {
    const bytesMatchPoints = this.byes * 3;
    const adjustedMatchPoints = this.matchPoints - bytesMatchPoints;
    const adjustedPossibleMatchPoints =
      this.possibleMatchPoints - bytesMatchPoints;
    const rawMatchWinPercentage =
      adjustedPossibleMatchPoints === 0
        ? 0
        : (adjustedMatchPoints / adjustedPossibleMatchPoints) * 100;
    return Math.max(MIN_MATCH_WIN_PERCENTAGE, rawMatchWinPercentage);
  }

  // The game win percentage of the player.
  get gameWinPercentage(): number {
    const gamePoints = this.gamePoints;
    const possibleGamePoints = this.possibleGamePoints;
    const rawGameWinPercentage =
      possibleGamePoints === 0 ? 0 : (gamePoints / possibleGamePoints) * 100;
    return Math.max(MIN_GAME_WIN_PERCENTAGE, rawGameWinPercentage);
  }

  static compare(a: PlayerHistory, b: PlayerHistory): number {
    // First, sort by match points.
    if (a.matchPoints !== b.matchPoints) {
      return b.matchPoints - a.matchPoints;
    }
    // The first tiebreaker is opponent match win percentage.
    if (a.opponentMatchWinPercentage !== b.opponentMatchWinPercentage) {
      return b.opponentMatchWinPercentage - a.opponentMatchWinPercentage;
    }
    // The second tiebreaker is player game win percentage.
    const aGameWinPercentage = a.gameWinPercentage;
    const bGameWinPercentage = b.gameWinPercentage;
    if (aGameWinPercentage !== bGameWinPercentage) {
      return bGameWinPercentage - aGameWinPercentage;
    }
    // The third tiebreaker is opponent game win percentage.
    if (a.opponentGameWinPercentage !== b.opponentGameWinPercentage) {
      return b.opponentGameWinPercentage - a.opponentGameWinPercentage;
    }
    // If all else fails, sort by player ID, which is essentially random
    // because the player IDs are assigned randomly.
    return a.player.localeCompare(b.player);
  }

  // Create a new player history for the given player.
  constructor(public player: PlayerId) {}

  // Record the result of a match for the player.
  recordMatchResult(record: MatchRecord) {
    this.matchPoints += record.matchPoints;
    this.possibleMatchPoints += record.possibleMatchPoints;
    this.gamePoints += record.gamePoints;
    this.possibleGamePoints += record.possibleGamePoints;

    if (record.matchType === MatchType.Bye) {
      this.byes++;
    }
  }

  // Record the teams the player played with and against.
  recordTeams(teams: Team[]) {
    for (const team of teams) {
      if (team.includes(this.player)) {
        this.addTeammates(team);
      } else {
        this.addOpponents(team);
      }
    }
  }

  // Add the players on a team to the list of teammates.
  private addTeammates(players: PlayerId[]) {
    for (const playerId of players) {
      if (playerId !== this.player) {
        this.playedWith.add(playerId);
      }
    }
  }

  // Add the players on a team to the list of opponents.
  private addOpponents(players: PlayerId[]) {
    for (const playerId of players) {
      if (playerId !== this.player) {
        this.playedAgainst.add(playerId);
      }
    }
  }
}

// The accumulated history of the players in a tournament.
export class TournamentHistory {
  playerHistory: Map<PlayerId, PlayerHistory> = new Map();
  standings: PlayerId[] = [];

  wereAllies(playerA: PlayerId, playerB: PlayerId): boolean {
    const playerHistory = this.playerHistory.get(playerA)!;
    return playerHistory.playedWith.has(playerB);
  }

  wereOpponents(playerA: PlayerId, playerB: PlayerId): boolean {
    const playerHistory = this.playerHistory.get(playerA)!;
    return playerHistory.playedAgainst.has(playerB);
  }
}

class WinPercentages {
  matchWinPercentages: Map<PlayerId, number> = new Map();
  gameWinPercentages: Map<PlayerId, number> = new Map();
}

// A builder for constructing a tournament history.
export class TournamentHistoryBuilder {
  playerHistory: Map<PlayerId, PlayerHistory> = new Map();

  registerPlayers(players: PlayerId[]) {
    for (const player of players) {
      this.getPlayerHistory(player);
    }
  }

  // Add a round to the history.
  addRound(round: Round) {
    for (const table of round.tables) {
      this.addTable(table);
    }
  }

  private addTable(table: Table) {
    for (const [teamIndex, team] of table.teams.entries()) {
      const record = getMatchRecordFromTable(table, teamIndex);
      for (const playerHistory of this.getPlayerHistoriesForTeam(team)) {
        playerHistory.recordTeams(table.teams);
        playerHistory.recordMatchResult(record);
      }
    }
  }

  private getPlayerHistoriesForTeam(team: Team): PlayerHistory[] {
    return team.map((player) => this.getPlayerHistory(player));
  }

  private getPlayerHistory(player: PlayerId): PlayerHistory {
    let playerHistory = this.playerHistory.get(player);
    if (typeof playerHistory !== "undefined") {
      return playerHistory;
    }
    playerHistory = new PlayerHistory(player);
    this.playerHistory.set(player, playerHistory);
    return playerHistory;
  }

  private getWinPercentages(): WinPercentages {
    const winPercentages = new WinPercentages();
    for (const playerHistory of this.playerHistory.values()) {
      winPercentages.matchWinPercentages.set(
        playerHistory.player,
        playerHistory.matchWinPercentage,
      );
      winPercentages.gameWinPercentages.set(
        playerHistory.player,
        playerHistory.gameWinPercentage,
      );
    }
    return winPercentages;
  }

  private computeOpponentWinPercentages() {
    const winPercentages = this.getWinPercentages();
    for (const playerHistory of this.playerHistory.values()) {
      const opponents = Array.from(playerHistory.playedAgainst);
      const opponentMatchWinPercentages = opponents.map(
        (opponent) => winPercentages.matchWinPercentages.get(opponent)!,
      );
      const opponentGameWinPercentages = opponents.map(
        (opponent) => winPercentages.gameWinPercentages.get(opponent)!,
      );
      playerHistory.opponentMatchWinPercentage =
        opponentMatchWinPercentages.length === 0
          ? MIN_MATCH_WIN_PERCENTAGE
          : average(opponentMatchWinPercentages);
      playerHistory.opponentGameWinPercentage =
        opponentGameWinPercentages.length === 0
          ? MIN_GAME_WIN_PERCENTAGE
          : average(opponentGameWinPercentages);
    }
  }

  private getStandings(): PlayerId[] {
    return Array.from(this.playerHistory.keys()).sort((a, b) => {
      return PlayerHistory.compare(
        this.getPlayerHistory(a),
        this.getPlayerHistory(b),
      );
    });
  }

  // Finish building the tournament history.
  build(): TournamentHistory {
    this.computeOpponentWinPercentages();
    const history = new TournamentHistory();
    history.playerHistory = this.playerHistory;
    history.standings = this.getStandings();
    return history;
  }
}

export function getTournamentHistoryForRound(
  tournament: Tournament,
  roundIndex: RoundIndex,
): TournamentHistory {
  if (roundIndex >= tournament.rounds.length) {
    throw new Error(`Round index ${roundIndex} out of bounds`);
  }
  const builder = new TournamentHistoryBuilder();
  builder.registerPlayers(tournament.players);
  for (let i = 0; i <= roundIndex; ++i) {
    builder.addRound(tournament.rounds[i]);
  }
  return builder.build();
}
