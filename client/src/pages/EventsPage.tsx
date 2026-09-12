import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import api from '../api/api';
import AppHeader from '../components/AppHeader';
import type { EventItem } from '../types/event';

export default function EventsPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [filter, setFilter] = useState<
        'all' | 'upcoming' | 'past'
    >('all');

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response =
                    await api.get<EventItem[]>('/events');

                setEvents(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ??
                            'Failed to load events.',
                    );
                } else {
                    setError(
                        'Failed to load events.',
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        void fetchEvents();
    }, []);

    const now = new Date();

    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');

    const normalizedSearch =
        searchTerm.trim().toLowerCase();

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            normalizedSearch === '' ||
            event.title
                .toLowerCase()
                .includes(normalizedSearch) ||
            event.location
                .toLowerCase()
                .includes(normalizedSearch);

        const matchesFilter =
            filter === 'all' ||
            (filter === 'upcoming' &&
                event.date >= today) ||
            (filter === 'past' &&
                event.date < today);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <>
                <AppHeader />

                <main className="page-container main-content">
                    <p>Loading events...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <AppHeader />

            <main className="page-container main-content">
                <section className="page-heading">
                    <div>
                        <span className="event-label">
                            Dashboard
                        </span>

                        <h1 className="page-title">
                            My Events
                        </h1>

                        <p>
                            Create, organize and manage your
                            events from one place.
                        </p>
                    </div>

                    <Link
                        className="button button-primary create-event-button"
                        to="/events/create"
                    >
                        + Create Event
                    </Link>
                </section>

                <section className="card events-toolbar">
                    <div className="search-row">
                        <input
                            type="search"
                            list="event-suggestions"
                            placeholder="Search by title or location"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value,
                                )
                            }
                        />

                        <datalist id="event-suggestions">
                            {events.map((event) => (
                                <option
                                    key={event.id}
                                    value={event.title}
                                >
                                    {event.location}
                                </option>
                            ))}
                        </datalist>

                        <select
                            value={filter}
                            onChange={(event) =>
                                setFilter(
                                    event.target.value as
                                        | 'all'
                                        | 'upcoming'
                                        | 'past',
                                )
                            }
                        >
                            <option value="all">
                                All Events
                            </option>

                            <option value="upcoming">
                                Upcoming
                            </option>

                            <option value="past">
                                Past
                            </option>
                        </select>
                    </div>
                </section>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!error && events.length === 0 && (
                    <div className="card empty-state">
                        <h2>No events yet</h2>

                        <p>
                            Create your first event to get
                            started.
                        </p>

                        <Link
                            className="button button-primary"
                            to="/events/create"
                        >
                            Create Event
                        </Link>
                    </div>
                )}

                {!error &&
                    events.length > 0 &&
                    filteredEvents.length === 0 && (
                        <div className="card empty-state">
                            <h2>
                                No matching events
                            </h2>

                            <p>
                                Try another search or
                                filter.
                            </p>

                            <button
                                className="button button-secondary"
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilter('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                {filteredEvents.length > 0 && (
                    <div className="event-grid">
                        {filteredEvents.map((event) => (
                            <article
                                className="card event-card"
                                key={event.id}
                            >
                                <div className="event-card-header">
                                    <span className="event-card-date">
                                        {event.date}
                                    </span>

                                    <h2>
                                        {event.title}
                                    </h2>
                                </div>

                                <p className="event-card-description">
                                    {event.description}
                                </p>

                                <div className="event-card-details">
                                    <div className="event-card-detail">
                                        <span className="detail-label">
                                            Time
                                        </span>

                                        <strong>
                                            {event.time.slice(
                                                0,
                                                5,
                                            )}
                                        </strong>
                                    </div>

                                    <div className="event-card-detail">
                                        <span className="detail-label">
                                            Location
                                        </span>

                                        <strong>
                                            {event.location}
                                        </strong>
                                    </div>
                                </div>

                                <div className="actions">
                                    <Link
                                        className="button button-primary event-card-link"
                                        to={`/events/${event.id}`}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}