import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { getUserTickets, downloadTicketPDF, deleteTicket } from '../services/ticketService';
import { getEventById } from '../services/eventService';
import QRCode from 'qrcode';
import './tickets.css';

function Tickets() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [events, setEvents] = useState({});
    const [qrCodes, setQrCodes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDownloadPDF = async (ticketId) => {
        try {
            const pdfBlob = await downloadTicketPDF(ticketId);
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ticket-${ticketId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error descargando PDF:', error);
            alert('Error al descargar el PDF del ticket');
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este ticket? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await deleteTicket(ticketId, user.id);
            // Recargar los tickets después de eliminar
            const userTickets = await getUserTickets(user.id);
            setTickets(userTickets);
            alert('Ticket eliminado exitosamente');
        } catch (error) {
            console.error('Error eliminando ticket:', error);
            alert('Error al eliminar el ticket: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        const loadTickets = async () => {
            if (!user?.id) return;

            try {
                const userTickets = await getUserTickets(user.id);
                setTickets(userTickets);
                console.log({ userTickets });

                // Cargar datos de eventos únicos
                const uniqueEventIds = [...new Set(userTickets?.map(ticket => ticket.eventId))];
                const eventPromises = uniqueEventIds?.map(async (eventId) => {
                    const eventData = await getEventById(eventId);
                    return { id: eventId, data: eventData };
                });

                const eventResults = await Promise.all(eventPromises);
                const eventMap = {};
                eventResults.forEach(({ id, data }) => {
                    eventMap[id] = data;
                });
                setEvents(eventMap);

                // Generar QR codes para cada ticket
                const qrPromises = userTickets?.map(async (ticket) => {
                    const qrUrl = await QRCode.toDataURL(ticket.qrData);
                    return { id: ticket.id, qrUrl };
                });
                const qrResults = await Promise.all(qrPromises);
                console.log({ qrResults });

                const qrMap = {};
                qrResults.forEach(({ id, qrUrl }) => {
                    qrMap[id] = qrUrl;
                });
                setQrCodes(qrMap);

            } catch (err) {
                console.error('Error loading tickets:', err);
                setError('Error al cargar los tickets');
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [user?.id]);

    // Función para agrupar tickets por evento
    const groupTicketsByEvent = () => {
        const grouped = {};
        tickets.forEach(ticket => {
            const eventId = ticket.eventId;
            if (!grouped[eventId]) {
                grouped[eventId] = [];
            }
            grouped[eventId].push(ticket);
        });
        return grouped;
    };

    if (loading) return (
        <div className="tickets-page">
            <div className="tickets-container">
                <h1 className="tickets-title">MIS ENTRADAS</h1>
                <div className="tickets-content">
                    <div className="tickets-state">
                        <span>Cargando tus entradas...</span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="tickets-page">
            <div className="tickets-container">
                <h1 className="tickets-title">MIS ENTRADAS</h1>
                <div className="tickets-content">
                    <div className="tickets-state tickets-state--error">
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="tickets-page">
            <div className="tickets-container">
                <h1 className="tickets-title">MIS ENTRADAS</h1>
                <p className="tickets-subtitle">
                    Bienvenido, {user?.nombre}!
                </p>

                <div className="tickets-content">
                    {tickets.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
                            No tienes entradas compradas aún.
                        </p>
                    ) : (
                        <div className="events-container">
                            {Object.entries(groupTicketsByEvent())?.map(([eventId, eventTickets]) => {
                                const event = events[eventId] || {};
                                const dateValue = event.fecha;
                                const eventDate = dateValue ? new Date(dateValue) : null;
                                const formattedDate = eventDate instanceof Date && !Number.isNaN(eventDate.getTime())
                                    ? `${eventDate.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()} ${eventDate.getDate().toString().padStart(2, '0')}/${(eventDate.getMonth() + 1).toString().padStart(2, '0')}`
                                    : 'Fecha no disponible';

                                return (
                                    <div key={eventId} className="event-section">
                                        <div className="event-header">
                                            <div className="event-info">
                                                <h2 className="event-title">{event.titulo?.toUpperCase() || 'Evento'} |  {formattedDate}</h2>
                                                <p className="event-location">
                                                    {event.direccion || 'Dirección no disponible'}
                                                </p>
                                            </div>
                                            <div className="event-summary">
                                                <span className="ticket-count">
                                                    {eventTickets.length} ticket{eventTickets.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="tickets-grid">
                                            {eventTickets?.map((ticket) => (
                                                <div key={ticket.id} className="ticket-card">
                                                    <div className="ticket-header">
                                                        <div>
                                                            <h3>Ticket #{ticket.id}</h3>
                                                            <p className="ticket-meta">
                                                                Cliente: {ticket.nombre}
                                                            </p>
                                                        </div>
                                                        <span className={`ticket-status ${ticket.status}`}>
                                                            {ticket.status === 'active'
                                                                ? 'Activo'
                                                                : ticket.status === 'used'
                                                                    ? 'Usado'
                                                                    : 'Expirado'}
                                                        </span>
                                                    </div>

                                                    <div className="ticket-qr">
                                                        {qrCodes[ticket.id] && (
                                                            <img src={qrCodes[ticket.id]} alt="QR Code del ticket" />
                                                        )}
                                                    </div>

                                                    <div className="ticket-actions">
                                                        <button
                                                            className="download-btn"
                                                            onClick={() => handleDownloadPDF(ticket.id)}
                                                            title="Descargar PDF"
                                                            aria-label="Descargar ticket"
                                                        >
                                                            <i className="fa fa-download" aria-hidden="true" />
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDeleteTicket(ticket.id)}
                                                            disabled={ticket.status === 'used'}
                                                            title="Eliminar ticket"
                                                            aria-label="Eliminar ticket"
                                                        >
                                                            <i className="fa fa-trash" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Tickets;
