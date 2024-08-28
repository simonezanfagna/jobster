import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserData } from "../../features/user/userSlice";

// preventing a user from being able to access the dashboard (everything that includes the SharedLayout) without having logged in
// if the token does not exist, it will be redirected to the Landing page
// if the user logs in successfully it goes to the dashboard
// this function is also activated when the user logs out so as to be redirected to the landing page
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
