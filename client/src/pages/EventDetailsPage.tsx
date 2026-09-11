import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import api from '../api/api';
import type { EventItem } from '../types/event';

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
    return <p>Loading event...</p>;
  }

  if (error && !event) {
    return (
      <div>
        <p>{error}</p>

        <Link to="/events">
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div>
      <Link to="/events">
        Back to Events
      </Link>

      <h1>{event.title}</h1>

      {error && <p>{error}</p>}

      <p>
        <strong>Description:</strong>{' '}
        {event.description}
      </p>

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

      <div>
        <Link to={`/events/${event.id}/edit`}>
          Edit Event
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting
            ? 'Deleting...'
            : 'Delete Event'}
        </button>
      </div>
    </div>
  );
}