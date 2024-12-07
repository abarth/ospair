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
import { getPlayerMap, selectPlayers } from "../store/player-slice";
import { useParams } from "react-router";
import { selectRound } from "../store/tournament-slice";
import { getTournamentHistoryBeforeRound } from "../model/tournament";

export default function Standings() {
  const { tournament, roundIndex, round } = useAppSelector(
    selectRound(useParams()),
  );
  const players = getPlayerMap(useAppSelector(selectPlayers(round.players)));
  const history = getTournamentHistoryBeforeRound(tournament, roundIndex);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Player</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">OMWP</TableCell>
            <TableCell align="right">PGWP</TableCell>
            <TableCell align="right">OGWP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.standings.map((player, index) => {
            const playerModel = players.get(player)!;
            const playerHistory = history.playerHistory.get(player)!;
            return (
              <StyledTableRow key={playerModel.id}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{playerModel.name}</TableCell>
                <TableCell align="right">{playerHistory.matchPoints}</TableCell>
                <TableCell align="right">
                  {playerHistory.opponentMatchWinPercentage.toFixed(2)}%
                </TableCell>
                <TableCell align="right">
                  {playerHistory.gameWinPercentage.toFixed(2)}%
                </TableCell>
                <TableCell align="right">
                  {playerHistory.opponentGameWinPercentage.toFixed(2)}%
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
