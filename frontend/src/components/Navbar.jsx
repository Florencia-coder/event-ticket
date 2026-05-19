import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuthContext";
import "./navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="navbar-brand">
                <Link to="/">
                    {/* Logo con fondo naranja para que destaque sobre el marino */}
                    <div className="logo-wrapper">
                        <img
                            src="/assets/images/logo-temporal.webp"
                            alt="logo"
                            className="logo"
                        />
                    </div>
                </Link>
                <span className="brand-divider">|</span>
                <span className="brand-name">TICKET</span>
            </div>

            {/* Botón hamburguesa (solo visible en mobile por CSS) */}
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
                <a href="/#events" className="link-btn">
                    <i class="fa fa-music"></i>
                    SHOWS
                </a>

                {user ? (
                    <>
                        <Link to="/tickets" className="link-btn">
                            <i className="fa fa-ticket"></i>
                            MIS ENTRADAS
                        </Link>
                        <div className="navbar-user">
                            <span className="user-name">{user?.nombre.toUpperCase()}</span>
                            <Link to="/profile" className="btn btn--profile">
                                PERFIL
                            </Link>
                            <button className="btn btn--logout" onClick={handleLogout}>
                                SALIR
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn">
                        INGRESAR
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
