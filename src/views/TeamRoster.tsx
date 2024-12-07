import { useSelector } from "react-redux";
import { PlayerId } from "../model/objects";
import { sortedPlayers } from "../model/player";
import { selectPlayers } from "../store/player-slice";

export default function TeamRoster({
  team,
  lead,
}: {
  team: PlayerId[];
  lead?: PlayerId;
}) {
  let players = sortedPlayers(useSelector(selectPlayers(team)));
  if (lead) {
    const leadIndex = players.findIndex((player) => player.id === lead);
    if (leadIndex >= 0) {
      const leadPlayer = players[leadIndex];
      players.splice(leadIndex, 1);
      players.unshift(leadPlayer);
    }
  }
  return <>{players.map((player) => player.name).join(", ")}</>;
}
