import {
  useEffect,
  useState,
  type SyntheticEvent,
} from 'react';
import axios from 'axios';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import api from '../api/api';
import type { EventItem } from '../types/event';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

        const event = response.data;

        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date);
        setTime(event.time.slice(0, 5));
        setLocation(event.location);
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

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.patch(`/events/${id}`, {
        title,
        description,
        date,
        time,
        location,
      });

      navigate(`/events/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(', '));
        } else {
          setError(
            message ?? 'Failed to update event.',
          );
        }
      } else {
        setError('Failed to update event.');
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading event...</p>;
  }

  return (
    <div>
      <h1>Edit Event</h1>

      <Link to={`/events/${id}`}>
        Back to Event
      </Link>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            maxLength={150}
            required
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={2000}
            required
          />
        </div>

        <div>
          <label htmlFor="date">
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="time">
            Time
          </label>

          <input
            id="time"
            type="time"
            value={time}
            onChange={(event) =>
              setTime(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            maxLength={255}
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}