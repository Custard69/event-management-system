import { useState, type SyntheticEvent } from 'react';
import axios from 'axios';
import {
    Link,
    useNavigate,
} from 'react-router-dom';
import api from '../api/api';
import AppHeader from '../components/AppHeader';

export default function CreateEventPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] =
        useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] =
        useState(false);

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            await api.post('/events', {
                title,
                description,
                date,
                time,
                location,
            });

            navigate('/events');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message;

                if (Array.isArray(message)) {
                    setError(message.join(', '));
                } else {
                    setError(
                        message ?? 'Failed to create event.',
                    );
                }
            } else {
                setError('Failed to create event.');
            }
        } finally {
            setLoading(false);
        }
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

                <div className="card event-details-card">
                    <div className="event-details-header">
                        <span className="event-label">
                            Create Event
                        </span>

                        <h1 className="event-details-title">
                            Add New Event
                        </h1>

                        <p className="event-details-subtitle">
                            Enter the details below to create
                            a new event.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        <div className="form-group">
                            <label htmlFor="title">
                                Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value,
                                    )
                                }
                                maxLength={150}
                                placeholder="Enter event title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value,
                                    )
                                }
                                maxLength={2000}
                                placeholder="Enter event description"
                                required
                            />
                        </div>

                        <div className="edit-event-grid">
                            <div className="form-group">
                                <label htmlFor="date">
                                    Date
                                </label>

                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(event) =>
                                        setDate(
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">
                                    Time
                                </label>

                                <input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={(event) =>
                                        setTime(
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value,
                                    )
                                }
                                maxLength={255}
                                placeholder="Enter event location"
                                required
                            />
                        </div>

                        <div className="details-actions">
                            <button
                                className="button button-primary save-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Creating...'
                                    : 'Create Event'}
                            </button>

                            <Link
                                className="button button-secondary cancel-button"
                                to="/events"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}