export type TournamentId = string;
export type PlayerId = string;
export type PlayerName = string;
export type ClubName = string;
export type TeamIndex = number;
export type RoundIndex = number;
export type TableNumber = number;
type TeamName = string;

export enum MatchFormat {
  /// One player plays against another player.
  HeadToHead = "head-to-head",

  /// Two players play as a team against another team of two players.
  TwoHeadedGiant = "two-headed-giant",
}

export enum MatchResult {
  /// The team won the match.
  Win = "win",

  /// The team lost the match.
  Loss = "loss",

  /// The match was a draw.
  Draw = "draw",
}

export interface Player {
  /// The unique identifier for the player.
  id: PlayerId;

  /// The name of the player.
  name: PlayerName;

  /// The club to which the player belongs.
  club?: ClubName;
}

export const teamNames = ["Team A", "Team B", "Team C"];

export type Team = PlayerId[];

export interface Table {
  /// The number of the table.
  number: TableNumber;

  /// The teams that played at this table.
  teams: Team[];

  /// The number of game wins for each team.
  wins: number[];

  /// The number of draws for the table.
  draws: number;

  /// Whether results have been explicitly recorded for this table.
  ///
  /// A table may have 0 wins and 0 draws legitimately (e.g., when losses are
  /// awarded as a penalty), so this flag distinguishes an intentionally
  /// recorded result from the initial unplayed state.
  reported?: boolean;
}

export interface Seating {
  /// The table number at which the player was seated.
  tableNumber: TableNumber;

  /// The name of the team to which the player belongs.
  ///
  /// If a player does not have a team, the player has a bye.
  teamName?: TeamName;

  /// The team to which the player belongs.
  allies: Team;

  /// The teams that the player's team played against.
  opposingTeams: Team[];
}

export interface Round {
  /// The players who played in this round.
  players: PlayerId[];

  /// The tables to which players were assigned to play matches in this round.
  tables: Table[];

  /// The players who dropped from the tournament after this round.
  dropped: PlayerId[];
}

export interface Tournament {
  /// The unique identifier for the tournament.
  id: TournamentId;

  /// The name of the tournament.
  name: string;

  /// The format of matches in the tournament (e.g., head-to-head or
  /// two-headed-giant).
  matchFormat: MatchFormat;

  /// The list of players playing in the tournament.
  players: PlayerId[];

  /// The list of players who registered for the tournament but who did not
  /// play in the tournament.
  availablePlayers: PlayerId[];

  /// The rounds played in the tournament.
  rounds: Round[];

  /// Whether the tournament has been deleted.
  ///
  /// If a tournament has been deleted, it should not be displayed in the UI.
  deleted?: boolean;
}

export interface Registration {
  "Last Name": string;
  "First Name": string;
  Club: string;
}

export function isRegistration(arg: any): arg is Registration {
  return (
    arg &&
    typeof arg["Last Name"] === "string" &&
    typeof arg["First Name"] === "string" &&
    typeof arg["Club"] === "string"
  );
}
