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
      await updateMission({ player_id: playerId, quality, qa_delta: delta });
      return;
    }

    if (selectedPlayer?.id) {
      await updateMission({ player_id: selectedPlayer.id, quality, qa_delta: delta });
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
    <div className="record-wrap">
      <header className="record-header">
        <div>
          <div className="title">Triangle Agency</div>
          <h1>Mission Record</h1>
        </div>
      </header>

      <section className="mission-priority-fields">
        <div className="priority-field">
          <h3>Mission Name</h3>
          <div>{mission?.mission_name ?? "Unassigned Mission"}</div>
        </div>
        <div className="priority-field">
          <h3>Chaos Pool</h3>
          <div className="value-controls">
            {ifDMView ? (
              <button type="button" onClick={() => updateMission({ chaos_pool: -1 })}>
                -
              </button>
            ) : null}
            <span>{mission?.chaos_pool ?? 0}</span>
            {ifDMView ? (
              <button type="button" onClick={() => updateMission({ chaos_pool: 1 })}>
                +
              </button>
            ) : null}
          </div>
        </div>
        <div className="priority-field">
          <h3>Loose Ends</h3>
          <div className="value-controls">
            {ifDMView ? (
              <button type="button" onClick={() => updateMission({ loose_ends: -1 })}>
                -
              </button>
            ) : null}
            <span>{mission?.loose_ends ?? 0}</span>
            {ifDMView ? (
              <button type="button" onClick={() => updateMission({ loose_ends: 1 })}>
                +
              </button>
            ) : null}
          </div>
        </div>
        <div className="priority-field mission-description">
          <h3>Description</h3>
          <div>{mission?.description ?? "No description recorded."}</div>
        </div>
      </section>

      <section className="mission-secondary-fields">
        <article className="panel">
          <h3>Mission Fields</h3>
          <div className="image-block">
            {mission?.url ? (
              <>
                <img src={mission.url} alt="Evidence" className="evidence-image" />
                <div className="image-meta">Archive: {mission.url}</div>
              </>
            ) : (
              <div className="image-meta">No image on file.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h3>Players</h3>
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
            <div className="image-meta">No operatives assigned.</div>
          )}
        </article>
      </section>
    </div>
  );
};

export default MissionRecord;
