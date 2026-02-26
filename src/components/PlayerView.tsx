/* https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/ */
import { useEffect, useState } from "react";
import type { components } from "../../gen/schema";
import "./dmview.css";
import axios from "axios";
import { useParams } from "react-router";
import useWebSocket from "react-use-websocket";
import MissionRecord from "./MissionRecord";

type Mission = components["schemas"]["MissionSchema"];

type PathParams = Partial<{
  missionId: string;
  playerId: string;
}>;

const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const SOCKET_URL = `${protocol}://${window.location.hostname}:${window.location.port}/ws/mission/`;

const PlayerView = () => {
  const [mission, setMission] = useState<Mission>();
  const { missionId } = useParams<PathParams>();
  const { lastMessage } = useWebSocket<Mission>(`${SOCKET_URL}${missionId}/`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(`/api/mission/${missionId}/`);
        console.log(response);
        setMission(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [missionId]);

  useEffect(() => {
    if (lastMessage?.data !== undefined) {
      setMission(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  return <MissionRecord mission={mission} ifDMView={false} />;
};

export default PlayerView;
