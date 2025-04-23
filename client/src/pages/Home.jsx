import { Outlet, Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <nav>
                <h1>Главная</h1>
                <ul>
                    <li>
                        <Link to="/pamps">Насосы</Link>
                    </li>
                    <li>
                        <Link to="/valves">Клапаны</Link>
                    </li>
                    <li>
                        <Link to="/meters">Датчики</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Home;