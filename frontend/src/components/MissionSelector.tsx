import { useEffect, useState } from "react";
import type { components } from "../../gen/schema"
import './dmview.css';
import axios from "axios";
import { Link } from "react-router";

type MissionList = components["schemas"]["MissionSummarySchema"][];

const MissionSelector = () => {
  const [missions, setMissions] = useState<MissionList>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data: response} = await axios.get(`/api/missions/`);
        console.log(response);
        setMissions(response);
      } catch(error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="wrap">
      <ul>
        {missions.map((missionSummary) => 
          <li>
            <Link to={{pathname: `/mission/${missionSummary.id}`}}>
              {missionSummary.mission_name}: {missionSummary.description}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MissionSelector;
