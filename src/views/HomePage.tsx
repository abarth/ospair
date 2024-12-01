import { nanoid } from "nanoid";
import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { createTournament } from "../store/tournament-slice";
import { useNavigate } from "react-router";
import { routeTo } from "../routes";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Old School Tournament Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const tournamentId = nanoid();
            dispatch(createTournament({ tournamentId }));
            navigate(routeTo({ tournamentId: tournamentId }));
          }}
        >
          Create Tournament
        </Button>
      </Box>
    </Stack>
  );
}
