import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="auth-page">
      <div className="card auth-card empty-state">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          The page you are looking for does not exist.
        </p>

        <Link
          className="button button-primary"
          to="/events"
        >
          Back to Events
        </Link>
      </div>
    </main>
  );
}