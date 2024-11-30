export type PlayerId = number;
export type PlayerName = string;
export type ClubName = string;
export type TableNumber = number;

export enum MatchResult {
  Win,
  Loss,
  Draw,
}

export interface Player {
  id: PlayerId;
  name: PlayerName;
  club: ClubName;
}

export interface Table {
  number: TableNumber;
  teams: PlayerId[][];
  results: MatchResult[];
}

export interface Round {
  tables: Table[];
}

export interface Tournament {
  players: Player[];
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
