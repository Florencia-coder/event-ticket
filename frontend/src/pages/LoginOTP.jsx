import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVerifyOTPCode, useSendOTPCode } from '../hooks/useAuth';
import './loginOTP.css';

function LoginOTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [code, setCode] = useState('');
    const [showResend, setShowResend] = useState(false);
    const [timer, setTimer] = useState(0);

    const { mutate: verifyCode, isPending: isVerifying, error } = useVerifyOTPCode();
    const { mutate: resendCode, isPending: isResending } = useSendOTPCode();

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setCode(value);

        // Auto-submit cuando se ingrese el código completo
        if (value.length === 4) {
            handleVerify(value);
        }
    };

    const handleVerify = (codeToVerify = code) => {
        if (!codeToVerify || codeToVerify.length !== 4) return;

        verifyCode(
            { email, code: codeToVerify },
            {
                onSuccess: () => {
                    navigate('/');
                },
            }
        );
    };

    const handleResendCode = () => {
        resendCode(email, {
            onSuccess: () => {
                setShowResend(false);
                setTimer(60);
                // Iniciar el temporizador
                const interval = setInterval(() => {
                    setTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setShowResend(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            },
        });
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
                    <h1 className="login-otp-title">INGRESA TU CÓDIGO</h1>
                    <p className="login-otp-subtitle">
                        Hemos enviado un código de 4 dígitos a<br />
                        <strong>{email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="login-otp-error">
                        {error.response?.data?.message || 'Código inválido'}
                    </div>
                )}

                <div className="login-otp-form">
                    <input
                        className="otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength="4"
                        placeholder="0000"
                        value={code}
                        onChange={handleInputChange}
                        autoFocus
                    />
                    <p className="otp-hint">Ingresa los 4 dígitos</p>
                </div>

                <button
                    className="otp-verify-btn"
                    onClick={() => handleVerify()}
                    disabled={code.length !== 4 || isVerifying}
                >
                    {isVerifying ? 'Verificando...' : 'Verificar Código'}
                </button>

                {showResend ? (
                    <button
                        className="otp-resend-btn"
                        onClick={handleResendCode}
                        disabled={isResending}
                    >
                        {isResending ? 'Reenviando...' : 'Reenviar Código'}
                    </button>
                ) : timer > 0 && (
                    <p className="otp-timer">
                        Puedes reenviar el código en {timer} segundos
                    </p>
                )}

                <p className="otp-footer">
                    ¿Prefieres usar contraseña? <a href="#" onClick={(e) => { e.preventDefault(); handleGoBack(); }}>Cambiar método</a>
                </p>
            </div>
        </div>
    );
}

export default LoginOTP;
