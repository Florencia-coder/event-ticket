import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            alert('Email inválido');
            return;
        }
        // Ir directamente a LoginOptions con el email
        navigate('/login/options', { state: { email } });
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login">
            <h1 className="login__title">INGRESAR</h1>

            <form onSubmit={handleEmailSubmit}>
                <input
                    className="login__input"
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                />

                <button type="submit" className="login__btn-ingresar">
                    CONTINUAR
                </button>
            </form>

            <hr className="login__divider" />

            <div className="login__register">
                <p className="login__register-text">
                    ¿Todavía no te registraste?<br />
                    Sé parte de Jamp, y aprovechá<br />
                    sus beneficios.
                </p>
                <button
                    className="login__btn-registrarse btn"
                    onClick={handleRegister}
                >
                    REGISTRARSE
                </button>
            </div>
        </div>
    );
}

export default Login;