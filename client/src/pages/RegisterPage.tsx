import { useState, type SyntheticEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message.join(', '));
        } else {
          setError(
            message ?? 'Registration failed.',
          );
        }
      } else {
        setError('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength={8}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating account...'
            : 'Register'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}