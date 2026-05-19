import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { useAuth } from "../hooks/useAuthContext";
import { createTicket } from "../services/ticketService";
import { authAPI } from "../services/authService";
import QRCode from "qrcode";
import "./eventDetail.css";

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: event, isLoading, isError, error } = useEvent(id);
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        cantidad: 1,
        nombre: "",
        whatsapp: "",
        email: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [qrCodeUrls, setQrCodeUrls] = useState([]);
    const DEFAULT_AUTO_PASSWORD = "123456789";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Función para autenticación automática
    const handleAutoAuth = async (email, nombre, whatsapp) => {
        console.log("=== INICIANDO AUTENTICACIÓN AUTOMÁTICA ===");
        console.log("Datos:", { email, nombre, whatsapp });
        try {
            console.log("Buscando cuenta existente por email...");
            const { exists } = await authAPI.checkEmailExists(email);
            console.log("Resultado de existencia de email:", exists);

            if (exists) {
                console.log("Email ya registrado, intentando iniciar sesión con contraseña fija...");
                try {
                    const loginResult = await authAPI.login(email, DEFAULT_AUTO_PASSWORD);
                    console.log("Login exitoso con cuenta existente:", loginResult);
                    login(loginResult.token, loginResult.user);
                    return loginResult.user;
                } catch (loginError) {
                    const loginErrorMessage = loginError.response?.data?.message || loginError.message;
                    console.error("Error iniciando sesión con cuenta existente:", loginErrorMessage);
                    throw new Error("Ya existe una cuenta con este email. Inicia sesión manualmente o restablece tu contraseña.");
                }
            }

            console.log("No existe cuenta previa, creando nueva cuenta con contraseña fija...");
            const registerResult = await authAPI.register({
                nombre: nombre,
                email: email,
                password: DEFAULT_AUTO_PASSWORD,
                celular: whatsapp
            });
            console.log("Registro exitoso:", registerResult);

            const loginResult = await authAPI.login(email, DEFAULT_AUTO_PASSWORD);
            console.log("Login después de registro exitoso:", loginResult);
            login(loginResult.token, loginResult.user);
            return loginResult.user;
        } catch (error) {
            console.error("Error en autenticación automática:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("=== INICIANDO PROCESO DE COMPRA ===");
        console.log("Usuario actual:", user);
        console.log("Datos del formulario:", formData);

        // Validación condicional según estado de login
        if (!user) {
            console.log("Usuario no logueado, validando campos del formulario...");
            if (!formData.nombre.trim() || !formData.whatsapp.trim() || !formData.email.trim()) {
                console.log("Validación fallida: faltan campos requeridos");
                alert("Por favor completa todos los campos: Nombre, WhatsApp y Email");
                return;
            }
            console.log("Validación exitosa");
        } else {
            console.log("Usuario logueado, usando datos del usuario");
        }

        setIsSubmitting(true);
        try {
            let currentUser = user;
            let ticketFormData = { ...formData };

            console.log("Iniciando proceso de compra de ticket...");
            console.log("Usuario actual:", user);
            console.log("Datos del formulario:", formData);

            // Si no hay usuario logueado, hacer autenticación automática
            if (!currentUser) {
                console.log("No hay usuario logueado, intentando autenticación automática...");
                try {
                    currentUser = await handleAutoAuth(formData.email, formData.nombre, formData.whatsapp);
                    console.log("Autenticación automática exitosa");
                } catch (authError) {
                    console.error("Error en autenticación automática:", authError);
                    alert(authError.message || "Error al crear cuenta automáticamente. Por favor regístrate manualmente primero.");
                    return;
                }
            } else {
                // Si está logueado, usar sus datos
                ticketFormData = {
                    cantidad: formData.cantidad,
                    nombre: user.nombre,
                    whatsapp: user.celular || "",
                    email: user.email
                };
                console.log("Usuario logueado, usando sus datos:", ticketFormData);
            }

            const ticketData = {
                eventId: parseInt(id),
                userId: currentUser.id,
                ...ticketFormData
            };

            console.log("Datos finales para crear ticket:", ticketData);
            console.log("Enviando petición a /tickets...");

            const response = await createTicket(ticketData);
            console.log("Respuesta de creación de ticket:", response);

            // Generar QR codes para cada ticket creado
            const tickets = Array.isArray(response.tickets) ? response.tickets : [response.ticket];
            const qrPromises = tickets?.map(async (ticket) => {
                const qrUrl = await QRCode.toDataURL(ticket.qrData);
                return qrUrl;
            });
            const qrUrls = await Promise.all(qrPromises);
            setQrCodeUrls(qrUrls);

            // Redirigir a /tickets después de un breve delay para mostrar el QR
            setTimeout(() => {
                navigate("/tickets");
            }, 2000);

        } catch (error) {
            console.error("Error creando ticket:", error);
            console.error("Detalles del error:", error.response?.data);
            console.error("Detalles del error:", error.response?.data);
            alert("Error al crear el ticket. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="event-detail-page">
                <div className="event-detail-loading">Cargando evento...</div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="event-detail-page">
                <div className="event-detail-error">
                    Ocurrió un error al cargar el evento: {error?.message}
                </div>
            </main>
        );
    }

    const eventDate = new Date(event.fecha);
    const formattedDate = eventDate.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const shortDate = eventDate.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
    const mapQuery = encodeURIComponent(`${event.direccion || ""} ${event.ciudad || ""}`);

    return (
        <main className="event-detail-page">
            <section className="event-detail-hero">
                <div className="event-detail-card">
                    <div className="event-detail-left">
                        <div className="event-detail-image" style={{ backgroundImage: `url(${event.imagen})` }}>
                            <span className="event-detail-badge">PRÓXIMO</span>
                        </div>

                        <div className="event-detail-info">
                            <div className="event-detail-top">
                                <p className="event-detail-meta">{shortDate} · {event.ciudad || "Ciudad"}</p>
                                <h1>{event.titulo}</h1>
                                <p className="event-detail-location">
                                    {event.direccion || "Dirección no disponible"}
                                </p>
                            </div>

                            <div className="event-detail-summary">
                                <div>
                                    <span>Organizador</span>
                                    <p>{event.organizador || "TicketApp"}</p>
                                </div>
                                <div>
                                    <span>Precio</span>
                                    <p>${event.precio?.toFixed(2) || "0.00"}</p>
                                </div>
                                <div>
                                    <span>Ciudad</span>
                                    <p>{event.ciudad || "--"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="event-detail-panel">
                        <div className="panel-header">
                            <div>
                                <p className="panel-label">Ticket App</p>
                                <h2>Obtener ticket</h2>
                            </div>
                            <div className="panel-icon">🎫</div>
                        </div>

                        {!user && (
                            <div className="auth-notice">
                                <p><strong>Nota:</strong> Si no tienes cuenta, se creará automáticamente con tus datos.</p>
                            </div>
                        )}

                        <form className="ticket-form" onSubmit={handleSubmit}>
                            <label>
                                Cantidad
                                <input
                                    type="number"
                                    name="cantidad"
                                    min="1"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                />
                            </label>

                            {user ? (
                                <div className="user-info-display">
                                    <p><strong>Comprando como:</strong> {user.nombre}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    {user.celular && <p><strong>WhatsApp:</strong> {user.celular}</p>}
                                </div>
                            ) : (
                                <>
                                    <label>
                                        Nombre
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Tu nombre"
                                            required
                                        />
                                    </label>
                                    <label>
                                        WhatsApp
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            placeholder="+54 9 11 1234-5678"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ejemplo@mail.com"
                                            required
                                        />
                                    </label>
                                </>
                            )}

                            <button type="submit" className="panel-button" disabled={isSubmitting}>
                                {isSubmitting ? "CREANDO TICKET..." : "QUIERO MI TICKET"}
                            </button>

                            {qrCodeUrls.length > 0 && (
                                <div className="qr-preview">
                                    <p>{qrCodeUrls.length} Ticket{qrCodeUrls.length > 1 ? 's' : ''} creado{qrCodeUrls.length > 1 ? 's' : ''}! Redirigiendo...</p>
                                    <div className="qr-codes-container">
                                        {qrCodeUrls?.map((qrUrl, index) => (
                                            <div key={index} className="qr-code-item">
                                                <p>Ticket {index + 1}</p>
                                                <img src={qrUrl} alt={`QR Code del ticket ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>

                        <div className="panel-footer">
                            <p>Organiza:</p>
                            <strong>{event.organizador || "TicketApp"}</strong>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="event-detail-body">
                <div className="event-description-card">
                    <h2>Detalle del evento</h2>
                    <p>{event.descripcion || "No hay descripción disponible para este evento."}</p>
                </div>

                <div className="event-map-card">
                    <h2>Ubicación</h2>
                    <p>{event.direccion || "Dirección no disponible"}</p>
                    <div className="map-frame">
                        <iframe
                            title="Mapa del evento"
                            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default EventDetail;
