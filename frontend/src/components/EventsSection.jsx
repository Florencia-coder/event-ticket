import "./eventsSection.css";
import EventCard from "./EventCard";
import { useEvents } from "../hooks/useEvents";

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-img" />
            <div className="skeleton-body">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--date" />
            </div>
        </div>
    );
}

function EventsSection() {
    const { data: events = [], isLoading } = useEvents();

    return (
        <section id="events" className="events-section">
            <div className="container">
                <h2>PRÓXIMAS PRESENTACIONES</h2>
                <p className="subtitle">
                    Tu ingreso divertido, rápido y seguro está aquí.
                </p>

                <div className="events-grid">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                        : events?.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    }
                </div>
            </div>
        </section>
    );
}

export default EventsSection;