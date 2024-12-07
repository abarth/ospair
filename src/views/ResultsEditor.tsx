import * as React from "react";
import {
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  dropPlayer,
  undropPlayer,
  playerHasDropped,
  setMatchWins,
  setMatchDraws,
  selectRound,
  isCurrentRound,
} from "../store/tournament-slice";
import { teamNames } from "../model/objects";
import StyledTableRow from "./StyledTableRow";
import PlayerChip from "./PlayerChip";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function ResultsEditor() {
  const { tournament, roundIndex, round } = useAppSelector(
    selectRound(useParams()),
  );
  const dispatch = useAppDispatch();
  if (!round) {
    return <>{`Round ${roundIndex + 1} not found`}</>;
  }
  const isEditable = isCurrentRound(tournament, roundIndex);
  const maxTeamCount = Math.max(
    ...round.tables.map((table) => table.teams.length),
  );
  const teamArray = Array.from({ length: maxTeamCount }).fill(0);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
            {teamArray.map((_, teamIndex) => (
              <React.Fragment key={teamIndex}>
                <TableCell align="right">Wins</TableCell>
                <TableCell>{teamNames[teamIndex]}</TableCell>
              </React.Fragment>
            ))}
            <TableCell align="right">Draws</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {round.tables.map((table, tableIndex) => {
            const isBye = table.teams.length === 1;
            return (
              <StyledTableRow key={tableIndex}>
                <TableCell key="table-number" component="th" scope="row">
                  {isBye ? "Bye" : table.number}
                </TableCell>
                {teamArray.map((_, teamIndex) => {
                  if (teamIndex >= table.teams.length) {
                    return (
                      <React.Fragment key={teamIndex}>
                        <TableCell />
                        <TableCell />
                      </React.Fragment>
                    );
                  }
                  const players = table.teams[teamIndex];
                  return (
                    <React.Fragment key={teamIndex}>
                      <TableCell align="right">
                        {isBye ? null : (
                          <Select
                            variant="outlined"
                            size="small"
                            autoWidth
                            disabled={!isEditable}
                            value={table.wins[teamIndex]}
                            onChange={(event) => {
                              const wins = event.target.value as number;
                              dispatch(
                                setMatchWins({
                                  tournamentId: tournament.id,
                                  roundIndex,
                                  tableNumber: table.number,
                                  teamIndex,
                                  wins,
                                }),
                              );
                            }}
                          >
                            <MenuItem value={0}>0</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                          </Select>
                        )}
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
                    </React.Fragment>
                  );
                })}
                <TableCell align="right">
                  {isBye ? null : (
                    <Select
                      variant="outlined"
                      size="small"
                      autoWidth
                      disabled={!isEditable}
                      value={table.draws}
                      onChange={(event) => {
                        const draws = event.target.value as number;
                        dispatch(
                          setMatchDraws({
                            tournamentId: tournament.id,
                            roundIndex,
                            tableNumber: table.number,
                            draws,
                          }),
                        );
                      }}
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                    </Select>
                  )}
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
