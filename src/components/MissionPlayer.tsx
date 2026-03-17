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
      | "additional_burnout",
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
      | "additional_burnout",
    value: number | null | undefined
  ) => (
    <div className="detail-row" key={stat}>
      <div className="detail-label">{label}</div>
      {canUpdatePlayer ? (
        <div className="value-controls">
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
        <div className="value-controls">
          <span>{value ?? 0}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="player-sheet">
      <div className="player-sheet-columns">
        <div>
          <h3 className="section-heading">Player Details</h3>
          <div className="detail-row">
            <div className="detail-label">Player Name</div>
            <div className="detail-value">{player.player_name ?? `Player ${player.id ?? playerIndex + 1}`}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Missions</div>
            <div className="detail-value">
              {player.missions?.length ? player.missions.join(", ") : "None"}
            </div>
          </div>
          {renderStatRow("Commendations", "commendations", player.commendations)}
          {renderStatRow("Demerits", "demerits", player.demerits)}
          {renderStatRow("Additional Burnout", "additional_burnout", player.additional_burnout)}
        </div>

        <div>
          <h3 className="section-heading">Quality Assurance</h3>
          {player.qas?.length ? (
            player.qas.map((qa, qaIndex) => (
              <div className="detail-row" key={qa.id ?? `${qa.quality}-${qaIndex}`}>
                <div className="detail-label">{qa.quality}</div>
                {ifDMView || isSelectedPlayer ? (
                  <div className="value-controls">
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
                  <div className="value-controls">
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
      </div>
    </div>
  );
};

export default MissionPlayer;
