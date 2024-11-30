import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Round } from "../model/objects";
import { playerController } from "../controller/player";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
              <StyledTableRow
                key={player}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
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
