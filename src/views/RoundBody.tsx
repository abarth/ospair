import * as React from "react";
import Standings from "./Standings";
import Pairings from "./Pairings";
import PairingEditor from "./PairingEditor";
import ResultsEditor from "./ResultsEditor";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { isCurrentRound, selectRound } from "../store/tournament-slice";

export default function RoundBody() {
  const [tabIndex, setTabIndex] = React.useState("1");
  const { tournament, roundIndex } = useAppSelector(selectRound(useParams()));
  const editable = isCurrentRound(tournament, roundIndex);

  return (
    <Box component="main">
      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={(event, newValue) => setTabIndex(newValue)}>
            <Tab label="Pairings" value="1" />
            {editable && <Tab label="Edit Pairings" value="4" />}
            <Tab label="Results" value="2" />
            <Tab label="Standings" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Pairings />
        </TabPanel>
        <TabPanel value="4">
          <PairingEditor />
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
