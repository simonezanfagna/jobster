// since SharedLayout is a parent route (see App.js), I use Outlet to render its child routes

//
/* import { Outlet } from "react-router-dom";
import { BigSidebar, Navbar, SmallSidebar } from "../../components";
import Wrapper from "../../assets/wrappers/SharedLayout";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";

export default function SharedLayout() {
  const { isLoadingUser } = useSelector((store) => store.user);

  return (
    <Wrapper>
      <main className="dashboard">
        <SmallSidebar />
        <BigSidebar />
        {isLoadingUser ? (
          <div className="loading_dashboard">
            <Loading center />
          </div>
        ) : (
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        )}
      </main>
    </Wrapper>
  );
} */

import { Outlet } from "react-router-dom";
import { BigSidebar, Navbar, SmallSidebar } from "../../components";
import Wrapper from "../../assets/wrappers/SharedLayout";

export default function SharedLayout() {
  return (
    <Wrapper>
      <main className="dashboard">
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
}
