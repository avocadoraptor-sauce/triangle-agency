import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Client } from 'boardgame.io/react';
import { TriangleAgency } from '../Game';
import PublicView from './PublicView';
import PlayerView from './PlayerView';

const DMClient = Client({ game: TriangleAgency,
  board: DMView
 });

const PlayerClient = Client({ game: TriangleAgency,
  board: PlayerView
 });


const AppShell = () => (
  <BrowserRouter>
    <div className="app">
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-mark">△</span>
          <div>
            <p>Triangle Agency</p>
            <span>Operative Console</span>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/dm">DM Dossier</Link>
          <Link to="/player/0">Player Dossier</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/dm" element={<DMClient/>} />
        <Route path="/player/:index" element={<PlayerClient />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default AppShell;
