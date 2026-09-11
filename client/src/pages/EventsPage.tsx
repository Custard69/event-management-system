import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { EventItem } from '../types/event';

export default function EventsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get<EventItem[]>('/events');

        setEvents(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ??
              'Failed to load events.',
          );
        } else {
          setError('Failed to load events.');
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchEvents();
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div>
      <header>
        <h1>My Events</h1>

        <div>
          <span>Welcome, {user?.name}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <div>
          <Link to="/events/create">
            Create Event
          </Link>
        </div>

        {error && <p>{error}</p>}

        {!error && events.length === 0 && (
          <div>
            <h2>No events yet</h2>

            <p>
              Create your first event to get started.
            </p>

            <Link to="/events/create">
              Create Event
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <div>
            {events.map((event) => (
              <article key={event.id}>
                <h2>{event.title}</h2>

                <p>
                  <strong>Date:</strong>{' '}
                  {event.date}
                </p>

                <p>
                  <strong>Time:</strong>{' '}
                  {event.time}
                </p>

                <p>
                  <strong>Location:</strong>{' '}
                  {event.location}
                </p>

                <Link to={`/events/${event.id}`}>
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}