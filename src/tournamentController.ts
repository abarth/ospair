import { shuffle } from "./math";
import {
  Tournament,
  Player,
  PlayerId,
  Round,
  MatchResult,
  TableNumber,
  Table,
} from "./model";

function createTournament(): Tournament {
  return {
    players: [],
    rounds: [],
  };
}

function createTable(number: TableNumber): Table {
  return {
    number,
    teams: [],
    results: [],
  };
}

function createRound(): Round {
  return {
    tables: [],
  };
}

export class TournamentController {
  tournament: Tournament;
  players: Map<PlayerId, Player>;

  constructor() {
    this.tournament = createTournament();
    this.players = new Map();
  }

  registerPlayer(name: string, club: string): void {
    let id = this.tournament.players.length;
    let player = { id, name, club };
    this.tournament.players.push(player);
    this.players.set(id, player);
  }

  getPlayerName(id: number): Player {
    return this.players.get(id)!;
  }

  get currentRound(): number {
    return this.tournament.rounds.length;
  }

  pairPlayers(): void {
    this.tournament.rounds.push(createRound());
    const roundNumber = this.currentRound;

    let players = [...this.tournament.players];

    // TODO: Actually pair the players based on their scores.
    shuffle(players);

    // Pair players by taking the first two players from the shuffled list
    // and removing them from the list until there is either one or no players left.
    // If there is one player left, they get a bye.
    const tables = this.tournament.rounds[roundNumber].tables;
    const fullTableCount = Math.floor(players.length / 2);
    for (let i = 0; i < fullTableCount; i++) {
      const table = createTable(i + 1);
      table.teams = [[players[i].id], [players[i + 1].id]];
      tables.push(table);
    }
  }

  recordResult(tableNumber: TableNumber, results: MatchResult[]): void {
    const roundNumber = this.currentRound;
    const round = this.tournament.rounds[roundNumber];
    for (let table of round.tables) {
      if (table.number === tableNumber) {
        table.results = results;
        break;
      }
    }
  }
}
