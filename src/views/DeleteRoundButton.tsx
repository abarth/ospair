import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteCurrentRound,
  isCurrentRound,
  selectRound,
} from "../store/tournament-slice";
import { useNavigate, useParams } from "react-router";
import { routeTo } from "../routes";

export default function DeleteTournamentButton() {
  const [open, setOpen] = React.useState(false);
  const { tournament, roundIndex } = useAppSelector(selectRound(useParams()));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleDelete() {
    dispatch(deleteCurrentRound(tournament.id));
    setOpen(false);
    if (roundIndex === 0) {
      navigate(routeTo({ tournamentId: tournament.id }));
    } else {
      navigate(
        routeTo({
          tournamentId: tournament.id,
          roundIndex: roundIndex - 1,
        }),
      );
    }
  }

  return (
    <React.Fragment>
      <IconButton
        color="inherit"
        aria-label="delete round"
        disabled={roundIndex === -1 || !isCurrentRound(tournament, roundIndex)}
        onClick={handleOpen}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Round {roundIndex + 1}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete round {roundIndex + 1}? This action
            cannot be undone.
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
