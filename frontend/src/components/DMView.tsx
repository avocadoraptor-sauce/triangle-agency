/* https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/ */
import type { components } from "../../gen/schema"
import './dmview.css';
import axios from "axios";

type Mission = components["schemas"]["MissionSchema"];
type UpdateData = Partial<{
  chaos_pool: number;
  loose_ends: number;
  description: string;
}>

type DMViewProps = {
  mission: Mission | null;
}

const DMView = (props: DMViewProps) => {
  const {mission} = props;
  const hasMission = Boolean(mission);
  const updateMission = async (update_data: UpdateData) => {
    try {
      /*
        * TODO: the app should show a list of missions and the one we pick
        * should be the one we load.
        */
      const {data: response} = await axios.patch("api/mission/1/", update_data);
      console.log(response);
    } catch(error) {
      console.error(error);
    }
  };
  return (
    <div className="wrap">
      <header>
        <div>
          <div className="title">Private Eye Dossier</div>
          <h1>Mission Public Record</h1>
        </div>
        <div className="stamp">Classified</div>
      </header>

      <section className="dossiers">
        <article className="dossier">
          <div className="dossier-header">
            <div>
              <div className="mission-id">
                Case File {mission?.id ?? "—"}
              </div>
              <div>{mission?.mission_name ?? "Unassigned Mission"}</div>
            </div>
            <div className="status">Public Brief</div>
          </div>
          <div className="grid">
            <div className="panel">
              <h3>Mission Name</h3>
              <div className="metric">{mission?.mission_name ?? "Unassigned"}</div>
            </div>
            <div className="panel">
              <h3>Chaos Pool</h3>
              <div className="metric">{ mission?.chaos_pool ?? "—" }</div>
              <button id="inc-chaos" onClick={() => updateMission({chaos_pool: 1})} disabled={!hasMission}>+</button>
              <button id="dec-chaos" onClick={() => updateMission({chaos_pool: -1})} disabled={!hasMission}>-</button>
            </div>
            <div className="panel">
              <h3>Loose Ends</h3>
              <div className="metric">{ mission?.loose_ends ?? "—" }</div>
              <button id="inc-loose-ends" onClick={() => updateMission({loose_ends: 1})} disabled={!hasMission}>+</button>
              <button id="dec-loose-ends" onClick={() => updateMission({loose_ends: -1})} disabled={!hasMission}>-</button>
            </div>
            <div className="panel">
              <h3>Evidence Image</h3>
              <div className="image-block">
                {mission?.url ? (
                  <>
                    <img src={mission.url} alt="Evidence" style={{width: "100%", border: "1px solid rgba(90, 79, 67, 0.3)"}} />
                    <div className="image-meta">Archive: {mission.url}</div>
                  </>
                ) : (
                  <div className="image-meta">No image on file.</div>
                )}
              </div>
            </div>
            <div className="panel">
              <h3>Description</h3>
              <div className="description">
                { mission?.description ?? "No description recorded." }
              </div>
            </div>
            <div className="panel">
              <h3>Players</h3>
              <div className="description">
                {mission?.players?.length ? mission.players.join(", ") : "No operatives assigned."}
              </div>
            </div>
          </div>
        </article>
      </section>
      <footer>Triangle Agency Bureau - Public Records</footer>
    </div>
  );
};

export default DMView;
