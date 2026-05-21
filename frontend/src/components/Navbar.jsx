import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuthContext";
import "./navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cierra el menú al hacer scroll en mobile
    useEffect(() => {
        if (menuOpen) setMenuOpen(false);
    }, [scrolled]);

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        closeMenu();
        logout();
        window.location.href = "/";
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="navbar-brand">
                <Link to="/" onClick={closeMenu}>
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

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
                <a href="/#events" className="link-btn" onClick={closeMenu}>
                    <i className="fa fa-music" />
                    SHOWS
                </a>

                {user ? (
                    <>
                        <Link to="/tickets" className="link-btn" onClick={closeMenu}>
                            <i className="fa fa-ticket" />
                            MIS ENTRADAS
                        </Link>
                        <div className="navbar-user">
                            <span className="user-name">{user?.nombre.toUpperCase()}</span>
                            <Link to="/profile" className="btn btn--profile" onClick={closeMenu}>
                                PERFIL
                            </Link>
                            <button className="btn btn--logout" onClick={handleLogout}>
                                SALIR
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn" onClick={closeMenu}>
                        INGRESAR
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;