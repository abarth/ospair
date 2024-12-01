import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import StyledTableRow from "./StyledTableRow";
import { useAppSelector } from "../store/hooks";
import { selectPlayers } from "../store/player-slice";
import { useParams } from "react-router";
import { selectRound } from "../store/tournament-slice";

export default function Standings() {
  const { round } = useAppSelector(selectRound(useParams()));
  const players = useAppSelector(selectPlayers(round.players));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Player</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">OWP</TableCell>
            <TableCell align="right">GWP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, index) => (
            <StyledTableRow key={player.id}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell align="right">0</TableCell>
              <TableCell align="right">50%</TableCell>
              <TableCell align="right">50%</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
