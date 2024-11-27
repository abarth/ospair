export class Player {
  constructor(public name: string) {}
}

export class Table {
  constructor(
    public number: number,
    public players: Player[],
  ) {}
}

export class Round {
  public tables: Table[] = [];

  constructor(public number: number) {}

  pairPlayers(players: Player[]) {
    let sortedPlayers = players.slice();
    while (sortedPlayers.length > 0) {
      let players = sortedPlayers.splice(0, 2);
      let table = new Table(this.tables.length, players);
      this.tables.push(table);
    }
  }
}

export class Tournament {
  public players: Player[] = [];
  public rounds: Round[] = [];

  registerPlayer(player: Player) {
    this.players.push(player);
  }

  createNextRound() {
    let round = new Round(this.rounds.length);
    round.pairPlayers(this.players);
    this.rounds.push(round);
  }
}
