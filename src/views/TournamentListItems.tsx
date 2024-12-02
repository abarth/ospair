import React from "react";
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { useAppSelector } from "../store/hooks";
import { selectAllTournaments } from "../store/tournament-slice";
import { routeTo } from "../routes";
import { useNavigate } from "react-router";

export default function TournamentListItems() {
  const tournaments = useAppSelector(selectAllTournaments);
  const navigate = useNavigate();

  if (tournaments.length === 0) {
    return (
      <React.Fragment>
        <ListSubheader>No Tournaments</ListSubheader>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ListSubheader>Tournaments</ListSubheader>
      {tournaments.map((tournament) => {
        const playerCount = tournament.players.length;
        const roundCount = tournament.rounds.length;
        const description = `${playerCount} players, ${roundCount} rounds`;
        return (
          <ListItemButton
            onClick={() => {
              navigate(routeTo({ tournamentId: tournament.id }));
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <WorkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={tournament.name} secondary={description} />
          </ListItemButton>
        );
      })}
    </React.Fragment>
  );
}
