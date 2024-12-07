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
import { sortedPlayers } from "../model/player";
import { useAppSelector } from "../store/hooks";
import { selectPlayers } from "../store/player-slice";
import { getSeatAssignments, selectRound } from "../store/tournament-slice";
import StyledTableRow from "./StyledTableRow";
import TeamRoster from "./TeamRoster";

export default function Pairings() {
  const { roundIndex, round } = useAppSelector(selectRound(useParams()));
  const players = sortedPlayers(
    useAppSelector(selectPlayers(round?.players ?? [])),
  ).map((player) => player.id);
  if (!round) {
    return <>{`Round ${roundIndex + 1} not found`}</>;
  }
  const seatings = getSeatAssignments(round);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Table</TableCell>
            <TableCell>Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => {
            const seating = seatings.get(player)!;
            const isBye = seating.opposingTeams.length === 0;
            return (
              <StyledTableRow key={player}>
                <TableCell align="right">
                  {isBye ? "Bye" : seating.tableNumber}
                </TableCell>
                <TableCell>
                  <TeamRoster team={seating.allies} lead={player} />
                  {isBye
                    ? null
                    : seating.opposingTeams.map((opposingTeam, index) => (
                        <>
                          {" "}
                          <i>{"vs"}</i>{" "}
                          <TeamRoster key={index} team={opposingTeam} />
                        </>
                      ))}
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
