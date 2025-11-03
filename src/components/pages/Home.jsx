import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/organisms/HeroSection";
import FeaturedEvents from "@/components/organisms/FeaturedEvents";
import EventCategories from "@/components/organisms/EventCategories";
import UpcomingEvents from "@/components/organisms/UpcomingEvents";
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleSearch = (query) => {
    navigate(`/events?search=${encodeURIComponent(query)}`);
  };

  return (
    <div>
<HeroSection 
        onSearch={handleSearch}
        onBrowseEvents={() => navigate('/events')}
        onCreateEvent={() => {
          if (isAuthenticated) {
            navigate('/create-event');
          } else {
            navigate('/login');
          }
        }}
      />
      <FeaturedEvents />
      <EventCategories />
      <UpcomingEvents />
    </div>
  );
};

export default Home;