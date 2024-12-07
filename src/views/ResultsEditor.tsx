import * as React from "react";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { SxProps, useTheme } from "@mui/material/styles";
import {
  dropPlayer,
  undropPlayer,
  playerHasDropped,
  setMatchResult,
  selectRound,
  isCurrentRound,
} from "../store/tournament-slice";
import { teamNames } from "../model/objects";
import PlayerChip from "./PlayerChip";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function ResultsEditor() {
  const { tournament, roundIndex, round } = useAppSelector(
    selectRound(useParams()),
  );
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isEditable = isCurrentRound(tournament, roundIndex);
  // TODO: Be sure to show players who have byes so they can be dropped.
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Players</TableCell>
            <TableCell>Wins</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {round.tables.flatMap((table) => {
            const sx: SxProps = {
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            };
            if (table.number % 2 === 0) {
              sx["backgroundColor"] = theme.palette.action.hover;
            }
            return table.teams.map((players, teamIndex) => {
              return (
                <TableRow key={table.number} sx={sx}>
                  <TableCell component="th" scope="row">
                    Table {table.number}, {teamNames[teamIndex]}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {players.map((player) => {
                        const hasDropped = playerHasDropped(round, player);
                        return (
                          <PlayerChip
                            player={player}
                            dropped={hasDropped}
                            onClick={
                              isEditable && hasDropped
                                ? () => {
                                    dispatch(
                                      undropPlayer({
                                        tournamentId: tournament.id,
                                        roundIndex,
                                        player,
                                      }),
                                    );
                                  }
                                : undefined
                            }
                            onDelete={
                              !isEditable || hasDropped
                                ? undefined
                                : () => {
                                    dispatch(
                                      dropPlayer({
                                        tournamentId: tournament.id,
                                        roundIndex,
                                        player,
                                      }),
                                    );
                                  }
                            }
                          />
                        );
                      })}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      disabled={!isEditable}
                      value={table.wins[teamIndex]}
                      onChange={(event) => {
                        const wins = parseInt(event.target.value);
                        dispatch(
                          setMatchResult({
                            tournamentId: tournament.id,
                            roundIndex,
                            tableNumber: table.number,
                            teamIndex,
                            wins,
                          }),
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
