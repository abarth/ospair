import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectTournament } from "../store/tournament-slice";
import { routeTo, RouteDescriptor } from "../routes";

function TournamentDrawerSection({ onClose }: { onClose: () => void }) {
  const tournament = useAppSelector(selectTournament(useParams()));
  const navigate = useNavigate();

  function go(location: RouteDescriptor) {
    navigate(routeTo(location));
    onClose();
  }

  return (
    <React.Fragment>
      <ListSubheader>{tournament.name}</ListSubheader>
      {tournament.rounds.map((round, roundIndex) => (
        <ListItem disablePadding key={`round-${roundIndex}`}>
          <ListItemButton
            onClick={() =>
              go({
                tournamentId: tournament.id,
                roundIndex: roundIndex,
              })
            }
          >
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary={`Round ${roundIndex + 1}`} />
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem disablePadding key="settings">
        <ListItemButton onClick={() => go({ tournamentId: tournament.id })}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </ListItem>
    </React.Fragment>
  );
}

export default function DrawerContent({ onClose }: { onClose: () => void }) {
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  function go(location: RouteDescriptor) {
    navigate(routeTo(location));
    onClose();
  }

  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem disablePadding key="Home">
          <ListItemButton onClick={() => go({})}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {tournamentId ? <TournamentDrawerSection onClose={onClose} /> : null}
      </List>
    </Box>
  );
}
