import * as React from "react";
import Standings from "./Standings";
import Pairings from "./Pairings";
import ResultsEditor from "./ResultsEditor";
import {
  AppBar,
  Box,
  Button,
  Stack,
  Tab,
  Toolbar,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectRound, createNextRound } from "../store/tournament-slice";
import { routeTo } from "../routes";

export default function RoundPage() {
  const [tabIndex, setTabIndex] = React.useState("1");
  const { tournament, roundIndex } = useAppSelector(selectRound(useParams()));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const actions = (
    <Stack direction="row" spacing={2}>
      <Button
        color="inherit"
        onClick={() => {
          dispatch(createNextRound(tournament.id));
          navigate(
            routeTo({
              tournamentId: tournament.id,
              roundIndex: roundIndex + 1,
            }),
          );
        }}
      >
        Next Round
      </Button>
    </Stack>
  );

  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {tournament.name}: Round {roundIndex + 1}
          </Typography>
          {actions}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
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
    </Stack>
  );
}
