import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shuffle } from "../base/math";
import {
  Tournament,
  TournamentId,
  PlayerId,
  Round,
  RoundIndex,
  Score,
  TableNumber,
  Table,
  Team,
  Seating,
  teamNames,
  MatchFormat,
} from "../model/objects";
import type { RootState } from "./index";

interface TournamentState {
  registry: any;
}

const initialState: TournamentState = {
  registry: {},
};

function getPlayersForRound(
  tournament: Tournament,
  roundIndex: RoundIndex,
): PlayerId[] {
  if (roundIndex === 0) {
    return [...tournament.players];
  }
  const previousRound = tournament.rounds[roundIndex - 1];
  return previousRound.players.filter(
    (player) => !previousRound.dropped.includes(player),
  );
}

function getTournament(
  state: TournamentState,
  tournamentId: TournamentId,
): Tournament {
  return state.registry[tournamentId]!;
}

export const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    createTournament: (
      state,
      action: PayloadAction<{ tournamentId: TournamentId; name: string }>,
    ) => {
      const tournament = {
        id: action.payload.tournamentId,
        name: action.payload.name,
        matchFormat: MatchFormat.SinglePlayer,
        players: [],
        rounds: [],
      };
      state.registry[tournament.id] = tournament;
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
      const players = getPlayersForRound(tournament, roundIndex);

      // TODO: Actually pair the players based on their scores.
      shuffle(players);

      let nextTableNumber = 1;

      // Pair players by taking the first two players from the shuffled list
      // and removing them from the list until there is either one or no players left.
      // If there is one player left, they get a bye.
      const tables: Table[] = [];

      function seat(teams: Team[]) {
        tables.push({
          number: nextTableNumber++,
          teams: teams,
          outcome: new Array(teams.length).fill(0),
        });
      }

      const maxPlayersPerTable = getMaxPlayersPerTable(tournament.matchFormat);

      const tableCount = Math.ceil(players.length / maxPlayersPerTable);
      for (let i = 0; i < tableCount; i++) {
        const base = i * maxPlayersPerTable;
        const assignedPlayers = players.slice(base, base + maxPlayersPerTable);
        switch (tournament.matchFormat) {
          case MatchFormat.SinglePlayer:
            seat(assignedPlayers.map((player) => [player]));
            break;
          case MatchFormat.TwoHeadedGiant:
            // If there are 5 people left, we should pair them as 3 and 2. Currently, we pair them as 4 and give the last player a bye.
            // If there are 6 people left, we should pair them as 3 and 3. Currently, we pair them as 4 and 2.
            switch (assignedPlayers.length) {
              case 1:
                seat([[assignedPlayers[0]]]);
                break;
              case 2:
                seat([[assignedPlayers[0]], [assignedPlayers[1]]]);
                break;
              case 3:
                seat([
                  [assignedPlayers[0]],
                  [assignedPlayers[1]],
                  [assignedPlayers[2]],
                ]);
                break;
              case 4:
                seat([
                  assignedPlayers.slice(0, 2),
                  assignedPlayers.slice(2, 4),
                ]);
                break;
              default:
                throw new Error("Invalid number of players");
            }
            break;
        }
      }

      let round: Round = {
        players: players,
        tables: tables,
        dropped: [],
      };

      tournament.rounds.push(round);
    },
    setMatchResult: (
      state,
      action: PayloadAction<{
        tournamentId: TournamentId;
        roundIndex: RoundIndex;
        tableNumber: TableNumber;
        teamIndex: number;
        score: Score;
      }>,
    ) => {
      const tournament = getTournament(state, action.payload.tournamentId);
      const round = tournament.rounds[action.payload.roundIndex];
      const table = round.tables.find(
        (table) => table.number === action.payload.tableNumber,
      );
      if (!table) {
        throw new Error("Table not found");
      }
      table.outcome[action.payload.teamIndex] = action.payload.score;
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
  registerPlayer,
  registerPlayers,
  unregisterPlayer,
  setTournamentName,
  setMatchFormat,
  createNextRound,
  setMatchResult,
  dropPlayer,
  undropPlayer,
} = tournamentSlice.actions;

export function selectAllTournaments(state: RootState): Tournament[] {
  return Object.values(state.tournament.registry) as Tournament[];
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
          number: table.number,
          team: table.teams.length === 1 ? undefined : teamNames[teamIndex],
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
