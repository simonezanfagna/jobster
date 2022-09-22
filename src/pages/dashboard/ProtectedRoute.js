import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// evito che un utente possa accedere alla dashboard (tutto cio' che comprende lo SharedLayout) senza aver fatto l'accesso
// se l'utente non esiste lo reindirizzo alla pagina Landing
// se effettua l'accesso correttamente va alla dashboard
// questa funzione si attiva anche quando si effettua il logout in modo da essere reindirizzati alla landing page
export default function ProtectedRoute({ children }) {
  const { user } = useSelector((store) => store.user);

  if (!user) {
    return <Navigate to="landing" />;
  }
  return children;
}
