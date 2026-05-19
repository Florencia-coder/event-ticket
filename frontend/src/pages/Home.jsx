import { useAuth } from "../hooks/useAuthContext";
import "./home.css";
import HeroSection from "../components/HeroSection";
import EventsSection from "../components/EventsSection";
import InfoSection from "../components/InfoSection";

function Home() {
    const { user, isAuthenticated } = useAuth();

    return (
        <main className="home">
            {/* HERO SECTION */}
            <HeroSection isAuthenticated={isAuthenticated} user={user} />
            <EventsSection isAuthenticated={isAuthenticated} />
            <InfoSection />
        </main>
    );
}

export default Home;