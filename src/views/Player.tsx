import { playerController } from "../controller/player";
import { PlayerId } from "../model/objects";

export default function Player({ id }: { id: PlayerId }) {
  const player = playerController.getPlayer(id);
  return <div>{player.name}</div>;
}
