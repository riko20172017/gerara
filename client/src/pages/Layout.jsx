import { Outlet, Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" ? (
        ""
      ) : (
        <button onClick={() => navigate(-1)}>назад</button>
      )}
      <Outlet />
    </>
  );
};

export default Layout;
