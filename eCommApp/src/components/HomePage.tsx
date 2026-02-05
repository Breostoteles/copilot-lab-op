import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchFunnyAnimal = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('https://random.dog/woof.json');
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            setImageUrl(data.url);
        } catch (err) {
            setError('Failed to load image');
            console.error('Error fetching animal image:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="home-hero">
                    <h2>Welcome to The Daily Harvest!</h2>
                    <p className="hero-subtitle">Your source for fresh, organic produce delivered daily</p>
                    <p className="hero-description">
                        Discover our selection of premium fruits and vegetables, 
                        handpicked for quality and freshness. From farm to your table, 
                        we bring you the best nature has to offer.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/products" className="cta-button primary">
                            Browse Products
                        </Link>
                        <Link to="/about" className="cta-button secondary">
                            Learn More
                        </Link>
                        <button 
                            onClick={fetchFunnyAnimal} 
                            className="cta-button secondary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Funny Animal'}
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {imageUrl && (
                        <div className="animal-image-container">
                            <img src={imageUrl} alt="Random funny animal" className="animal-image" />
                        </div>
                    )}
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🌱</div>
                            <h3>100% Organic</h3>
                            <p>Certified organic produce from trusted farms</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Fast Delivery</h3>
                            <p>Fresh products delivered to your door daily</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💚</div>
                            <h3>Quality First</h3>
                            <p>Hand-selected for maximum freshness</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
