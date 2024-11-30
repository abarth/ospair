import { shuffle } from "../base/math";
import {
  Tournament,
  PlayerId,
  Round,
  MatchResult,
  TableNumber,
  Table,
  Team,
  ClubName,
  PlayerName,
} from "../model/objects";
import { playerController } from "./player";

export function createTournament(): Tournament {
  return {
    name: "Untitled Tournament",
    players: [],
    rounds: [],
  };
}

export function hasCurrentRound(tournament: Tournament): boolean {
  return tournament.rounds.length > 0;
}

export function hasRegisteredPlayers(tournament: Tournament): boolean {
  return tournament.players.length > 0;
}

export function hasActivePlayers(tournament: Tournament): boolean {
  const round = getCurrentRound(tournament);
  return round.players.length > round.dropped.length;
}

export function registerPlayer(
  tournament: Tournament,
  name: PlayerName,
  club: ClubName,
): Tournament {
  const player = playerController.add(name, club);
  return {
    ...tournament,
    players: [...tournament.players, player],
  };
}

export function registerPlayers(tournament: Tournament, players: PlayerId[]) {
  return {
    ...tournament,
    players: [...tournament.players, ...players],
  };
}

export function getCurrentRound(tournament: Tournament): Round {
  if (tournament.rounds.length === 0) {
    throw new Error("Tournament has not started yet.");
  }
  return tournament.rounds[tournament.rounds.length - 1];
}

function getPlayersForNextRound(tournament: Tournament): PlayerId[] {
  if (tournament.rounds.length === 0) {
    return [...tournament.players];
  }
  const currentRound = getCurrentRound(tournament);
  return tournament.players.filter(
    (player) => !currentRound.dropped.includes(player),
  );
}

export function startRound(tournament: Tournament): Tournament {
  const players = getPlayersForNextRound(tournament);

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
      results: [],
    });
  }

  const tableCount = Math.ceil(players.length / 2);
  for (let i = 0; i < tableCount; i++) {
    const base = i * 2;
    const assignedPlayers = players.slice(base, base + 2);
    switch (assignedPlayers.length) {
      case 1:
        seat([[assignedPlayers[0]]]);
        break;
      case 2:
        seat([[assignedPlayers[0]], [assignedPlayers[1]]]);
        break;
      default:
        continue;
    }
  }

  let round: Round = {
    players: players,
    tables: tables,
    dropped: [],
  };

  return {
    ...tournament,
    rounds: [...tournament.rounds, round],
  };
}

function replaceCurrentRound(rounds: Round[], updatedRound: Round): Round[] {
  const updatedRounds = rounds.slice(-1);
  updatedRounds.push(updatedRound);
  return updatedRounds;
}

function updateCurrentRound(
  tournament: Tournament,
  tranform: (round: Round) => Round,
): Tournament {
  const round = getCurrentRound(tournament);
  return {
    ...tournament,
    rounds: replaceCurrentRound(tournament.rounds, tranform(round)),
  };
}

export function recordMatchResult(
  tournament: Tournament,
  tableNumber: TableNumber,
  matchResults: MatchResult[],
): Tournament {
  return updateCurrentRound(tournament, (round) => {
    return {
      ...round,
      tables: round.tables.map((table) => {
        if (table.number === tableNumber) {
          return {
            ...table,
            matchResult: matchResults,
          };
        } else {
          return table;
        }
      }),
    };
  });
}

export function dropPlayer(
  tournament: Tournament,
  playerId: PlayerId,
): Tournament {
  return updateCurrentRound(tournament, (round) => {
    return {
      ...round,
      dropped: [...round.dropped, playerId],
    };
  });
}
