import axios from "axios";
import type { components } from "../../gen/schema";
import { useParams } from "react-router";
import MissionPlayer from "./MissionPlayer";

type Mission = components["schemas"]["MissionSchema"];
type UpdateData = Partial<{
  chaos_pool: number;
  loose_ends: number;
  description: string;
  quality: string;
  qa_delta: number;
  player_id: number;
  commendations: number;
  demerits: number;
  additional_burnout: number;
}>;

type PathParams = Partial<{
  missionId: string;
  playerId: string;
}>;

type MissionRecordProps = {
  mission?: Mission;
  ifDMView: boolean;
};

const MissionRecord = ({ mission, ifDMView }: MissionRecordProps) => {
  const { missionId, playerId } = useParams<PathParams>();

  const playerIdNum = playerId ? Number.parseInt(playerId, 10) : Number.NaN;
  const selectedPlayer = Number.isNaN(playerIdNum)
    ? undefined
    : mission?.players.find((item) => item.id === playerIdNum);

  const updateMission = async (update_data: UpdateData) => {
    try {
      await axios.patch(`/api/mission/${missionId}/`, update_data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateQaQuality = async (playerId: number, quality: string, delta: number) => {
    if (ifDMView) {
      await updateMission({ player_id: playerId, quality: quality, qa_delta: delta});
      return;
    }

    if (selectedPlayer?.id) {
      await updateMission({ player_id: selectedPlayer.id, quality: quality, qa_delta: delta});
    }
  };

  const updatePlayerStat = async (
    playerId: number,
    stat: "commendations" | "demerits" | "additional_burnout",
    delta: number
  ) => {
    if (ifDMView) {
      await updateMission({ player_id: playerId, [stat]: delta });
      return;
    }

    if (selectedPlayer?.id) {
      await updateMission({ player_id: selectedPlayer.id, [stat]: delta });
    }
  };

  return (
    <div className="wrap">
      <header>
        <div>
          <div className="title">Private Eye Dossier</div>
          <h1>Mission Public Record</h1>
        </div>
        <div className="stamp">Classified</div>
      </header>

      <section className="dossiers">
        <article className="dossier">
          <div className="dossier-header">
            <div>
              <div className="mission-id">Case File {mission?.id ?? "—"}</div>
              <div>{mission?.mission_name ?? "Unassigned Mission"}</div>
            </div>
            <div className="status">Public Brief</div>
          </div>
          <div className="grid">
            <div className="panel">
              <h3>Mission Name</h3>
              <div className="metric">{mission?.mission_name ?? "Unassigned"}</div>
            </div>
            <div className="panel">
              <h3>Chaos Pool</h3>
              <div className="metric">{mission?.chaos_pool ?? "—"}</div>
              {ifDMView ? (
                <>
                  <button id="inc-chaos" onClick={() => updateMission({ chaos_pool: 1 })}>
                    +
                  </button>
                  <button id="dec-chaos" onClick={() => updateMission({ chaos_pool: -1 })}>
                    -
                  </button>
                </>
              ) : null}
            </div>
            <div className="panel">
              <h3>Loose Ends</h3>
              <div className="metric">{mission?.loose_ends ?? "—"}</div>
              {ifDMView ? (
                <>
                  <button id="inc-loose-ends" onClick={() => updateMission({ loose_ends: 1 })}>
                    +
                  </button>
                  <button id="dec-loose-ends" onClick={() => updateMission({ loose_ends: -1 })}>
                    -
                  </button>
                </>
              ) : null}
            </div>
            <div className="panel">
              <h3>Evidence Image</h3>
              <div className="image-block">
                {mission?.url ? (
                  <>
                    <img
                      src={mission.url}
                      alt="Evidence"
                      style={{
                        width: "100%",
                        border: "1px solid rgba(90, 79, 67, 0.3)",
                      }}
                    />
                    <div className="image-meta">Archive: {mission.url}</div>
                  </>
                ) : (
                  <div className="image-meta">No image on file.</div>
                )}
              </div>
            </div>
            <div className="panel">
              <h3>Description</h3>
              <div className="description">
                {mission?.description ?? "No description recorded."}
              </div>
            </div>
            <div className="panel">
              <h3>Players</h3>
              <div className="description">
                {mission?.players?.length ? (
                  <div className="players-list">
                    {mission.players.map((player, playerIndex) => (
                      <MissionPlayer
                        key={player.id ?? `${player.player_name ?? "player"}-${playerIndex}`}
                        player={player}
                        playerIndex={playerIndex}
                        ifDMView={ifDMView}
                        isSelectedPlayer={player.id === selectedPlayer?.id}
                        updateQaQuality={updateQaQuality}
                        updatePlayerStat={updatePlayerStat}
                      />
                    ))}
                  </div>
                ) : (
                  "No operatives assigned."
                )}
              </div>
            </div>
          </div>
        </article>
      </section>
      <footer>Triangle Agency Bureau - Public Records</footer>
    </div>
  );
};

export default MissionRecord;
