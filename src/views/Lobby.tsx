import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { PlayerId, Tournament } from "../model/objects";
import {
  registerPlayers,
  unregisterPlayer,
  hasRegisteredPlayers,
} from "../controller/tournament";
import PlayerImporter from "./PlayerImporter";
import PlayerChip from "./PlayerChip";
import TournamentSettings from "./TournamentSettings";
import RegisterPlayerButton from "./RegisterPlayerButton";

export default function Lobby({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  function handlePlayersImported(players: PlayerId[]) {
    onTournamentUpdated(registerPlayers(tournament, players));
  }
  let players;
  if (hasRegisteredPlayers(tournament)) {
    players = tournament.players.map((player) => (
      <PlayerChip
        key={player}
        player={player}
        onDelete={() =>
          onTournamentUpdated(unregisterPlayer(tournament, player))
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
          <TournamentSettings
            tournament={tournament}
            onTournamentUpdated={onTournamentUpdated}
          />
        </CardContent>
      </Card>
      <Card sx={{ width: 600 }}>
        <CardContent>
          <Container>
            <PlayerImporter onPlayersImported={handlePlayersImported} />
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
              <RegisterPlayerButton
                tournament={tournament}
                onTournamentUpdated={onTournamentUpdated}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
