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
import { selectRound } from "../store/tournament-slice";
import StyledTableRow from "./StyledTableRow";
import TeamRoster from "./TeamRoster";

export default function Pairings() {
  const { roundIndex, round } = useAppSelector(selectRound(useParams()));
  if (!round) {
    return <>{`Round ${roundIndex + 1} not found`}</>;
  }

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
          {round.tables.map((table) => {
            const isBye = table.teams.length === 1;
            return (
              <StyledTableRow key={table.number}>
                <TableCell align="right">
                  {isBye ? "Bye" : table.number}
                </TableCell>
                <TableCell>
                  {table.teams.map((team, index) => {
                    if (index > 0) {
                      return (
                        <>
                          {" "}
                          <i>{"vs"}</i> <TeamRoster key={index} team={team} />
                        </>
                      );
                    } else {
                      return <TeamRoster key={index} team={team} />;
                    }
                  })}
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
