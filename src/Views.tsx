import { Player } from "./model";

export function PlayerView({ player }: { player: Player }) {
  return <div className="Player">{player.name}</div>;
}

export function PlayerList({ players }: { players: Player[] }) {
  return (
    <div className="PlayerList">
      {players.map((player) => (
        <PlayerView player={player} />
      ))}
    </div>
  );
}
