import { AppBar, List, Stack, Toolbar, Typography } from "@mui/material";
import DrawerButton from "./DrawerButton";
import CreateTournamentButton from "./CreateTournamentButton";
import TournamentListItems from "./TournamentListItems";

export default function HomePage() {
  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <DrawerButton />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tournament Manager
          </Typography>
          <CreateTournamentButton />
        </Toolbar>
      </AppBar>
      <List>
        <TournamentListItems />
      </List>
    </Stack>
  );
}
