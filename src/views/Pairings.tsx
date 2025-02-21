import * as React from "react";
import {
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectRound, setMatchWins } from "../store/tournament-slice";
import StyledTableRow from "./StyledTableRow";
import TeamRoster from "./TeamRoster";
import { table } from "console";

export default function Pairings() {
  const { roundIndex, round } = useAppSelector(selectRound(useParams()));
  const [columnCount, setColumnCount] = React.useState(1);

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
    <Stack spacing={2} justifyContent="flex-end">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>{headerCells}</TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>Columns:</Typography>
        <Select
          variant="outlined"
          size="small"
          autoWidth
          value={columnCount}
          onChange={(event) => {
            setColumnCount(event.target.value as number);
          }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
}
