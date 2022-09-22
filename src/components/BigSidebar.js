import Wrapper from "../assets/wrappers/BigSidebar";
import Logo from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toggleSidebar } from "../features/user/userSlice";
import links from "../utils/links";

export default function BigSidebar(params) {
  const { isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen
            ? "sidebar-container "
            : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <div className="nav-links">
            {links.map((link) => {
              const { text, path, id, icon } = link;
              return (
                // A <NavLink> is a special kind of <Link> that knows whether or not it is "active".
                // molto utile in questo caso per aggiungere la classe "nav-link active" quando e' attivo
                <NavLink
                  end
                  to={path}
                  key={id}
                  onClick={() => dispatch(toggleSidebar())}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <span className="icon">{icon}</span>
                  {text}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
