import type { components } from "../../gen/schema";

type Player = components["schemas"]["PlayerSchema"];

type MissionPlayerProps = {
  player: Player;
  playerIndex: number;
  ifDMView: boolean;
  isSelectedPlayer: boolean;
  updateQaQuality: (playerId: number, quality: string, delta: number) => void | Promise<void>;
  updatePlayerStat: (
    playerId: number,
    stat:
      | "commendations"
      | "demerits"
      | "additional_burnout"
      | "competency_level"
      | "max_competency_level"
      | "reality_level"
      | "max_reality_level"
      | "anomaly_level"
      | "max_anomaly_level",
    delta: number
  ) => void | Promise<void>;
};

const MissionPlayer = ({
  player,
  playerIndex,
  ifDMView,
  isSelectedPlayer,
  updateQaQuality,
  updatePlayerStat,
}: MissionPlayerProps) => {
  const canUpdatePlayer = ifDMView || isSelectedPlayer;
  const hasPlayerId = player.id != null;

  const renderStatRow = (
    label: string,
    stat:
      | "commendations"
      | "demerits"
      | "additional_burnout"
      | "competency_level"
      | "max_competency_level"
      | "reality_level"
      | "max_reality_level"
      | "anomaly_level"
      | "max_anomaly_level",
    value: number | null | undefined
  ) => (
    <div className="qa-row" key={stat}>
      <div className="qa-label">{label}</div>
      {canUpdatePlayer ? (
        <div className="qa-controls">
          <button
            type="button"
            onClick={() => {
              if (hasPlayerId && player.id != null) {
                updatePlayerStat(player.id, stat, -1);
              }
            }}
            disabled={!hasPlayerId}
          >
            -
          </button>
          <span>{value ?? 0}</span>
          <button
            type="button"
            onClick={() => {
              if (hasPlayerId && player.id != null) {
                updatePlayerStat(player.id, stat, 1);
              }
            }}
            disabled={!hasPlayerId}
          >
            +
          </button>
        </div>
      ) : (
        <div className="qa-controls">
          <span>{value ?? 0}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="player-qas-card">
      <div className="player-name">
        {player.player_name ?? `Player ${player.id ?? playerIndex + 1}`}
      </div>
      {renderStatRow("Commendations", "commendations", player.commendations)}
      {renderStatRow("Demerits", "demerits", player.demerits)}
      {renderStatRow("Additional Burnout", "additional_burnout", player.additional_burnout)}
      {renderStatRow("Competency Level", "competency_level", player.competency_level)}
      {renderStatRow(
        "Max Competency Level",
        "max_competency_level",
        player.max_competency_level
      )}
      {renderStatRow("Reality Level", "reality_level", player.reality_level)}
      {renderStatRow("Max Reality Level", "max_reality_level", player.max_reality_level)}
      {renderStatRow("Anomaly Level", "anomaly_level", player.anomaly_level)}
      {renderStatRow("Max Anomaly Level", "max_anomaly_level", player.max_anomaly_level)}
      {player.qas?.length ? (
        player.qas.map((qa, qaIndex) => (
          <div className="qa-row" key={qa.id ?? `${qa.quality}-${qaIndex}`}>
            <div className="qa-label">{qa.quality}</div>
            {ifDMView || isSelectedPlayer ? (
              <div className="qa-controls">
                <button
                  type="button"
                  onClick={() => {
                    if (qa.id && player.id != null) {
                      updateQaQuality(player.id, qa.quality, -1);
                    }
                  }}
                  disabled={!qa.id || player.id == null}
                >
                  -
                </button>
                <span>
                  {qa.available_qas}/{qa.max_qas}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (qa.id && player.id != null) {
                      updateQaQuality(player.id, qa.quality, 1);
                    }
                  }}
                  disabled={!qa.id || player.id == null}
                >
                  +
                </button>
              </div>
            ) : (
              <div className="qa-controls">
                <span>
                  {qa.available_qas}/{qa.max_qas}
                </span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="image-meta">No qualities assigned.</div>
      )}
    </div>
  );
};

export default MissionPlayer;
