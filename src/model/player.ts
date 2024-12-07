import { Player } from "./objects";

export function sortedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.name.localeCompare(b.name));
}
