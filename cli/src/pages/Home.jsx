import { Outlet, Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <nav>
                <h1>Главная</h1>
                <ul>
                    <li>
                        <Link to="/app/pamps">Насосы</Link>
                    </li>
                    <li>
                        <Link to="/app/valves">Клапаны</Link>
                    </li>
                    <li>
                        <Link to="/app/periods">Периоды</Link>
                    </li>
                    <li>
                        <Link to="/app/meters">Датчики</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Home;