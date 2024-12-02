import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectRound,
  createNextRound,
  isCurrentRound,
} from "../store/tournament-slice";
import { routeTo } from "../routes";
import RoundBody from "./RoundBody";
import DrawerButton from "./DrawerButton";
import RoundSelector from "./RoundSelector";

export default function RoundPage() {
  const { tournament, roundIndex } = useAppSelector(selectRound(useParams()));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const actions = (
    <Stack direction="row" spacing={2}>
      <Button
        color="inherit"
        disabled={!isCurrentRound(tournament, roundIndex)}
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
        Create Next Round
      </Button>
    </Stack>
  );

  return (
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <DrawerButton />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {tournament.name}: Round {roundIndex + 1}
          </Typography>
          <RoundSelector />
          {actions}
        </Toolbar>
      </AppBar>
      <RoundBody key={roundIndex} />
    </Stack>
  );
}
