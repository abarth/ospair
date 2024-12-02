import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteTournament, selectTournament } from "../store/tournament-slice";
import { useNavigate, useParams } from "react-router";
import { routeTo } from "../routes";

export default function DeleteTournamentButton() {
  const [open, setOpen] = React.useState(false);
  const tournament = useAppSelector(selectTournament(useParams()));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleDelete() {
    dispatch(deleteTournament(tournament.id));
    navigate(routeTo({}));
  }

  return (
    <React.Fragment>
      <Button color="inherit" onClick={handleOpen}>
        Delete Tournament
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Tournament?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tournament? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
