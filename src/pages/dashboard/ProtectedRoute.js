import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserData } from "../../features/user/userSlice";

// evito che un utente possa accedere alla dashboard (tutto cio' che comprende lo SharedLayout) senza aver fatto l'accesso
// se l'utente non esiste lo reindirizzo alla pagina Landing
// se effettua l'accesso correttamente va alla dashboard
// questa funzione si attiva anche quando si effettua il logout in modo da essere reindirizzati alla landing page
export default function ProtectedRoute({ children }) {
  const { token, user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user) {
      dispatch(getUserData());
    }
  }, [token, user, dispatch]);

  if (!token) {
    return <Navigate to="landing" />;
  }
  return children;
}
