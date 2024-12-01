import { Chip } from "@mui/material";
import { PlayerId } from "../model/objects";
import { useAppSelector } from "../store/hooks";
import { selectPlayer } from "../store/player-slice";

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
  const playerModel = useAppSelector(selectPlayer(player));
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
