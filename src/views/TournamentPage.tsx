import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  List,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectTournament,
  hasStarted,
  hasRegisteredPlayers,
  createNextRound,
} from "../store/tournament-slice";
import { routeTo } from "../routes";
import DrawerButton from "./DrawerButton";
import PlayerRegistration from "./PlayerRegistration";
import TournamentSettings from "./TournamentSettings";
import RoundListItems from "./RoundListItems";

export default function TournamentPage() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const canStartTournament =
    hasRegisteredPlayers(tournament) && !hasStarted(tournament);

  function handleStartTournament() {
    dispatch(createNextRound(tournament.id));
    navigate(
      routeTo({
        tournamentId: tournament.id,
        roundIndex: 0,
      }),
    );
  }

  let trailingContent;
  if (hasStarted(tournament)) {
    trailingContent = (
      <Card sx={{ width: 600 }}>
        <CardContent>
          <Typography variant="h6">Rounds</Typography>
          <List>
            <RoundListItems />
          </List>
        </CardContent>
      </Card>
    );
  } else {
    trailingContent = (
      <Box sx={{ width: 600 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            disabled={!canStartTournament}
            onClick={handleStartTournament}
          >
            Start Tournament
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <DrawerButton />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {tournament.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Card sx={{ width: 600 }}>
            <CardContent>
              <TournamentSettings />
            </CardContent>
          </Card>
          <Card sx={{ width: 600 }}>
            <CardContent>
              <PlayerRegistration />
            </CardContent>
          </Card>
          {trailingContent}
        </Stack>
      </Box>
    </Stack>
  );
}
