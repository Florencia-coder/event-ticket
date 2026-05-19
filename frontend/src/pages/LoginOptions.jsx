import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSendOTPCode } from '../hooks/useAuth';
import './loginOptions.css';

function LoginOptions() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [localEmail, setLocalEmail] = useState(email);
    const { mutate: sendCode, isPending: isSending, error } = useSendOTPCode();

    const handlePasswordLogin = () => {
        if (!localEmail) return;
        navigate('/login/password', { state: { email: localEmail } });
    };

    const handleOTPLogin = () => {
        if (!localEmail) return;
        sendCode(localEmail, {
            onSuccess: () => {
                navigate('/login/otp', { state: { email: localEmail } });
            },
        });
    };

    return (
        <div className="login-options-page">
            <div className="login-options-card">
                <div className="login-options-header">
                    <h1 className="login-options-title">ELIGE TU MÉTODO DE ACCESO</h1>
                    {localEmail && (
                        <p className="login-options-email">{localEmail}</p>
                    )}
                </div>

                {error && (
                    <div className="login-options-error">
                        {error.response?.data?.message || 'Error'}
                    </div>
                )}

                <div className="login-options-methods">
                    {/* Opción 1: Contraseña */}
                    <div className="method-card">
                        <div className="method-icon">🔐</div>
                        <h2 className="method-title">Contraseña</h2>
                        <p className="method-description">
                            Inicia sesión con tu contraseña
                        </p>
                        <button
                            className="method-btn"
                            onClick={handlePasswordLogin}
                        >
                            Continuar con Contraseña
                        </button>
                    </div>

                    {/* Opción 2: Código OTP */}
                    <div className="method-card">
                        <div className="method-icon">📧</div>
                        <h2 className="method-title">Código por Email</h2>
                        <p className="method-description">
                            Recibirás un código de 4 dígitos
                        </p>
                        <button
                            className="method-btn method-btn--otp"
                            onClick={handleOTPLogin}
                            disabled={isSending}
                        >
                            {isSending ? 'Enviando código...' : 'Continuar con Código'}
                        </button>
                    </div>
                </div>

                <p className="login-options-footer">
                    ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                </p>
            </div>
        </div>
    );
}

export default LoginOptions;
