import { parsePlayersCsv } from "./players-csv";

test("parse players.csv", (done) => {
  const file = new File(
    [
      "First Name,Last Name,Club\n",
      "Alice,Apple,ACME\n",
      "Bob,Banana,Banana Club\n",
      "Charlie,Cherry,Cherry Club\n",
      "David,Durian,Durian Club\n",
    ],
    "players.csv",
    { type: "text/csv" },
  );
  parsePlayersCsv(file, (players) => {
    expect(players).toEqual([
      { id: expect.any(String), name: "Alice Apple", club: "ACME" },
      { id: expect.any(String), name: "Bob Banana", club: "Banana Club" },
      { id: expect.any(String), name: "Charlie Cherry", club: "Cherry Club" },
      { id: expect.any(String), name: "David Durian", club: "Durian Club" },
    ]);
    done();
  });
});
