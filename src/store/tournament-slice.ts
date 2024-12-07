import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Tournament,
  TournamentId,
  PlayerId,
  Round,
  RoundIndex,
  TableNumber,
  Seating,
  teamNames,
  MatchFormat,
  Table,
} from "../model/objects";
import { createRound } from "../model/round";
import type { RootState } from "./index";

interface TournamentState {
  registry: any;
}

const initialState: TournamentState = {
  registry: {},
};

function getTournament(
  state: TournamentState,
  tournamentId: TournamentId,
): Tournament {
  return state.registry[tournamentId]!;
}

function getTable(
  state: TournamentState,
  tournamentId: TournamentId,
  roundIndex: RoundIndex,
  tableNumber: TableNumber,
): Table {
  const tournament = getTournament(state, tournamentId);
  const round = tournament.rounds[roundIndex];
  const table = round.tables.find((table) => table.number === tableNumber);
  if (!table) {
    throw new Error("Table not found");
  }
  return table;
}

export const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    createTournament: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        name: string;
        matchFormat?: MatchFormat;
      }>,
    ) => {
      const tournament = {
        id: action.payload.tournamentId,
        name: action.payload.name,
        matchFormat: action.payload.matchFormat ?? MatchFormat.SinglePlayer,
        players: [],
        rounds: [],
      };
      state.registry[tournament.id] = tournament;
    },
    deleteTournament: (state, action: PayloadAction<TournamentId>) => {
      const tournament = getTournament(state, action.payload);
      tournament.deleted = true;
    },
    undeleteTournament: (state, action: PayloadAction<TournamentId>) => {
      const tournament = getTournament(state, action.payload);
      delete tournament.deleted;
    },
    registerPlayer: (
      state,
      action: PayloadAction<{ tournamentId: TournamentId; player: PlayerId }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      tournament.players.push(action.payload.player);
    },
    registerPlayers: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        players: PlayerId[];
      }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      tournament.players.push(...action.payload.players);
    },
    unregisterPlayer: (
      state,
      action: PayloadAction<{ tournamentId: TournamentId; player: PlayerId }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      tournament.players = tournament.players.filter(
        (player) => player !== action.payload.player,
      );
    },
    setTournamentName: (
      state,
      action: PayloadAction<{ tournamentId: TournamentId; name: string }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      tournament.name = action.payload.name;
    },
    setMatchFormat: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        matchFormat: MatchFormat;
      }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      tournament.matchFormat = action.payload.matchFormat;
    },
    createNextRound: (state, action: PayloadAction<TournamentId>) => {
      const tournament = getTournament(state, action.payload);
      const roundIndex = tournament.rounds.length;
      let round = createRound(tournament, roundIndex);
      tournament.rounds.push(round);
    },
    setMatchWins: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        roundIndex: RoundIndex;
        tableNumber: TableNumber;
        teamIndex: number;
        wins: number;
      }>,
    ) => {
      const table = getTable(
        state,
        action.payload.tournamentId,
        action.payload.roundIndex,
        action.payload.tableNumber,
      );
      table.wins[action.payload.teamIndex] = action.payload.wins;
    },
    setMatchDraws: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        roundIndex: RoundIndex;
        tableNumber: TableNumber;
        draws: number;
      }>,
    ) => {
      const table = getTable(
        state,
        action.payload.tournamentId,
        action.payload.roundIndex,
        action.payload.tableNumber,
      );
      table.draws = action.payload.draws;
    },
    dropPlayer: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        roundIndex: RoundIndex;
        player: PlayerId;
      }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      const round = tournament.rounds[action.payload.roundIndex];
      if (round.dropped.includes(action.payload.player)) {
        return;
      }
      round.dropped.push(action.payload.player);
    },
    undropPlayer: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        roundIndex: RoundIndex;
        player: PlayerId;
      }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      const round = tournament.rounds[action.payload.roundIndex];
      round.dropped = round.dropped.filter(
        (id) => id !== action.payload.player,
      );
    },
  },
});

export const {
  createTournament,
  deleteTournament,
  undeleteTournament,
  registerPlayer,
  registerPlayers,
  unregisterPlayer,
  setTournamentName,
  setMatchFormat,
  createNextRound,
  setMatchWins,
  setMatchDraws,
  dropPlayer,
  undropPlayer,
} = tournamentSlice.actions;

export function selectAllTournaments(state: RootState): Tournament[] {
  const tournaments = Object.values(state.tournament.registry) as Tournament[];
  return tournaments.filter((tournament) => !tournament.deleted);
}

export function selectTournament(params: {
  tournamentId?: TournamentId;
}): (state: RootState) => Tournament {
  return (state: RootState) =>
    getTournament(state.tournament, params.tournamentId!);
}

export function selectRound(params: {
  tournamentId?: TournamentId;
  roundNumber?: string;
}): (state: RootState) => {
  tournament: Tournament;
  roundIndex: RoundIndex;
  round: Round;
} {
  return (state: RootState) => {
    const tournament = getTournament(state.tournament, params.tournamentId!);
    const roundIndex = parseInt(params.roundNumber!) - 1;
    const round = tournament.rounds[roundIndex];
    return { tournament, roundIndex, round };
  };
}

export function hasStarted(tournament: Tournament): boolean {
  return tournament.rounds.length > 0;
}

export function hasRegisteredPlayers(tournament: Tournament): boolean {
  return tournament.players.length > 0;
}

function getCurrentRound(tournament: Tournament): Round {
  if (tournament.rounds.length === 0) {
    throw new Error("Tournament has not started yet.");
  }
  return tournament.rounds[tournament.rounds.length - 1];
}

export function isCurrentRound(
  tournament: Tournament,
  roundIndex: RoundIndex,
): boolean {
  return roundIndex === tournament.rounds.length - 1;
}

export function hasActivePlayers(tournament: Tournament): boolean {
  const round = getCurrentRound(tournament);
  return round.players.length > round.dropped.length;
}

export function getPlayersPerTeam(matchFormat: MatchFormat): number {
  switch (matchFormat) {
    case MatchFormat.SinglePlayer:
      return 1;
    case MatchFormat.TwoHeadedGiant:
      return 2;
  }
}

export function getMaxPlayersPerTable(matchFormat: MatchFormat): number {
  switch (matchFormat) {
    case MatchFormat.SinglePlayer:
      return 2;
    case MatchFormat.TwoHeadedGiant:
      return 4;
  }
}

export function getSeatAssignments(round: Round): Map<PlayerId, Seating> {
  const seatings = new Map<PlayerId, Seating>();

  for (const table of round.tables) {
    for (const [teamIndex, team] of table.teams.entries()) {
      for (const playerId of team) {
        seatings.set(playerId, {
          tableNumber: table.number,
          teamName: table.teams.length === 1 ? undefined : teamNames[teamIndex],
          allies: team,
          opposingTeams: table.teams.filter((_, i) => i !== teamIndex),
        });
      }
    }
  }

  return seatings;
}

export function playerHasDropped(round: Round, player: PlayerId): boolean {
  return round.dropped.includes(player);
}

export function playerHasDroppedFromTournament(
  tournament: Tournament,
  player: PlayerId,
): boolean {
  return tournament.rounds.some((round) => playerHasDropped(round, player));
}
