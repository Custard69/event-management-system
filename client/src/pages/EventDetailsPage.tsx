import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { EventItem } from '../types/event';
import AppHeader from '../components/AppHeader';

export default function EventDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    

    const [event, setEvent] = useState<EventItem | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            if (!id) {
                setError('Event ID is missing.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get<EventItem>(
                    `/events/${id}`,
                );

                setEvent(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ??
                        'Failed to load event.',
                    );
                } else {
                    setError('Failed to load event.');
                }
            } finally {
                setLoading(false);
            }
        }

        void fetchEvent();
    }, [id]);

   

    async function handleDelete() {
        if (!id) {
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this event?',
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError('');

        try {
            await api.delete(`/events/${id}`);

            navigate('/events');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ??
                    'Failed to delete event.',
                );
            } else {
                setError('Failed to delete event.');
            }
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <>
                <AppHeader />

                <main className="page-container main-content">
                    <p>Loading event...</p>
                </main>
            </>
        );
    }

    if (error && !event) {
        return (
            <>
                <AppHeader />

                <main className="page-container main-content">
                    <div className="card empty-state">
                        <p className="error-message">
                            {error}
                        </p>

                        <Link
                            className="button button-secondary"
                            to="/events"
                        >
                            ← Back to Events
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <>
            <AppHeader />

            <main className="page-container main-content">
                <Link
                    className="back-link"
                    to="/events"
                >
                    <span>←</span>
                    Back to Events
                </Link>

                <article className="card event-details-card">
                    <div className="event-details-header">
                        <div>
                            <span className="event-label">
                                Event Details
                            </span>

                            <h1 className="event-details-title">
                                {event.title}
                            </h1>

                            <p className="event-details-subtitle">
                                Review and manage your event information.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <section className="event-description">
                        <span className="detail-label">
                            Description
                        </span>

                        <p>{event.description}</p>
                    </section>

                    <div className="event-info-grid">
                        <div className="event-info-item">
                            <span className="detail-label">
                                Date
                            </span>

                            <strong>
                                {event.date}
                            </strong>
                        </div>

                        <div className="event-info-item">
                            <span className="detail-label">
                                Time
                            </span>

                            <strong>
                                {event.time.slice(0, 5)}
                            </strong>
                        </div>

                        <div className="event-info-item">
                            <span className="detail-label">
                                Location
                            </span>

                            <strong>
                                {event.location}
                            </strong>
                        </div>
                    </div>

                    <div className="details-actions">
                        <Link
                            className="button button-primary edit-button"
                            to={`/events/${event.id}/edit`}
                        >
                            Edit Event
                        </Link>

                        <button
                            className="button button-danger delete-button"
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting
                                ? 'Deleting...'
                                : 'Delete Event'}
                        </button>
                    </div>
                </article>
            </main>
        </>
    );
}