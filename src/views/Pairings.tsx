import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getSeatAssignments } from "../controller/tournament";
import { playerController } from "../controller/player";
import { Round } from "../model/objects";
import StyledTableRow from "./StyledTableRow";

export default function Pairings({ round }: { round: Round }) {
  const seatings = getSeatAssignments(round);
  const players = playerController.getPlayers(round.players);
  players.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
            <TableCell>Player</TableCell>
            <TableCell>Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => {
            const seating = seatings.get(player.id)!;
            return (
              <StyledTableRow key={player.id}>
                <TableCell component="th" scope="row">
                  {seating.number}
                </TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{seating.team ?? "Bye"}</TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
