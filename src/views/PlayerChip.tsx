import { Chip } from "@mui/material";
import { playerController } from "../controller/player";
import { PlayerId } from "../model/objects";

export default function PlayerChip({
  player,
  onDelete,
}: {
  player: PlayerId;
  onDelete?: () => void;
}) {
  const playerModel = playerController.getPlayer(player);
  return (
    <Chip label={playerModel.name} variant="outlined" onDelete={onDelete} />
  );
}
