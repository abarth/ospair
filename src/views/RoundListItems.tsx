import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectTournament } from "../store/tournament-slice";
import { routeTo, RouteDescriptor } from "../routes";

export default function RoundListItems() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const navigate = useNavigate();

  function go(location: RouteDescriptor) {
    navigate(routeTo(location));
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
