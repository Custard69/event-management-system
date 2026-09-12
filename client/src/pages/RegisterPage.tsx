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
        <main className="auth-page">
            <div className="auth-layout">
                <section className="auth-brand-section">
                    <div className="auth-brand">
                        Event Management
                    </div>

                    <h2>
                        Plan. Organize. Manage.
                    </h2>

                    <p>
                        Create your account and keep all your events
                        organized in one place.
                    </p>
                </section>

                <section className="card auth-card">
                    <h2>Create Account</h2>

                    <p className="auth-subtitle">
                        Enter your details to start managing your events.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                maxLength={255}
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
                                placeholder="Minimum 8 characters"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                minLength={8}
                                maxLength={64}
                                required
                            />

                            <small className="form-hint">
                                Use at least 8 characters.
                            </small>
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
                            {loading
                                ? 'Creating account...'
                                : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}