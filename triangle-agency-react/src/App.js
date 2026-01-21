import { Client } from 'boardgame.io/react';
import { TriangleAgency} from './Game';

const App = Client({ game: TriangleAgency  });

export default App;