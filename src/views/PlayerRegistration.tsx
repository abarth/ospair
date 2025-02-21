import * as React from "react";
import { Stack, Typography } from "@mui/material";
import {
  registerPlayer,
  unregisterPlayer,
  hasRegisteredPlayers,
  hasAvailablePlayers,
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

  let playerList;
  if (hasRegisteredPlayers(tournament)) {
    playerList = (
      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap" }}>
        {tournament.players.map((player) => {
          const dropped = playerHasDroppedFromTournament(tournament, player);
          return (
            <PlayerChip
              key={player}
              player={player}
              color={dropped ? "error" : undefined}
              onDelete={
                canRegisterPlayers
                  ? () =>
                      dispatch(
                        unregisterPlayer({
                          tournamentId: tournament.id,
                          player,
                        }),
                      )
                  : undefined
              }
            />
          );
        })}
      </Stack>
    );
  }

  let unregisteredPlayerList;
  if (hasAvailablePlayers(tournament)) {
    unregisteredPlayerList = (
      <React.Fragment>
        <Typography variant="h6">Available Players</Typography>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap" }}>
          {tournament.availablePlayers.map((player) => (
            <PlayerChip
              key={player}
              player={player}
              onClick={
                canRegisterPlayers
                  ? () =>
                      dispatch(
                        registerPlayer({ tournamentId: tournament.id, player }),
                      )
                  : undefined
              }
            />
          ))}
        </Stack>
      </React.Fragment>
    );
  }

  let registerPlayerButton;
  if (canRegisterPlayers) {
    registerPlayerButton = (
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <PlayerImporter />
        <Typography>or</Typography>
        <RegisterPlayerButton disabled={!canRegisterPlayers} />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Players</Typography>
      {playerList}
      {registerPlayerButton}
      {unregisteredPlayerList}
    </Stack>
  );
}
