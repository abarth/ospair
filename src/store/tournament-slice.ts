import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { alea } from "seedrandom";
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
import { getTable } from "../model/tournament";
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

function getTableFromState(
  state: TournamentState,
  tournamentId: TournamentId,
  roundIndex: RoundIndex,
  tableNumber: TableNumber,
): Table {
  const tournament = getTournament(state, tournamentId);
  return getTable(tournament, roundIndex, tableNumber);
}

function registerPlayerInternal(
  tournament: Tournament,
  player: PlayerId,
): void {
  tournament.availablePlayers = tournament.availablePlayers.filter(
    (unregisteredPlayer) => unregisteredPlayer !== player,
  );
  tournament.players.push(player);
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
        matchFormat: action.payload.matchFormat ?? MatchFormat.HeadToHead,
        players: [],
        availablePlayers: [],
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
      registerPlayerInternal(tournament, action.payload.player);
    },
    registerPlayers: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        players: PlayerId[];
      }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      for (const player of action.payload.players) {
        registerPlayerInternal(tournament, player);
      }
    },
    unregisterPlayer: (
      state,
      action: PayloadAction<{ tournamentId: TournamentId; player: PlayerId }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      const unregisteredPlayer = action.payload.player;
      tournament.players = tournament.players.filter(
        (player) => player !== unregisteredPlayer,
      );
      tournament.availablePlayers.push(unregisteredPlayer);
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
      const prng = alea(`${tournament.id} [Round ${roundIndex}]`);
      let round = createRound(prng, tournament, roundIndex);
      tournament.rounds.push(round);
    },
    deleteCurrentRound: (state, action: PayloadAction<TournamentId>) => {
      const tournament = getTournament(state, action.payload);
      tournament.rounds.pop();
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
      const table = getTableFromState(
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
      const table = getTableFromState(
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
    swapPlayers: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        roundIndex: RoundIndex;
        player1: PlayerId;
        player2: PlayerId;
      }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      const round = tournament.rounds[action.payload.roundIndex];
      const { player1, player2 } = action.payload;

      let loc1: { tableIdx: number; teamIdx: number; playerIdx: number } | null =
        null;
      let loc2: { tableIdx: number; teamIdx: number; playerIdx: number } | null =
        null;

      for (let tableIdx = 0; tableIdx < round.tables.length; tableIdx++) {
        const table = round.tables[tableIdx];
        for (let teamIdx = 0; teamIdx < table.teams.length; teamIdx++) {
          const team = table.teams[teamIdx];
          for (let playerIdx = 0; playerIdx < team.length; playerIdx++) {
            if (team[playerIdx] === player1) {
              loc1 = { tableIdx, teamIdx, playerIdx };
            } else if (team[playerIdx] === player2) {
              loc2 = { tableIdx, teamIdx, playerIdx };
            }
          }
        }
      }

      if (loc1 && loc2) {
        round.tables[loc1.tableIdx].teams[loc1.teamIdx][loc1.playerIdx] =
          player2;
        round.tables[loc2.tableIdx].teams[loc2.teamIdx][loc2.playerIdx] =
          player1;
      }
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
  deleteCurrentRound,
  setMatchWins,
  setMatchDraws,
  dropPlayer,
  undropPlayer,
  swapPlayers,
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
  round?: Round;
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

export function hasAvailablePlayers(tournament: Tournament): boolean {
  return tournament.availablePlayers.length > 0;
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
    case MatchFormat.HeadToHead:
      return 1;
    case MatchFormat.TwoHeadedGiant:
      return 2;
  }
}

export function getMaxPlayersPerTable(matchFormat: MatchFormat): number {
  switch (matchFormat) {
    case MatchFormat.HeadToHead:
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

export function tableHasResults(table: Table): boolean {
  if (table.teams.length === 1) {
    return true; // Bye tables are automatically complete
  }
  return table.wins.some((w) => w > 0) || table.draws > 0;
}

export function allTablesHaveResults(round: Round): boolean {
  return round.tables.every((table) => tableHasResults(table));
}

export function playerHasDroppedFromTournament(
  tournament: Tournament,
  player: PlayerId,
): boolean {
  return tournament.rounds.some((round) => playerHasDropped(round, player));
}
