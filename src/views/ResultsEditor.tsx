import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getCurrentRound } from "../controller/tournament";
import { Tournament } from "../model/objects";
import StyledTableRow from "./StyledTableRow";

export default function ResultsEditor({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  const round = getCurrentRound(tournament);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {round.tables.map((table) => {
            return (
              <StyledTableRow key={table.number}>
                <TableCell component="th" scope="row">
                  {table.number}
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
