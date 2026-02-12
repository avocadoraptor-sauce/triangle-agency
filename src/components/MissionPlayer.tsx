import type { components } from "../../gen/schema";

type Player = components["schemas"]["PlayerSchema"];

type MissionPlayerProps = {
  player: Player;
  playerIndex: number;
  ifDMView: boolean;
  isSelectedPlayer: boolean;
  updateQaQuality: (playerId: number, quality: string, delta: number) => void | Promise<void>;
};

const MissionPlayer = ({
  player,
  playerIndex,
  ifDMView,
  isSelectedPlayer,
  updateQaQuality,
}: MissionPlayerProps) => {
  return (
    <div className="player-qas-card">
      <div className="player-name">
        {player.player_name ?? `Player ${player.id ?? playerIndex + 1}`}
      </div>
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
