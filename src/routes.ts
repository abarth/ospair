import { RoundIndex, TournamentId } from "./model/objects";

export function routeTo({
  tournamentId,
  roundIndex,
}: {
  tournamentId: TournamentId;
  roundIndex?: RoundIndex;
}) {
  if (typeof roundIndex !== "undefined") {
    return `/tournament/${tournamentId}/round/${roundIndex + 1}`;
  }
  return `/tournament/${tournamentId}`;
}
