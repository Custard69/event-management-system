import { useState, type SyntheticEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      login(
        response.data.accessToken,
        response.data.user,
      );

      navigate('/events');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            'Login failed.',
        );
      } else {
        setError('Login failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
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
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>
        Don't have an account?{' '}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}