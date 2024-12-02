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
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectTournament } from "../store/tournament-slice";
import { routeTo } from "../routes";
import TournamentListItems from "./TournamentListItems";
import RoundListItems from "./RoundListItems";

function TournamentDrawerSection() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <ListSubheader>{tournament.name}</ListSubheader>
      <ListItem disablePadding key="overview">
        <ListItemButton
          onClick={() => navigate(routeTo({ tournamentId: tournament.id }))}
        >
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItemButton>
      </ListItem>
      <RoundListItems />
    </React.Fragment>
  );
}

export default function DrawerContent({ onClose }: { onClose: () => void }) {
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
      <List>
        <ListItem disablePadding key="home">
          <ListItemButton onClick={() => navigate(routeTo({}))}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {tournamentId ? <TournamentDrawerSection /> : null}
        <TournamentListItems />
      </List>
    </Box>
  );
}
