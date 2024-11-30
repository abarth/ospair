import * as React from "react";
import { Tournament } from "./model/objects";
import {
  createTournament,
  startRound,
  hasActivePlayers,
  hasCurrentRound,
  hasRegisteredPlayers,
} from "./controller/tournament";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import TournamentManager from "./views/TournamentManager";

function App() {
  const [tournament, setTournament] =
    React.useState<Tournament>(createTournament);

  let actions;
  if (hasCurrentRound(tournament)) {
    actions = (
      <Stack direction="row" spacing={2}>
        <Button
          color="inherit"
          disabled={!hasActivePlayers(tournament)}
          onClick={() => setTournament(startRound(tournament))}
        >
          Next Round
        </Button>
      </Stack>
    );
  } else {
    actions = (
      <Stack direction="row" spacing={2}>
        <Button
          color="inherit"
          disabled={!hasRegisteredPlayers(tournament)}
          onClick={() => setTournament(startRound(tournament))}
        >
          Start
        </Button>
      </Stack>
    );
  }

  let title;
  if (hasCurrentRound(tournament)) {
    title = `Round ${tournament.rounds.length}`;
  } else {
    title = "Lobby";
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Stack>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {tournament.name}: {title}
            </Typography>
            {actions}
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>
          <TournamentManager
            tournament={tournament}
            onTournamentUpdated={setTournament}
          />
        </Box>
      </Stack>
    </React.Fragment>
  );
}

export default App;
