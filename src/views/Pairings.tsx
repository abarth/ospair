import * as React from "react";
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

export default function Pairings({ columnCount }: { columnCount: number }) {
  const { roundIndex, round } = useAppSelector(selectRound(useParams()));

  if (!round) {
    return <>{`Round ${roundIndex + 1} not found`}</>;
  }

  const headerCells = [];
  for (let i = 0; i < columnCount; i++) {
    headerCells.push(
      <React.Fragment>
        <TableCell align="right">Table</TableCell>
        <TableCell>Players</TableCell>
      </React.Fragment>,
    );
  }

  const rowCount = Math.ceil(round.tables.length / columnCount);

  const cells = round.tables.map((table) => {
    const isBye = table.teams.length === 1;
    return (
      <React.Fragment>
        <TableCell align="right">{isBye ? "Bye" : table.number}</TableCell>
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
      </React.Fragment>
    );
  });

  const rows = Array.from({ length: rowCount }, (_, index) => {
    const groups = [];
    for (let i = 0; i < columnCount; i++) {
      groups.push(cells[index + rowCount * i]);
    }
    return <StyledTableRow key={index}>{groups}</StyledTableRow>;
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>{headerCells}</TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
