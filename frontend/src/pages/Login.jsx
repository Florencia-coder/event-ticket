import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Simulá acá tu llamada real a la API
            // const res = await api.checkEmail(email);
            await new Promise((r) => setTimeout(r, 1000)); // ← reemplazá por tu fetch

            navigate('/login/options', { state: { email } });
        } catch (err) {
            setError(err?.message || 'Ocurrió un error. Intentá de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">

            <div className="login__card">
                <h1 className="login__title">INGRESAR</h1>
                <p className="login__subtitle">Ingresá tu correo para continuar</p>

                {error && (
                    <div className="login__error" role="alert">
                        <span className="login__error-icon">!</span>
                        {error}
                    </div>
                )}

                <form className="login__form" onSubmit={handleEmailSubmit} noValidate>
                    <div className="login__field">
                        <label className="login__label" htmlFor="email">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            className={`login__input ${error ? 'login__input--error' : ''}`}
                            type="email"
                            name="email"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            required
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login__btn-ingresar"
                        disabled={isLoading || !email}
                    >
                        {isLoading ? (
                            <span className="login__spinner-wrap">
                                <span className="login__spinner" />
                                Verificando...
                            </span>
                        ) : (
                            'CONTINUAR'
                        )}
                    </button>
                </form>

                <div className="login__divider-wrap">
                    <hr className="login__divider" />
                    <span className="login__divider-text">¿Sos nuevo?</span>
                    <hr className="login__divider" />
                </div>

                <div className="login__register">
                    <p className="login__register-text">
                        Sé parte de Ticket y aprovechá<br />todos sus beneficios.
                    </p>
                    <Link to="/register" className="login__btn-registrarse">
                        REGISTRARSE
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Login;