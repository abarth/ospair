import { RoundIndex, TournamentId } from "./model/objects";

export interface RouteDescriptor {
  tournamentId?: TournamentId;
  roundIndex?: RoundIndex;
}

export function routeTo({ tournamentId, roundIndex }: RouteDescriptor) {
  if (typeof tournamentId === "undefined") {
    if (typeof roundIndex !== "undefined") {
      throw new Error("Cannot specify roundIndex without tournamentId");
    }
    return "/";
  }
  if (typeof roundIndex === "undefined") {
    return `/tournament/${tournamentId}`;
  }
  return `/tournament/${tournamentId}/round/${roundIndex + 1}`;
}
