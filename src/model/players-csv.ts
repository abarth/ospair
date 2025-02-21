import { parse } from "papaparse";
import { Player } from "./objects";
import { isRegistration } from "../model/objects";
import { nanoid } from "nanoid";

export function parsePlayersCsv(
  file: File,
  complete: (players: Player[]) => void,
) {
  parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results, file) {
      const players: Player[] = [];
      for (const entry of results.data) {
        if (!isRegistration(entry)) continue;
        let name = [entry["First Name"], entry["Last Name"]].join(" ").trim();
        players.push({
          id: nanoid(),
          name: name,
          club: entry["Club"],
        });
      }
      complete(players);
    },
  });
}
