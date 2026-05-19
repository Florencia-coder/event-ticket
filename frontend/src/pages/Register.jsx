import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiar error del campo al escribir
        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: "",
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.nombre.trim()) {
            errors.nombre = "El nombre es requerido";
        }

        if (!formData.apellido.trim()) {
            errors.apellido = "El apellido es requerido";
        }

        if (!formData.email.trim()) {
            errors.email = "El email es requerido";
        }

        if (formData.email !== formData.emailRepeat) {
            errors.emailRepeat = "Los emails no coinciden";
        }

        if (formData.password.length < 6) {
            errors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!formData.dni.trim()) {
            errors.dni = "El DNI es requerido";
        }

        if (!formData.celular.trim()) {
            errors.celular = "El celular es requerido";
        }

        if (!formData.fecha_nacimiento) {
            errors.fecha_nacimiento = "La fecha de nacimiento es requerida";
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar formulario
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        // Preparar datos para enviar (sin emailRepeat)
        const { emailRepeat, ...dataToSend } = formData;

        register(dataToSend, {
            onSuccess: () => {
                // Redirigir al login tras registro exitoso
                navigate("/login");
            },
        });
    };

    const fields = [
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "apellido", label: "Apellido", type: "text" },
        { name: "email", label: "Correo electrónico", type: "email" },
        { name: "emailRepeat", label: "Repetir correo electrónico", type: "email" },
        { name: "password", label: "Contraseña", type: "password" },
        { name: "dni", label: "DNI", type: "text" },
        { name: "celular", label: "Celular", type: "tel" },
        { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date" },
    ];

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <span className="register-tag">NUEVA CUENTA</span>
                    <h1 className="register-title">REGISTRARSE</h1>
                    <p className="register-sub">
                        Completá tus datos para continuar
                    </p>
                </div>

                {error && (
                    <div className="register-error">
                        {error.response?.data?.message || "Error en el registro"}
                    </div>
                )}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-fields">
                        {fields.map(({ name, label, type }) => (
                            <div className="field-group" key={name}>
                                <input
                                    className={`field-input ${validationErrors[name] ? "field-input--error" : ""}`}
                                    id={name}
                                    name={name}
                                    type={type}
                                    placeholder=" "
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required
                                />
                                <label className="field-label" htmlFor={name}>
                                    {label}
                                </label>
                                <span className="field-line" />
                                {validationErrors[name] && (
                                    <span className="field-error">
                                        {validationErrors[name]}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        className="register-btn"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Creando cuenta..." : "Crear cuenta"}
                        <svg
                            className="btn-arrow"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </form>

                <p className="register-login">
                    ¿Ya tenés cuenta?{" "}
                    <a href="/login" className="register-link">
                        Ingresá acá
                    </a>
                </p>
            </div>

            <div className="register-deco" aria-hidden="true">
                <div className="deco-circle deco-circle--1" />
                <div className="deco-circle deco-circle--2" />
                <div className="deco-line" />
            </div>
        </div>
    );
}
