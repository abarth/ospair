import * as React from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./views/HomePage";
import TournamentPage from "./views/TournamentPage";
import RoundPage from "./views/RoundPage";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tournament/:tournamentId"
            element={<TournamentPage />}
          />
          <Route
            path="/tournament/:tournamentId/round/:roundNumber"
            element={<RoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
