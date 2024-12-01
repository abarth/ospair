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
import { getCurrentRound, recordMatchResult } from "../controller/tournament";
import { Tournament, teamNames } from "../model/objects";
import PlayerChip from "./PlayerChip";

export default function ResultsEditor({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  const round = getCurrentRound(tournament);
  const theme = useTheme();
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
                      {players.map((player) => (
                        <PlayerChip player={player} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      value={table.outcome[teamIndex]}
                      onChange={(event) => {
                        const score = parseInt(event.target.value);
                        onTournamentUpdated(
                          recordMatchResult(
                            tournament,
                            table.number,
                            teamIndex,
                            score,
                          ),
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
