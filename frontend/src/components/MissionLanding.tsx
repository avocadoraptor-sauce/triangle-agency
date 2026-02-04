import { useEffect, useState } from "react";
import type { components } from "../../gen/schema"
import './dmview.css';
import { generatePath, Link, useParams } from "react-router";
import axios from "axios";
import QRCode from "react-qr-code";

type Mission = components["schemas"]["MissionSchema"];

const MissionLanding = () => {
  const [mission, setMission] = useState<Mission>();
  const { missionId } = useParams<string>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data: response} = await axios.get(`/api/mission/${missionId}`);
        console.log(response);
        setMission(response);
      } catch(error) {
        console.error(error);
      }
    }
    fetchData();
  }, [missionId]);

  const domain = window.location.origin;

  const dmURL = generatePath("/mission/:missionId/dm", {
    missionId: missionId ?? null
  });

  const playerLinks = mission?.players.map((player) => ({
    path: generatePath("/mission/:missionId/player/:playerId", {
        missionId: missionId ?? null,
        playerId: `${player.id ?? null}`,
    }),
    name: `${player.player_name ?? null}`
  }));


  return (
    <div className="wrap">
        <h3>DM:</h3>
            <Link to={dmURL}>
                <QRCode value={`${domain}${dmURL}`}/>
            </Link>
        <h3>Players:</h3>
        <table>
            {playerLinks?.map((playerLink) => 
            <tr>
                <td>
                    {playerLink.name}
                </td>
                <td>
                    <Link to={playerLink.path}>
                        <QRCode value={`${domain}${playerLink.path}`}/>
                    </Link>
                </td>
            </tr>
            )}
        </table>
    </div>
  );
};

export default MissionLanding;
