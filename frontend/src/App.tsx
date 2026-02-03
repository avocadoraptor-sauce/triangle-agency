import React, { useEffect, useState } from 'react';
import DMView from './components/DMView';
import axios from 'axios';
import './App.css';

function App() {
  const [mission, setMission] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        /*
         * TODO: the app should show a list of missions and the one we pick
         * should be the one we load.
         */
        const {data: response} = await axios.get("api/mission/1");
        console.log(response);
        setMission(response);
      } catch(error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      {mission === null ? "" : <DMView mission={mission}/>}
    </div>
  );
}

export default App;
