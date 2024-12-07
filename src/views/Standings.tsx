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
import { getTournamentHistoryForRound } from "../model/tournament";

export default function Standings() {
  const { tournament, roundIndex, round } = useAppSelector(
    selectRound(useParams()),
  );
  const players = getPlayerMap(
    useAppSelector(selectPlayers(tournament.players)),
  );
  if (!round) {
    return <>{`Round ${roundIndex + 1} not found`}</>;
  }
  const history = getTournamentHistoryForRound(tournament, roundIndex - 1);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Rank</TableCell>
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
                <TableCell align="right" component="th" scope="row">
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
