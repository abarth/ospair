import * as React from "react";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";
import {
  registerPlayer,
  unregisterPlayer,
  selectTournament,
  hasStarted,
  playerHasDroppedFromTournament,
} from "../store/tournament-slice";
import { selectSortedPlayerIds } from "../store/player-slice";
import PlayerImporter from "./PlayerImporter";
import PlayerChip from "./PlayerChip";
import RegisterPlayerButton from "./RegisterPlayerButton";
import RenamePlayerButton from "./RenamePlayerButton";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function PlayerRegistration() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const dispatch = useAppDispatch();

  const canRegisterPlayers = !hasStarted(tournament);

  const players = useSelector(selectSortedPlayerIds(tournament.players));
  const availablePlayers = useSelector(
    selectSortedPlayerIds(tournament.availablePlayers),
  );

  let playerList;
  if (players.length > 0) {
    playerList = (
      <React.Fragment>
        <Typography variant="h6">Players</Typography>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap" }}>
          {players.map((player) => {
            const dropped = playerHasDroppedFromTournament(tournament, player);
            return (
              <Stack key={player} direction="row" alignItems="center">
                <PlayerChip
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
                <RenamePlayerButton player={player} />
              </Stack>
            );
          })}
        </Stack>
      </React.Fragment>
    );
  }

  let availablePlayerList;
  if (availablePlayers.length > 0) {
    availablePlayerList = (
      <React.Fragment>
        <Typography variant="h6">People who are not playing</Typography>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap" }}>
          {availablePlayers.map((player) => (
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
      {playerList}
      {registerPlayerButton}
      {availablePlayerList}
    </Stack>
  );
}
