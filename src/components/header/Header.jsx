import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [headerData, setHeaderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const response = await fetch('/api/header-data');
                const data = await response.json();
                setHeaderData(data);
            } catch (error) {
                console.error('Error fetching header data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeaderData();
    }, []);

    if (loading) return <div>Loading header...</div>;

    return (
        <header className="app-header">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/account">Account</Link>
                <br/>
                {headerData?.name && (
                    <span>Welcome, {headerData.name}</span>
                )}
            </nav>
            {/* Add other header content from backend */}
            {headerData?.content && (
                <div className="announcement">{headerData.content}</div>
            )}
        </header>
    );
};

export default Header;