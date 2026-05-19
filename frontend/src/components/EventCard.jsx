import "./eventCard.css";
import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
    const navigate = useNavigate();
    const eventDate = new Date(event.fecha);
    const formattedDate = eventDate.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    return (
        <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
            <div className="event-image">
                <img src={event.imagen} alt={event.titulo} />

                <div className="event-overlay">
                    <span className="event-badge">PRÓXIMO</span>
                    <div className="overlay-text">
                        <p className="event-date-label">{formattedDate}</p>
                        <h3>{event.titulo}</h3>
                    </div>
                </div>
            </div>

            <div className="event-body">
                <p className="event-body-date">{eventDate.toLocaleDateString()}</p>
                <h3 className="event-body-title">{event.titulo}</h3>
                <p className="event-body-copy">
                    Entrada rápida y segura para una experiencia inolvidable.
                </p>
            </div>
        </div>
    );
}

export default EventCard;