import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { TriangleAgency } from '../Game';

const initialState = typeof TriangleAgency.setup === 'function'
  ? TriangleAgency.setup()
  : { public: { players: [] } };

const safeArray = (value) => (Array.isArray(value) ? value : []);

const PlayerView = () => {
  const { index } = useParams();
  const playerIndex = Number(index);
  const player = safeArray(initialState.public?.players)[playerIndex];

  if (!player) {
    return (
      <main className="view">
        <header className="view-header">
          <div>
            <p className="eyebrow">Triangle Agency</p>
            <h1>Player Dossier</h1>
            <p className="subtitle">No player data found for this slot.</p>
          </div>
        </header>
        <Link className="action-link" to="/public">
          Back to public dossier
        </Link>
      </main>
    );
  }

  return (
    <main className="view">
      <header className="view-header">
        <div>
          <p className="eyebrow">Agent Profile</p>
          <h1>{player.name || `Operative ${playerIndex + 1}`}</h1>
          <p className="subtitle">{player.anomaly || 'Anomaly not yet disclosed.'}</p>
        </div>
        <div className="badge secondary">
          <span>Competency</span>
          <strong>{player.competency || 'TBD'}</strong>
        </div>
      </header>

      <section className="card-grid">
        <article className="card">
          <h2>Reality</h2>
          <p className="body">{player.reality || 'Reality signature pending.'}</p>
          <h3 className="minor">Reality Connection Power</h3>
          <p className="body">
            {player.realityConnectionPower || 'No connection power listed.'}
          </p>
        </article>

        <article className="card">
          <h2>Requisition</h2>
          <p className="body">
            {player.requisition || 'No requisition recorded yet.'}
          </p>
        </article>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Qualities & Uses</h2>
          <ul className="list">
            {safeArray(player.qas).map((qa, qaIndex) => (
              <li key={`${qa.quality}-${qaIndex}`}>
                <span>{qa.quality || `Quality ${qaIndex + 1}`}</span>
                <strong>{qa.uses ?? 0} uses</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Powers</h2>
          <div className="stack">
            {safeArray(player.powers).map((power, powerIndex) => (
              <div className="power" key={`power-${powerIndex}`}>
                <div className="power-header">
                  <h3>Power {powerIndex + 1}</h3>
                </div>
                <div className="power-grid">
                  <div>
                    <p className="label">Success</p>
                    <p>{power.success || 'Pending'}</p>
                  </div>
                  <div>
                    <p className="label">Extra Success</p>
                    <p>{power.extraSuccess || 'Pending'}</p>
                  </div>
                  <div>
                    <p className="label">Fail</p>
                    <p>{power.fail || 'Pending'}</p>
                  </div>
                </div>
                <div className="questions">
                  <p className="label">Questions</p>
                  <ul className="list compact">
                    {safeArray(power.question).map((question, questionIndex) => (
                      <li key={`q-${powerIndex}-${questionIndex}`}>
                        <span>{question.answer || 'Unanswered'}</span>
                        <strong>{question.count ?? 0}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
};

export default PlayerView;
