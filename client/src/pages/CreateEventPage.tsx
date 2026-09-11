import { useState, type SyntheticEvent  } from 'react';
import axios from 'axios';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import api from '../api/api';

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
    <div>
      <h1>Create Event</h1>

      <Link to="/events">
        Back to Events
      </Link>

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

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating...'
            : 'Create Event'}
        </button>
      </form>
    </div>
  );
}