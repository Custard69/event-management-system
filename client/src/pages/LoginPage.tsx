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
        <main className="auth-page">
            <div className="auth-layout">
                <section className="auth-brand-section">
                    <div className="auth-brand">
                        Event Management
                    </div>

                    <h2>
                        Manage your events with ease.
                    </h2>

                    <p>
                        Create, organize and keep track of your
                        events from one place.
                    </p>
                </section>

                <section className="card auth-card">
                    <h2>Welcome Back</h2>

                    <p className="auth-subtitle">
                        Sign in to continue to your account.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">
                                Email
                            </label>

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

                        <div className="form-group">
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

                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        <button
                            className="button button-primary auth-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?{' '}
                        <Link to="/register">
                            Create one
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}