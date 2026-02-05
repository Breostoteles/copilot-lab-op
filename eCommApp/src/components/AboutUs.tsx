import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="about-container">
                    <h2>About Us</h2>
                    
                    <div className="about-content">
                        <section className="about-section">
                            <h3>Our Story</h3>
                            <p>
                                Welcome to The Daily Harvest! We're passionate about bringing you the freshest, 
                                highest quality fruits and produce. Our commitment to excellence and customer 
                                satisfaction has made us a trusted source for healthy, delicious products.
                            </p>
                        </section>

                        <section className="about-section">
                            <h3>Contact Information</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <div className="contact-icon">📞</div>
                                    <div>
                                        <strong>Phone</strong>
                                        <p>(555) 123-4567</p>
                                    </div>
                                </div>
                                
                                <div className="contact-item">
                                    <div className="contact-icon">✉️</div>
                                    <div>
                                        <strong>Email</strong>
                                        <p>info@dailyharvest.com</p>
                                    </div>
                                </div>
                                
                                <div className="contact-item">
                                    <div className="contact-icon">📍</div>
                                    <div>
                                        <strong>Visit Us</strong>
                                        <p>123 Fresh Market Street</p>
                                        <p>Garden City, CA 90210</p>
                                        <p>United States</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="about-section">
                            <h3>Business Hours</h3>
                            <div className="business-hours">
                                <p><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</p>
                                <p><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
                                <p><strong>Sunday:</strong> 10:00 AM - 4:00 PM</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;
