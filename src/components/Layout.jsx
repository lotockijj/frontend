import Header from './header/Header';
import Footer from './footer/Footer';

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;