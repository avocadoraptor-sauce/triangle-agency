import React from 'react';
import { Link } from 'react-router-dom';
import { TriangleAgency } from '../Game';

const initialState = typeof TriangleAgency.setup === 'function'
  ? TriangleAgency.setup()
  : { public: { players: [] } };

const safeArray = (value) => (Array.isArray(value) ? value : []);

const PublicView = () => {
  const publicData = initialState.public || {};
  const players = safeArray(publicData.players);

  return (
    <main className="view">
      <header className="view-header">
        <div>
          <p className="eyebrow">Triangle Agency</p>
          <h1>Public Dossier</h1>
          <p className="subtitle">
            Current overview for the field team. Share freely.
          </p>
        </div>
        <div className="badge">
          <span>Chaos Pool</span>
          <strong>{publicData.chaosPool ?? 0}</strong>
        </div>
      </header>

      <section className="card-grid">
        <article className="card">
          <h2>Loose Ends</h2>
          <p className="metric">{publicData.looseEnds ?? 0}</p>
          <p className="muted">Open threads the agency expects you to tug on.</p>
        </article>

        <article className="card">
          <h2>Briefing</h2>
          <p className="body">
            {publicData.description || 'No public description has been set yet.'}
          </p>
          <div className="image-shell">
            {publicData.image?.url ? (
              <img
                src={publicData.image.url}
                alt={publicData.image.assetId || 'Public scene'}
              />
            ) : (
              <div className="image-placeholder">
                <span>Scene image pending</span>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="players">
        <div className="section-title">
          <h2>Operative Roster</h2>
          <p className="muted">Click into a player to view their briefing.</p>
        </div>
        <div className="card-grid">
          {players.length === 0 && (
            <article className="card empty">
              <p>No player data has been entered yet.</p>
            </article>
          )}
          {players.map((player, index) => (
            <article className="card" key={`${player.name}-${index}`}>
              <h3>{player.name || `Operative ${index + 1}`}</h3>
              <p className="muted">{player.anomaly || 'Anomaly unknown.'}</p>
              <div className="tag-row">
                <span>{player.competency || 'Competency TBD'}</span>
                <span>{player.reality || 'Reality TBD'}</span>
              </div>
              <Link className="action-link" to={`/player/${index}`}>
                View Player Dossier
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PublicView;
