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
  const { round } = useAppSelector(selectRound(useParams()));
  const players = sortedPlayers(
    useAppSelector(selectPlayers(round.players)),
  ).map((player) => player.id);
  const seatings = getSeatAssignments(round);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Table</TableCell>
            <TableCell>Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => {
            const seating = seatings.get(player)!;
            return (
              <StyledTableRow key={player}>
                <TableCell>{seating.tableNumber}</TableCell>
                <TableCell>
                  <TeamRoster team={seating.allies} lead={player} />
                  {seating.opposingTeams.length > 0 ? (
                    seating.opposingTeams.map((opposingTeam, index) => (
                      <>
                        {" "}
                        <i>{"vs"}</i>{" "}
                        {seating.opposingTeams.map((opposingTeam, index) => (
                          <TeamRoster key={index} team={opposingTeam} />
                        ))}
                      </>
                    ))
                  ) : (
                    <>
                      {" "}
                      <i>(Bye)</i>
                    </>
                  )}
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
