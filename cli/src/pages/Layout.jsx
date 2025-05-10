import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  return (
    <div className="container mt-3">
      {location.pathname === "/app" ? "" : ""}
      <Outlet />
    </div>
  );
};

export default Layout;
