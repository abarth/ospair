import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import {
  unregisterPlayer,
  hasRegisteredPlayers,
  selectTournament,
} from "../store/tournament-slice";
import PlayerImporter from "./PlayerImporter";
import PlayerChip from "./PlayerChip";
import TournamentSettings from "./TournamentSettings";
import RegisterPlayerButton from "./RegisterPlayerButton";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Lobby() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const dispatch = useAppDispatch();

  let players;
  if (hasRegisteredPlayers(tournament)) {
    players = tournament.players.map((player) => (
      <PlayerChip
        key={player}
        player={player}
        onDelete={() =>
          dispatch(unregisterPlayer({ tournamentId: tournament.id, player }))
        }
      />
    ));
  } else {
    players = <Typography>No players</Typography>;
  }
  return (
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
          <Container>
            <PlayerImporter />
          </Container>
        </CardContent>
      </Card>
      <Card sx={{ width: 600 }}>
        <CardContent>
          <Stack>
            <Typography variant="h6">Players</Typography>
            <Box sx={{ py: 2 }}>
              <Stack
                direction="row"
                useFlexGap
                spacing={1}
                sx={{ flexWrap: "wrap" }}
              >
                {players}
              </Stack>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <RegisterPlayerButton />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
