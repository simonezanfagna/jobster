// visto che SharedLayout e' una route parent (vedi App.js), uso Outlet per renderizzare i suoi child route
// es. quando l' URL e' "/all-jobs" allora renderizza il componente AllJobs
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
