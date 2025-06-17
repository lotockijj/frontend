import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [footerData, setFooterData] = useState(null);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const response = await fetch('/api/footer-data');
                const data = await response.json();
                setFooterData(data);
            } catch (error) {
                console.error('Error fetching footer data:', error);
            }
        };

        fetchFooterData();
    }, []);

    return (
        <footer className="app-footer">
            {footerData ? (
                <>
                    <p><Link to={footerData.copyright}>Copyright Office</Link></p>
                    <p>Last updated: {footerData.lastUpdated}</p>
                    <p>Version: {footerData.version}</p>
                </>
            ) : (
                <p>Loading footer information...</p>
            )}
        </footer>
    );
};

export default Footer;