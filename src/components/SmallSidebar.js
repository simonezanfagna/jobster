import Wrapper from "../assets/wrappers/SmallSidebar";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/user/userSlice";
import links from "../utils/links";
import { clearValues } from "../features/job/jobSlice";

export default function SmallSidebar(params) {
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
          isSidebarOpen ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button
            className="close-btn"
            onClick={() => dispatch(toggleSidebar())}
          >
            <FaTimes />
          </button>
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
                  onClick={() => {
                    dispatch(toggleSidebar());
                    handleNavLink(path, isEditing);
                  }}
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
