import * as React from "react";
import Standings from "./Standings";
import Pairings from "./Pairings";
import PairingEditor from "./PairingEditor";
import ResultsEditor from "./ResultsEditor";
import {
  Box,
  MenuItem,
  Select,
  Stack,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { isCurrentRound, selectRound } from "../store/tournament-slice";

export default function RoundBody() {
  const [tabIndex, setTabIndex] = React.useState("1");
  const [pairingsMode, setPairingsMode] = React.useState<"view" | "edit">(
    "view",
  );
  const [columnCount, setColumnCount] = React.useState(1);
  const { tournament, roundIndex, round } = useAppSelector(
    selectRound(useParams()),
  );
  const editable = isCurrentRound(tournament, roundIndex);

  // Default to 2 columns for large rounds
  React.useEffect(() => {
    const tableCount = round?.tables.length ?? 0;
    setColumnCount(tableCount > 20 ? 2 : 1);
  }, [round?.tables.length]);

  return (
    <Box component="main">
      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={(event, newValue) => setTabIndex(newValue)}>
            <Tab label="Pairings" value="1" />
            <Tab label="Results" value="2" />
            <Tab label="Standings" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {pairingsMode === "edit" && editable ? (
            <PairingEditor />
          ) : (
            <Pairings columnCount={columnCount} />
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              {pairingsMode === "view" && (
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
              )}
            </Box>
            {editable && (
              <ToggleButtonGroup
                value={pairingsMode}
                exclusive
                onChange={(_, newMode) => {
                  if (newMode) setPairingsMode(newMode);
                }}
                size="small"
              >
                <ToggleButton value="view">View</ToggleButton>
                <ToggleButton value="edit">Edit</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <ResultsEditor />
        </TabPanel>
        <TabPanel value="3">
          <Standings />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
