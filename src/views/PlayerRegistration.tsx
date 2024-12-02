import { Stack, Typography } from "@mui/material";
import {
  unregisterPlayer,
  hasRegisteredPlayers,
  selectTournament,
  hasStarted,
  playerHasDroppedFromTournament,
} from "../store/tournament-slice";
import PlayerImporter from "./PlayerImporter";
import PlayerChip from "./PlayerChip";
import RegisterPlayerButton from "./RegisterPlayerButton";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function PlayerRegistration() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const dispatch = useAppDispatch();

  const canRegisterPlayers = !hasStarted(tournament);

  let players;
  if (hasRegisteredPlayers(tournament)) {
    players = tournament.players.map((player) => {
      const dropped = playerHasDroppedFromTournament(tournament, player);
      return (
        <PlayerChip
          key={player}
          player={player}
          dropped={dropped}
          onDelete={
            canRegisterPlayers
              ? () =>
                  dispatch(
                    unregisterPlayer({ tournamentId: tournament.id, player }),
                  )
              : undefined
          }
        />
      );
    });
  } else {
    players = <Typography>No players registered</Typography>;
  }
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Players</Typography>
      {canRegisterPlayers ? <PlayerImporter /> : null}
      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap" }}>
        {players}
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <RegisterPlayerButton disabled={!canRegisterPlayers} />
      </Stack>
    </Stack>
  );
}
