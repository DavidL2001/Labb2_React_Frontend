import { NavLink } from "react-router-dom"
import "./Navbar.scss";


const Navbar = () => {
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar__logo">David´s FilmVault</NavLink>

            <ul className="navbar__links">
                <li>
                    <NavLink to="/" className={({ isActive}) => isActive ? "active" : ""}
                    >Home</NavLink>
                </li>
                <li>
                    <NavLink to="/favorites" className={({ isActive}) => isActive ? "active" : ""}
                    >Favorites</NavLink>
                </li>

                <li>

                    <NavLink to="/profile" className={({ isActive}) => isActive ? "active" : ""}
                    >Profile</NavLink>
                </li>

                </ul>
        </nav>
    );
};
export default Navbar;
