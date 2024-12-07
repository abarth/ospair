import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectPlayers } from "../store/player-slice";
import { getSeatAssignments, selectRound } from "../store/tournament-slice";
import StyledTableRow from "./StyledTableRow";

export default function Pairings() {
  const { round } = useAppSelector(selectRound(useParams()));
  const players = Array.from(
    useAppSelector(selectPlayers(round.players)).values(),
  );

  players.sort((a, b) => a.name.localeCompare(b.name));
  const seatings = getSeatAssignments(round);

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
