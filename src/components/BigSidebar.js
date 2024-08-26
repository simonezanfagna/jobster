import Wrapper from "../assets/wrappers/BigSidebar";
import Logo from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toggleSidebar } from "../features/user/userSlice";
import links from "../utils/links";
import { clearValues } from "../features/job/jobSlice";

export default function BigSidebar(params) {
  const { isSidebarOpen } = useSelector((store) => store.user);
  const { isEditing } = useSelector((store) => store.job);

  const dispatch = useDispatch();

  const handleNavLink = (path, isEditing) => {
    if (path !== "add-job" && isEditing) {
      dispatch(clearValues());
    }
  };

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
                <NavLink
                  end
                  to={path}
                  key={id}
                  /* onClick={() => dispatch(toggleSidebar())} */
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={() => {
                    handleNavLink(path, isEditing);
                  }}
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
