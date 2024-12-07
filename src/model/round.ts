import {
  RoundIndex,
  Tournament,
  Round,
  PlayerId,
  MatchFormat,
  Table,
  Team,
  TeamIndex,
} from "./objects";
import { getTournamentHistoryForRound, TournamentHistory } from "./tournament";

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

class TeamAssignment {
  teams: Team[];

  constructor(teamCount: number) {
    this.teams = Array.from({ length: teamCount }).map(() => []);
  }

  isFresh(
    history: TournamentHistory,
    player: PlayerId,
    teamIndex: TeamIndex,
  ): boolean {
    for (const [index, team] of this.teams.entries()) {
      if (index === teamIndex) {
        if (team.some((member) => history.wereAllies(player, member))) {
          return false;
        }
      } else {
        if (team.some((member) => history.wereOpponents(player, member))) {
          return false;
        }
      }
    }
    return true;
  }
}

interface TeamShape {
  teamCount: number;
  playersPerTeam: number;
}

class PlayerAllocator {
  playersRemaining: number;

  private players: (PlayerId | null)[];
  private nextPlayerIndex: number = 0;

  constructor(
    private history: TournamentHistory,
    players: PlayerId[],
  ) {
    const active = new Set(players);
    this.players = this.history.standings.filter((player) =>
      active.has(player),
    );
    this.playersRemaining = this.players.length;
  }

  private advanceNextPlayerIndex() {
    while (this.nextPlayerIndex < this.players.length) {
      if (this.players[this.nextPlayerIndex]) {
        return;
      }
      ++this.nextPlayerIndex;
    }
  }

  private takePlayerAt(index: number): PlayerId {
    const player = this.players[index];
    if (!player) {
      throw new Error("Player already taken");
    }
    this.players[index] = null;
    this.playersRemaining--;
    if (index === this.nextPlayerIndex) {
      this.advanceNextPlayerIndex();
    }
    return player;
  }

  private takeNextPlayer(): PlayerId {
    return this.takePlayerAt(this.nextPlayerIndex);
  }

  private takeNextMatchingPlayer(
    predicate: (player: PlayerId) => boolean,
  ): PlayerId | undefined {
    let index = this.nextPlayerIndex;
    while (index < this.players.length) {
      const player = this.players[index];
      if (player && predicate(player)) {
        return this.takePlayerAt(index);
      }
      ++index;
    }
    return undefined;
  }

  private assignToTeam(assignment: TeamAssignment, teamIndex: TeamIndex) {
    let player = this.takeNextMatchingPlayer((player) =>
      assignment.isFresh(this.history, player, teamIndex),
    );
    if (!player) {
      player = this.takeNextPlayer();
    }
    assignment.teams[teamIndex].push(player);
  }

  getNextTeamShape(matchFormat: MatchFormat): TeamShape {
    if (this.playersRemaining === 0) {
      throw new Error("No players remaining");
    }
    if (this.playersRemaining === 1) {
      return { teamCount: 1, playersPerTeam: 1 };
    }
    switch (matchFormat) {
      case MatchFormat.SinglePlayer:
        return { teamCount: 2, playersPerTeam: 1 };
      case MatchFormat.TwoHeadedGiant:
        // If there are six players left, we should pair them as 3 and 3 rather than as 4 and 2.
        if (this.playersRemaining === 6) {
          return { teamCount: 3, playersPerTeam: 1 };
        }
        // If there are three players left, we pair them as a 1v1v1 rather than a 1v1 and a bye.
        if (this.playersRemaining === 3) {
          return { teamCount: 3, playersPerTeam: 1 };
        }
        if (this.playersRemaining === 2) {
          return { teamCount: 2, playersPerTeam: 1 };
        }
        return { teamCount: 2, playersPerTeam: 2 };
    }
  }

  allocateByes(matchFormat: MatchFormat): PlayerId[] {
    if (this.playersRemaining === 0) {
      return [];
    }
    switch (matchFormat) {
      case MatchFormat.SinglePlayer:
        // In Single Player, we need to allocate byes if there is an odd number of players.
        if (this.playersRemaining % 2 === 1) {
          let fewestByes = 0;
          let playerIndexWithFewestByes = null;
          for (
            let playerIndex = this.playersRemaining - 1;
            playerIndex >= 0;
            --playerIndex
          ) {
            const player = this.players[playerIndex];
            if (player) {
              const byes = this.history.playerHistory.get(player)!.byes;
              if (byes === 0) {
                return [this.takePlayerAt(playerIndex)];
              }
              if (playerIndexWithFewestByes === null || byes < fewestByes) {
                fewestByes = byes;
                playerIndexWithFewestByes = playerIndex;
              }
            }
          }
          return [this.takePlayerAt(playerIndexWithFewestByes!)];
        }
        return [];
      case MatchFormat.TwoHeadedGiant:
        // In Two-Headed Giant, we only need to allocate byes if there is exactly one player.
        if (this.playersRemaining === 1) {
          return [this.takeNextPlayer()];
        }
        return [];
    }
  }

  allocatePlayers(shape: TeamShape): Team[] {
    if (this.playersRemaining < shape.teamCount * shape.playersPerTeam) {
      throw new Error(
        `Not enough players to make ${shape.teamCount} teams of ${shape.playersPerTeam}: ` +
          `${this.playersRemaining} players remaint to be assigned`,
      );
    }
    const assignment = new TeamAssignment(shape.teamCount);
    for (let i = 0; i < shape.playersPerTeam; i++) {
      for (let teamIndex = 0; teamIndex < shape.teamCount; teamIndex++) {
        this.assignToTeam(assignment, teamIndex);
      }
    }
    return assignment.teams;
  }
}

export function createRound(
  tournament: Tournament,
  roundIndex: RoundIndex,
): Round {
  const history = getTournamentHistoryForRound(tournament, roundIndex - 1);
  const players = getPlayersForRound(tournament, roundIndex);
  const allocator = new PlayerAllocator(history, players);

  const tables: Table[] = [];
  const playersWithByes = allocator.allocateByes(tournament.matchFormat);
  while (allocator.playersRemaining > 0) {
    const shape = allocator.getNextTeamShape(tournament.matchFormat);
    const teams = allocator.allocatePlayers(shape);
    tables.push({
      number: tables.length + 1,
      teams,
      wins: teams.map(() => 0),
      draws: 0,
    });
  }

  for (const player of playersWithByes) {
    tables.push({
      number: tables.length + 1,
      teams: [[player]],
      wins: [2],
      draws: 0,
    });
  }

  return {
    players,
    tables,
    dropped: [],
  };
}
