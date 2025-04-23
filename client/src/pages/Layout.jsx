import { Outlet, Link, useNavigate } from "react-router-dom";

const Layout = () => {
    const navigate = useNavigate();
    console.log(navigate);
    
    return (
        <>
            <button onClick={() => navigate(-1)}>назад</button>

            <Outlet />
        </>
    )
};

export default Layout;