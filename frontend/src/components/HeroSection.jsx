import { useState } from "react";
import { Link } from "react-router-dom";
import "./heroSection.css";

function HeroSection({ isAuthenticated, user }) {
    const [showOverlay, setShowOverlay] = useState(true);

    return (
        <section id="hero" className="hero">
            {/* Mitad izquierda — naranja */}
            <div className="hero__left">
                {showOverlay ? (
                    <>
                        <button className="hero__close" onClick={() => setShowOverlay(false)}>✕</button>

                        {isAuthenticated ? (
                            <>
                                <h1 className="hero__title">¡BIENVENIDO,<br />{user?.nombre?.toUpperCase()}!</h1>
                                <p className="hero__subtitle">BUSCAR EVENTOS</p>
                                <div className="hero__search">
                                    <input
                                        className="hero__input"
                                        type="text"
                                        placeholder="Ej: Damian Cordoba, La Renga, etc."
                                    />
                                    <button className="hero__search-btn" aria-label="Buscar">
                                        <i className="fa fa-search" aria-hidden="true" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="hero__title">GRACIAS POR<br />ELEGIRNOS!</h1>
                                <p className="hero__subtitle">BUSCAR EVENTOS</p>
                                <div className="hero__search">
                                    <input
                                        className="hero__input"
                                        type="text"
                                        placeholder="Ej: Damian Cordoba, La Renga, etc."
                                    />
                                    <button className="hero__search-btn" aria-label="Buscar">
                                        <i className="fa fa-search" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="hero__cta">
                                    <p className="hero__cta-text">¿Aún no estás registrado?</p>
                                    <Link to="/register" className="hero__link">
                                        REGISTRATE AHORA
                                    </Link>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <button className="hero__reopen" onClick={() => setShowOverlay(true)}>
                        BUSCAR EVENTOS
                    </button>
                )}
            </div>

            {/* Mitad derecha — foto */}
            <div className="hero__right" />
        </section>
    );
}

export default HeroSection;