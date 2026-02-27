import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  isCurrentRound,
  selectRound,
  swapPlayers,
} from "../store/tournament-slice";
import { selectPlayer } from "../store/player-slice";
import { PlayerId } from "../model/objects";

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

  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-start" }}
    >
      {round.tables.map((table) => {
        const isBye = table.teams.length === 1;
        return (
          <Card
            key={table.number}
            variant="outlined"
            sx={{ minWidth: 160 }}
            data-testid={isBye ? "bye-table" : `table-${table.number}`}
          >
            <CardContent sx={{ pb: "12px !important" }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {isBye ? "Bye" : `Table ${table.number}`}
              </Typography>
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
                          isEditable={isEditable}
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
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
