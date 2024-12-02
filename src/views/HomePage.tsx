import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import DrawerButton from "./DrawerButton";
import CreateTournamentButton from "./CreateTournamentButton";

export default function HomePage() {
  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <DrawerButton />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Old School Tournament Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <CreateTournamentButton />
      </Box>
    </Stack>
  );
}
