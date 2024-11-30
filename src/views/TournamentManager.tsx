import * as React from "react";
import { Tournament } from "../model/objects";
import Standings from "./Standings";
import Pairings from "./Pairings";
import ResultsEditor from "./ResultsEditor";
import { hasCurrentRound, getCurrentRound } from "../controller/tournament";
import Lobby from "./Lobby";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function TournamentManager({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  const [value, setValue] = React.useState("1");

  if (!hasCurrentRound(tournament)) {
    return (
      <Box component="main" sx={{ p: 3 }}>
        <Lobby
          tournament={tournament}
          onTournamentUpdated={onTournamentUpdated}
        />
      </Box>
    );
  }

  const round = getCurrentRound(tournament);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label="Standings" value="1" />
            <Tab label="Pairings" value="2" />
            <Tab label="Results" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Standings round={round} />
        </TabPanel>
        <TabPanel value="2">
          <Pairings round={round} />
        </TabPanel>
        <TabPanel value="3">
          <ResultsEditor
            tournament={tournament}
            onTournamentUpdated={onTournamentUpdated}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
