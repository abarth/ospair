import { Chip } from "@mui/material";
import { playerController } from "../controller/player";
import { PlayerId } from "../model/objects";

export default function PlayerChip({
  player,
  dropped,
  onClick,
  onDelete,
}: {
  player: PlayerId;
  dropped?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}) {
  const playerModel = playerController.getPlayer(player);
  return (
    <Chip
      label={playerModel.name}
      variant="outlined"
      onClick={onClick}
      onDelete={onDelete}
      color={dropped ? "error" : "default"}
    />
  );
}
