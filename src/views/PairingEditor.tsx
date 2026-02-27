import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearTableResults,
  isCurrentRound,
  selectRound,
  swapPlayers,
  tableHasResults,
} from "../store/tournament-slice";
import { selectPlayer } from "../store/player-slice";
import { PlayerId, TableNumber } from "../model/objects";

function DraggablePlayerChip({
  player,
  isEditable,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  player: PlayerId;
  isEditable: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: () => void;
  onDrop: () => void;
}) {
  const playerModel = useAppSelector(selectPlayer(player));
  return (
    <Chip
      label={playerModel.name}
      variant="outlined"
      draggable={isEditable ? true : undefined}
      onDragStart={
        isEditable
          ? (e) => {
              e.dataTransfer.effectAllowed = "move";
              onDragStart();
            }
          : undefined
      }
      onDragEnd={isEditable ? onDragEnd : undefined}
      onDragOver={
        isEditable
          ? (e) => {
              e.preventDefault();
              onDragOver();
            }
          : undefined
      }
      onDrop={
        isEditable
          ? (e) => {
              e.preventDefault();
              onDrop();
            }
          : undefined
      }
      sx={{
        maxWidth: 200,
        "& .MuiChip-label": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        opacity: isDragging ? 0.4 : 1,
        cursor: isEditable ? "grab" : "default",
        borderStyle: isDropTarget ? "dashed" : "solid",
        borderWidth: isDropTarget ? 2 : 1,
        backgroundColor: isDropTarget ? "action.selected" : undefined,
        transition: "opacity 0.15s, background-color 0.15s",
      }}
    />
  );
}

export default function PairingEditor() {
  const { tournament, roundIndex, round } = useAppSelector(
    selectRound(useParams()),
  );
  const dispatch = useAppDispatch();

  const [draggedPlayer, setDraggedPlayer] = React.useState<PlayerId | null>(
    null,
  );
  const [dropTargetPlayer, setDropTargetPlayer] =
    React.useState<PlayerId | null>(null);
  const [confirmClearTable, setConfirmClearTable] =
    React.useState<TableNumber | null>(null);

  if (!round) {
    return <>{`Round ${roundIndex + 1} not found`}</>;
  }

  const isEditable = isCurrentRound(tournament, roundIndex);

  const handleDragStart = (player: PlayerId) => {
    setDraggedPlayer(player);
    setDropTargetPlayer(null);
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
    setDropTargetPlayer(null);
  };

  const handleDragOver = (player: PlayerId) => {
    if (player !== draggedPlayer) {
      setDropTargetPlayer(player);
    }
  };

  const handleDrop = (targetPlayer: PlayerId) => {
    if (draggedPlayer && draggedPlayer !== targetPlayer) {
      dispatch(
        swapPlayers({
          tournamentId: tournament.id,
          roundIndex,
          player1: draggedPlayer,
          player2: targetPlayer,
        }),
      );
    }
    setDraggedPlayer(null);
    setDropTargetPlayer(null);
  };

  const handleClearResults = (tableNumber: TableNumber) => {
    dispatch(
      clearTableResults({
        tournamentId: tournament.id,
        roundIndex,
        tableNumber,
      }),
    );
    setConfirmClearTable(null);
  };

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        Drag players from one table to another to swap their seats. Tables
        where results have already been reported are locked — clear their
        results first to make changes.
      </Alert>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-start" }}
      >
        {round.tables.map((table) => {
          const isBye = table.teams.length === 1;
          const isLocked = isEditable && !isBye && tableHasResults(table);
          return (
            <Card
              key={table.number}
              variant="outlined"
              sx={{
                width: 240,
                borderColor: isLocked ? "success.main" : undefined,
                borderWidth: isLocked ? 2 : 1,
              }}
              data-testid={isBye ? "bye-table" : `table-${table.number}`}
            >
              <CardContent sx={{ pb: "12px !important" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ mb: 0.5 }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {isBye ? "Bye" : `Table ${table.number}`}
                  </Typography>
                  {isLocked && (
                    <LockOutlinedIcon
                      sx={{ color: "success.main", fontSize: 14 }}
                    />
                  )}
                </Stack>
                {isLocked && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    Results reported
                  </Typography>
                )}
                <Stack spacing={1}>
                  {table.teams.map((team, teamIndex) => (
                    <React.Fragment key={teamIndex}>
                      {teamIndex > 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          align="center"
                          display="block"
                        >
                          vs
                        </Typography>
                      )}
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {team.map((player) => (
                          <DraggablePlayerChip
                            key={player}
                            player={player}
                            isEditable={isEditable && !isLocked}
                            isDragging={draggedPlayer === player}
                            isDropTarget={dropTargetPlayer === player}
                            onDragStart={() => handleDragStart(player)}
                            onDragEnd={handleDragEnd}
                            onDragOver={() => handleDragOver(player)}
                            onDrop={() => handleDrop(player)}
                          />
                        ))}
                      </Stack>
                    </React.Fragment>
                  ))}
                </Stack>
                {isLocked && (
                  <Button
                    size="small"
                    color="warning"
                    sx={{ mt: 1 }}
                    onClick={() => setConfirmClearTable(table.number)}
                  >
                    Clear Results
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <Dialog
        open={confirmClearTable !== null}
        onClose={() => setConfirmClearTable(null)}
      >
        <DialogTitle>Clear Results</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear the results for Table{" "}
            {confirmClearTable}? This will allow the pairings to be edited
            again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearTable(null)}>Cancel</Button>
          <Button
            onClick={() => handleClearResults(confirmClearTable!)}
            color="warning"
            variant="contained"
          >
            Clear Results
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
