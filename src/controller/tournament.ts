import { nanoid } from "nanoid";
import { shuffle } from "../base/math";
import {
  Tournament,
  PlayerId,
  Round,
  Score,
  TableNumber,
  Table,
  Team,
  ClubName,
  PlayerName,
  Seating,
  teamNames,
  MatchFormat,
} from "../model/objects";
import { playerController } from "./player";

export function createTournament(): Tournament {
  return {
    id: nanoid(),
    name: "Untitled Tournament",
    matchFormat: MatchFormat.SinglePlayer,
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

export function unregisterPlayer(
  tournament: Tournament,
  playerId: PlayerId,
): Tournament {
  return {
    ...tournament,
    players: tournament.players.filter((player) => player !== playerId),
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
            seat([assignedPlayers.slice(0, 2), assignedPlayers.slice(2, 4)]);
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
  teamIndex: number,
  score: Score,
): Tournament {
  return updateCurrentRound(tournament, (round) => {
    return {
      ...round,
      tables: round.tables.map((table) => {
        if (table.number === tableNumber) {
          const outcome = [...table.outcome];
          outcome[teamIndex] = score;
          return {
            ...table,
            outcome: outcome,
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
    if (round.dropped.includes(playerId)) {
      return round;
    }
    return {
      ...round,
      dropped: [...round.dropped, playerId],
    };
  });
}

export function undropPlayer(
  tournament: Tournament,
  playerId: PlayerId,
): Tournament {
  return updateCurrentRound(tournament, (round) => {
    return {
      ...round,
      dropped: round.dropped.filter((id) => id !== playerId),
    };
  });
}

export function playerHasDropped(round: Round, playerId: PlayerId): boolean {
  return round.dropped.includes(playerId);
}
