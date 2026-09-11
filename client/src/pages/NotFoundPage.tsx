import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link to="/events">
        Back to Events
      </Link>
    </div>
  );
}