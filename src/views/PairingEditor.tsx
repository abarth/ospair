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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearTableResults,
  isCurrentRound,
  movePlayerToBye,
  moveTable,
  pairByePlayers,
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
  onDragOver: (e: React.DragEvent) => void;
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
              e.stopPropagation();
              onDragOver(e);
            }
          : undefined
      }
      onDrop={
        isEditable
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
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
  const [dropTargetByeZone, setDropTargetByeZone] = React.useState<
    number | null
  >(null);

  // Table-level drag state (for reordering)
  const [draggedTableIdx, setDraggedTableIdx] = React.useState<number | null>(
    null,
  );
  const [dropTargetTableIdx, setDropTargetTableIdx] = React.useState<
    number | null
  >(null);

  const [confirmClearTable, setConfirmClearTable] =
    React.useState<TableNumber | null>(null);

  if (!round) {
    return <>{`Round ${roundIndex + 1} not found`}</>;
  }

  const isEditable = isCurrentRound(tournament, roundIndex);

  // Build a map from playerId to tableIdx for quick lookup
  const playerTableIdx = new Map<PlayerId, number>();
  round.tables.forEach((table, idx) => {
    table.teams.forEach((team) => team.forEach((p) => playerTableIdx.set(p, idx)));
  });

  const isPlayerInBye = (player: PlayerId) => {
    const idx = playerTableIdx.get(player);
    if (idx === undefined) return false;
    return round.tables[idx].teams.length === 1;
  };

  // --- Player drag handlers ---

  const handleDragStart = (player: PlayerId) => {
    setDraggedPlayer(player);
    setDropTargetPlayer(null);
    setDropTargetByeZone(null);
    setDraggedTableIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
    setDropTargetPlayer(null);
    setDropTargetByeZone(null);
  };

  const handleDragOver = (player: PlayerId) => {
    if (player !== draggedPlayer) {
      setDropTargetPlayer(player);
      setDropTargetByeZone(null);
    }
  };

  const handleDrop = (targetPlayer: PlayerId) => {
    if (draggedPlayer && draggedPlayer !== targetPlayer) {
      if (isPlayerInBye(draggedPlayer) && isPlayerInBye(targetPlayer)) {
        dispatch(
          pairByePlayers({
            tournamentId: tournament.id,
            roundIndex,
            player1: draggedPlayer,
            player2: targetPlayer,
          }),
        );
      } else {
        dispatch(
          swapPlayers({
            tournamentId: tournament.id,
            roundIndex,
            player1: draggedPlayer,
            player2: targetPlayer,
          }),
        );
      }
    }
    setDraggedPlayer(null);
    setDropTargetPlayer(null);
    setDropTargetByeZone(null);
  };

  // --- Bye zone drag handlers ---

  const handleByeZoneDragOver = (tableIdx: number) => {
    setDropTargetByeZone(tableIdx);
    setDropTargetPlayer(null);
  };

  const handleByeZoneDrop = () => {
    if (draggedPlayer && dropTargetByeZone !== null) {
      dispatch(
        movePlayerToBye({
          tournamentId: tournament.id,
          roundIndex,
          player: draggedPlayer,
        }),
      );
    }
    setDraggedPlayer(null);
    setDropTargetPlayer(null);
    setDropTargetByeZone(null);
  };

  // --- Table drag handlers (reordering) ---

  const handleTableDragStart = (tableIdx: number) => {
    setDraggedTableIdx(tableIdx);
    setDropTargetTableIdx(null);
    setDraggedPlayer(null);
  };

  const handleTableDragEnd = () => {
    setDraggedTableIdx(null);
    setDropTargetTableIdx(null);
  };

  const handleTableCardDragOver = (
    e: React.DragEvent,
    tableIdx: number,
  ) => {
    if (draggedTableIdx !== null) {
      e.preventDefault();
      setDropTargetTableIdx(tableIdx);
    }
  };

  const handleTableCardDragLeave = (
    e: React.DragEvent,
    tableIdx: number,
  ) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (dropTargetTableIdx === tableIdx) setDropTargetTableIdx(null);
    }
  };

  const handleTableCardDrop = (e: React.DragEvent, toIdx: number) => {
    if (draggedTableIdx !== null && draggedTableIdx !== toIdx) {
      e.preventDefault();
      dispatch(
        moveTable({
          tournamentId: tournament.id,
          roundIndex,
          fromIndex: draggedTableIdx,
          toIndex: toIdx,
        }),
      );
    }
    setDraggedTableIdx(null);
    setDropTargetTableIdx(null);
  };

  // --- Results handlers ---

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

  const isDraggingPlayer = draggedPlayer !== null;
  const isDraggingTable = draggedTableIdx !== null;

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        Drag players to swap seats. Drop a player onto a bye's chip to swap, or
        onto the "Give bye" zone to move them to a bye. Drag two bye players
        together to pair them. Use the grip handle to reorder tables. Tables
        with results are locked — clear results first to edit pairings.
      </Alert>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {round.tables.map((table, tableIdx) => {
          const isBye = table.teams.length === 1;
          const isLocked = isEditable && !isBye && tableHasResults(table);
          const isTableDragging = draggedTableIdx === tableIdx;
          const isTableDropTarget =
            isDraggingTable && dropTargetTableIdx === tableIdx;

          // Show bye drop zone when a non-bye player is being dragged and this is a bye card
          const showByeZone =
            isEditable &&
            isDraggingPlayer &&
            isBye &&
            !isPlayerInBye(draggedPlayer!);

          return (
            <Card
              key={table.number}
              variant="outlined"
              onDragOver={(e) => handleTableCardDragOver(e, tableIdx)}
              onDragLeave={(e) => handleTableCardDragLeave(e, tableIdx)}
              onDrop={(e) => handleTableCardDrop(e, tableIdx)}
              sx={{
                width: 240,
                borderColor: isTableDropTarget
                  ? "primary.main"
                  : isLocked
                    ? "success.main"
                    : undefined,
                borderWidth: isTableDropTarget || isLocked ? 2 : 1,
                borderStyle: isTableDropTarget ? "dashed" : "solid",
                opacity: isTableDragging ? 0.4 : 1,
                transition: "opacity 0.15s, border-color 0.15s",
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
                  {isEditable && (
                    <Box
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.stopPropagation();
                        handleTableDragStart(tableIdx);
                      }}
                      onDragEnd={handleTableDragEnd}
                      sx={{
                        cursor: "grab",
                        display: "flex",
                        alignItems: "center",
                        color: "text.disabled",
                        "&:hover": { color: "text.secondary" },
                      }}
                    >
                      <DragIndicatorIcon sx={{ fontSize: 16 }} />
                    </Box>
                  )}
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
                {showByeZone && (
                  <Box
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleByeZoneDragOver(tableIdx);
                    }}
                    onDragLeave={() => {
                      if (dropTargetByeZone === tableIdx)
                        setDropTargetByeZone(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleByeZoneDrop();
                    }}
                    sx={{
                      mt: 1,
                      border: "2px dashed",
                      borderColor:
                        dropTargetByeZone === tableIdx
                          ? "primary.main"
                          : "grey.400",
                      borderRadius: 1,
                      p: 0.5,
                      textAlign: "center",
                      backgroundColor:
                        dropTargetByeZone === tableIdx
                          ? "action.selected"
                          : undefined,
                      transition: "border-color 0.1s, background-color 0.1s",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Give bye
                    </Typography>
                  </Box>
                )}
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
