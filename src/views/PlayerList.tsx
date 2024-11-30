import { PlayerId } from "../model/objects";
import Player from "./Player";

export default function PlayerList({ players }: { players: PlayerId[] }) {
  return (
    <div>
      {players.map((id) => (
        <div key={id}>
          <Player id={id} />
        </div>
      ))}
    </div>
  );
}
