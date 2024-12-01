import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import Lobby from "./Lobby";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectTournament,
  hasCurrentRound,
  hasRegisteredPlayers,
  createNextRound,
} from "../store/tournament-slice";
import { routeTo } from "../routes";

export default function TournamentPage() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const actions = (
    <Stack direction="row" spacing={2}>
      <Button
        color="inherit"
        disabled={
          !hasRegisteredPlayers(tournament) || hasCurrentRound(tournament)
        }
        onClick={() => {
          dispatch(createNextRound(tournament.id));
          navigate(
            routeTo({
              tournamentId: tournament.id,
              roundIndex: 0,
            }),
          );
        }}
      >
        Start
      </Button>
    </Stack>
  );

  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {tournament.name}: Lobby
          </Typography>
          {actions}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Lobby />
      </Box>
    </Stack>
  );
}
