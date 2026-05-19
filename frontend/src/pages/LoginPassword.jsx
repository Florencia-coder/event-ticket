import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import './login.css';
import './loginOTP.css';

function LoginPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const [email, setEmail] = useState(emailFromState);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { mutate: login, isLoading } = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setErrorMessage('Ingresa un email válido.');
            return;
        }
        if (!password) {
            setErrorMessage('Ingresa tu contraseña.');
            return;
        }

        setErrorMessage('');
        login(
            { email, password },
            {
                onSuccess: () => {
                    navigate('/');
                },
                onError: (error) => {
                    setErrorMessage(error.response?.data?.message || 'Error al iniciar sesión.');
                },
            }
        );
    };

    const handleGoBack = () => {
        navigate('/login/options', { state: { email } });
    };

    return (
        <div className="login-otp-page">
            <div className="login-otp-card">
                <button className="otp-back-btn" onClick={handleGoBack}>
                    ← Volver
                </button>

                <div className="login-otp-header">
                    <h1 className="login-otp-title">INGRESAR CON CONTRASEÑA</h1>
                    <p className="login-otp-subtitle">
                        Ingresa tu contraseña para <strong>{email}</strong>
                    </p>
                </div>

                {errorMessage && <div className="login-otp-error">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="login-otp-form">
                    <input
                        className="login__input"
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login__input"
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="otp-verify-btn" disabled={isLoading}>
                        {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
                    </button>
                </form>

                <p className="otp-footer">
                    ¿No querés usar contraseña? <a href="#" onClick={(e) => { e.preventDefault(); handleGoBack(); }}>Volver a opciones</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPassword;
