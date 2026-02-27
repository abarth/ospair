import * as React from "react";
import Standings from "./Standings";
import Pairings from "./Pairings";
import PairingEditor from "./PairingEditor";
import ResultsEditor from "./ResultsEditor";
import { Box, Tab, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { isCurrentRound, selectRound } from "../store/tournament-slice";

export default function RoundBody() {
  const [tabIndex, setTabIndex] = React.useState("1");
  const [pairingsMode, setPairingsMode] = React.useState<"view" | "edit">(
    "view",
  );
  const { tournament, roundIndex } = useAppSelector(selectRound(useParams()));
  const editable = isCurrentRound(tournament, roundIndex);

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
          {editable && (
            <Box sx={{ mb: 2 }}>
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
            </Box>
          )}
          {pairingsMode === "edit" && editable ? (
            <PairingEditor />
          ) : (
            <Pairings />
          )}
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
