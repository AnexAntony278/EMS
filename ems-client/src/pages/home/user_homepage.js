import { useEffect, useState } from "react";
import "./UserHomePage.css";

const UserHomePage = () => {
    const [bookedEvents, setBookedEvents] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [filters, setFilters] = useState({ date: "", location: "", category: "" });

    useEffect(() => {
        fetch("/api/user/booked-events")
            .then((res) => res.json())
            .then((data) => setBookedEvents(data))
            .catch((err) => console.error("Error fetching booked events:", err));
    }, []);

    const handleSearch = () => {
        const query = new URLSearchParams(filters).toString();
        fetch(`/api/events/search?${query}`)
            .then((res) => res.json())
            .then((data) => setSearchResults(data))
            .catch((err) => console.error("Error searching events:", err));
    };

    return (
        <div className="user-home">
            <h2>Your Booked Events</h2>
            <ul className="event-list">
                {bookedEvents.map(event => (
                    <li key={event.id} className="event-item">{event.name} - {event.date}</li>
                ))}
            </ul>

            <h2>Search Events</h2>
            <div className="search-filters">
                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            <h2>Search Results</h2>
            <ul className="event-list">
                {searchResults.map(event => (
                    <li key={event.id} className="event-item">{event.name} - {event.date}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserHomePage;
