export type PlayerId = number;
export type PlayerName = string;
export type ClubName = string;
export type TableNumber = number;
type TeamName = string;

export enum MatchFormat {
  SinglePlayer = "single-player",
  TwoHeadedGiant = "two-headed-giant",
}

export interface Player {
  id: PlayerId;
  name: PlayerName;
  club: ClubName;
}

export const teamNames = ["Team A", "Team B", "Team C"];

export type Team = PlayerId[];
export type Score = number;

export interface Table {
  number: TableNumber;
  teams: Team[];
  outcome: Score[];
}

export interface Seating {
  number: TableNumber;
  // If a player does not have a team, the player has a bye.
  team?: TeamName;
}

export interface Round {
  players: PlayerId[];
  tables: Table[];
  dropped: PlayerId[];
}

export interface Tournament {
  name: string;
  matchFormat: MatchFormat;
  players: PlayerId[];
  rounds: Round[];
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
