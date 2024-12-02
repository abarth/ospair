import { Pagination } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectRound } from "../store/tournament-slice";
import { routeTo } from "../routes";

export default function RoundSelector() {
  const { tournament, roundIndex } = useAppSelector(selectRound(useParams()));
  const navigate = useNavigate();

  return (
    <Pagination
      count={tournament.rounds.length}
      page={roundIndex + 1}
      color="secondary"
      onChange={(event, page) =>
        navigate(
          routeTo({
            tournamentId: tournament.id,
            roundIndex: page - 1,
          }),
        )
      }
    />
  );
}
