import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import "./register.css";

export default function Register() {
    const navigate = useNavigate();
    const { mutate: register, isPending, error } = useRegister();

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        emailRepeat: "",
        password: "",
        dni: "",
        celular: "",
        fecha_nacimiento: "",
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";
        if (!formData.apellido.trim()) errors.apellido = "El apellido es requerido";
        if (!formData.email.trim()) errors.email = "El email es requerido";
        if (formData.email !== formData.emailRepeat) errors.emailRepeat = "Los emails no coinciden";
        if (formData.password.length < 6) errors.password = "Mínimo 6 caracteres";
        if (!formData.dni.trim()) errors.dni = "El DNI es requerido";
        if (!formData.celular.trim()) errors.celular = "El celular es requerido";
        if (!formData.fecha_nacimiento) errors.fecha_nacimiento = "La fecha es requerida";
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        const { emailRepeat, ...dataToSend } = formData;
        register(dataToSend, {
            onSuccess: () => navigate("/login"),
        });
    };

    const fields = [
        { name: "nombre", label: "Nombre", type: "text", col: 1 },
        { name: "apellido", label: "Apellido", type: "text", col: 1 },
        { name: "email", label: "Correo electrónico", type: "email", col: 2 },
        { name: "emailRepeat", label: "Repetir correo", type: "email", col: 2 },
        { name: "password", label: "Contraseña", type: "password", col: 2 },
        { name: "dni", label: "DNI", type: "text", col: 1 },
        { name: "celular", label: "Celular", type: "tel", col: 1 },
        { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", col: 2 },
    ];

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-header">
                    <span className="register-tag">NUEVA CUENTA</span>
                    <h1 className="register-title">REGISTRARSE</h1>
                    <p className="register-sub">Completá tus datos para continuar</p>
                </div>

                {error && (
                    <div className="register-error" role="alert">
                        <span className="register-error__icon">!</span>
                        {error.response?.data?.message || "Ocurrió un error en el registro. Intentá de nuevo."}
                    </div>
                )}

                <form className="register-form" onSubmit={handleSubmit} noValidate>
                    <div className="register-fields">
                        {fields.map(({ name, label, type, col }) => (
                            <div
                                className={`field-group ${col === 2 ? "field-group--full" : ""}`}
                                key={name}
                            >
                                <input
                                    className={`field-input ${validationErrors[name] ? "field-input--error" : ""}`}
                                    id={name}
                                    name={name}
                                    type={type}
                                    placeholder=" "
                                    value={formData[name]}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    required
                                />
                                <label className="field-label" htmlFor={name}>
                                    {label}
                                </label>
                                <span className="field-line" />
                                {validationErrors[name] && (
                                    <span className="field-error">{validationErrors[name]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        className="register-btn"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="register-btn__spinner-wrap">
                                <span className="register-btn__spinner" />
                                Creando cuenta...
                            </span>
                        ) : (
                            <>
                                Crear cuenta
                                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <p className="register-login">
                    ¿Ya tenés cuenta?{" "}
                    <Link to="/login" className="register-link">Ingresá acá</Link>
                </p>

            </div>
        </div>
    );
}