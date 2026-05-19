import "./eventsSection.css";
import EventCard from "./EventCard";
import { useEvents } from "../hooks/useEvents";

function EventsSection() {
    const { data: events = [], isLoading } = useEvents();

    if (isLoading) return <p>Cargando eventos...</p>;

    return (
        <section id="events" className="events-section">
            <div className="container">
                <h2>PRÓXIMAS PRESENTACIONES</h2>
                <p className="subtitle">
                    Tu ingreso divertido, rápido y seguro está aquí.
                </p>

                <div className="events-grid">
                    {events?.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default EventsSection;