import React, { useEffect, useState } from 'react';
import DMView from './components/DMView';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import PlayerView from './components/PlayerView';
import MissionSelector from './components/MissionSelector';
import MissionLanding from './components/MissionLanding';

function App() {
  const [mission, setMission] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MissionSelector/>}/>
        <Route path="/mission/:missionId" element={<MissionLanding/>}/>
        <Route path="/mission/:missionId/dm" element={<DMView/>}/>
        <Route path="/mission/:missionId/player/:playerId" element={<PlayerView/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
