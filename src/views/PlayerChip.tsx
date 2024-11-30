import { Chip } from "@mui/material";
import { playerController } from "../controller/player";
import { PlayerId } from "../model/objects";

export default function PlayerChip({ player }: { player: PlayerId }) {
  const model = playerController.getPlayer(player);
  return <Chip label={model.name} variant="outlined" />;
}
