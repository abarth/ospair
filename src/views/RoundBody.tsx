import * as React from "react";
import Standings from "./Standings";
import Pairings from "./Pairings";
import ResultsEditor from "./ResultsEditor";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function RoundBody() {
  const [tabIndex, setTabIndex] = React.useState("1");
  return (
    <Box component="main">
      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={(event, newValue) => setTabIndex(newValue)}>
            <Tab label="Standings" value="1" />
            <Tab label="Pairings" value="2" />
            <Tab label="Results" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Standings />
        </TabPanel>
        <TabPanel value="2">
          <Pairings />
        </TabPanel>
        <TabPanel value="3">
          <ResultsEditor />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
