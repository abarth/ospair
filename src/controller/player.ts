import { PlayerId, Player } from "../model/objects";

export class PlayerControler {
  private nextPlayerId: PlayerId = 1;
  private players = new Map<PlayerId, Player>();

  add(name: string, club: string): PlayerId {
    let id = this.nextPlayerId++;
    let player = { id, name, club };
    this.players.set(id, player);
    return id;
  }

  getPlayer(id: PlayerId): Player {
    return this.players.get(id)!;
  }

  get allPlayers(): Player[] {
    return [...this.players.values()];
  }
}

export const playerController = new PlayerControler();
