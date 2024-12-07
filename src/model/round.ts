import { getMaxPlayersPerTable } from "../store/tournament-slice";
import {
  RoundIndex,
  Tournament,
  Round,
  PlayerId,
  MatchFormat,
  Table,
  Team,
} from "./objects";
import { getTournamentHistoryBeforeRound } from "./tournament";

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

export function createRound(
  tournament: Tournament,
  roundIndex: RoundIndex,
): Round {
  const history = getTournamentHistoryBeforeRound(tournament, roundIndex);
  const active = new Set(getPlayersForRound(tournament, roundIndex));
  const players = history.standings.filter((player) => active.has(player));

  let nextTableNumber = 1;

  const tables: Table[] = [];

  function seat(teams: Team[]) {
    tables.push({
      number: nextTableNumber++,
      teams: teams,
      wins: new Array(teams.length).fill(0),
      draws: 0,
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

  return {
    players,
    tables: tables,
    dropped: [],
  };
}
