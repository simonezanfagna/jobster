// file utile per evitare che si creino troppe righe di import nel componente App.js in cui verranno importati
// i componenti che fanno parte della cartella pages

import ProtectedRoute from "./dashboard/ProtectedRoute";
import Error from "./Error";
import Landing from "./Landing";
import Register from "./Register";

export { Landing, Error, Register, ProtectedRoute };
