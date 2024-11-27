import { Player, Tournament } from "./model";

export let tournament = new Tournament();
tournament.registerPlayer(new Player("Alice"));
tournament.registerPlayer(new Player("Bob"));
tournament.registerPlayer(new Player("Charlie"));
tournament.registerPlayer(new Player("Dora"));
