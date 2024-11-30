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
import { Round } from "../model/objects";
import { playerController } from "../controller/player";

export default function Standings({ round }: { round: Round }) {
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
          {round.players.map((player, index) => {
            const playerModel = playerController.getPlayer(player);

            return (
              <StyledTableRow key={player}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{playerModel.name}</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">50%</TableCell>
                <TableCell align="right">50%</TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
