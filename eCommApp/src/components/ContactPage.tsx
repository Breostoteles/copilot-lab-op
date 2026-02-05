import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [request, setRequest] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleContinue = () => {
        setShowModal(false);
        setName('');
        setEmail('');
        setRequest('');
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="request">Request</label>
                            <textarea
                                id="request"
                                value={request}
                                onChange={(e) => setRequest(e.target.value)}
                                required
                                rows={5}
                            />
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>
            </main>
            <Footer />

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2>Thank you for your message</h2>
                        <div className="modal-actions">
                            <button onClick={handleContinue}>Continue</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
