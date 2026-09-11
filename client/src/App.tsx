import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EditEventPage from './pages/EditEventPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/events"
            replace
          />
        }
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/create"
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:id/edit"
        element={
          <ProtectedRoute>
            <EditEventPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>



  );
}