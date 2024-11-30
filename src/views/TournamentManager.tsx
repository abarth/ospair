import * as React from "react";
import { Tournament } from "../model/objects";
import Standings from "./Standings";
import Pairings from "./Pairings";
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
  const [value, setValue] = React.useState(1);

  if (!hasCurrentRound(tournament)) {
    return (
      <Lobby
        tournament={tournament}
        onTournamentUpdated={onTournamentUpdated}
      />
    );
  }

  const round = getCurrentRound(tournament);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Standings" value="1" />
            <Tab label="Pairings" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Standings round={round} />
        </TabPanel>
        <TabPanel value="2">
          <Pairings round={round} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
