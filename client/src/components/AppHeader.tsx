import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppHeader() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    function handleLogout() {
        const confirmed = window.confirm(
            'Are you sure you want to logout?',
        );

        if (!confirmed) {
            return;
        }

        logout();
        navigate('/login');
    }

    return (
        <header className="topbar">
            <div className="page-container topbar-content">
                <div className="brand">
                    Event Management
                </div>

                <div className="topbar-actions">
                    <div className="user-info">
                        <span className="user-avatar">
                            {user?.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </span>

                        <span className="user-name">
                            {user?.name}
                        </span>
                    </div>

                    <button
                        className="logout-button"
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}