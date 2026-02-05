import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ContactPage from './ContactPage';

const renderContactPage = () => {
    return render(
        <BrowserRouter>
            <ContactPage />
        </BrowserRouter>
    );
};

describe('ContactPage', () => {
    it('should render app container', () => {
        const { container } = renderContactPage();
        const app = container.querySelector('.app');
        expect(app).toBeInTheDocument();
    });

    it('should render Header component', () => {
        const { container } = renderContactPage();
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
    });

    it('should render Footer component', () => {
        const { container } = renderContactPage();
        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });

    it('should render main content area', () => {
        const { container } = renderContactPage();
        const main = container.querySelector('.main-content');
        expect(main).toBeInTheDocument();
    });

    it('should display Contact Us heading', () => {
        renderContactPage();
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('should render name input field', () => {
        renderContactPage();
        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveAttribute('type', 'text');
        expect(nameInput).toBeRequired();
    });

    it('should render email input field', () => {
        renderContactPage();
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toBeRequired();
    });

    it('should render request textarea field', () => {
        renderContactPage();
        const requestInput = screen.getByLabelText(/request/i);
        expect(requestInput).toBeInTheDocument();
        expect(requestInput.tagName).toBe('TEXTAREA');
        expect(requestInput).toBeRequired();
    });

    it('should render submit button', () => {
        renderContactPage();
        const submitButton = screen.getByRole('button', { name: /submit/i });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should update name field when typing', async () => {
        const user = userEvent.setup();
        renderContactPage();
        
        const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
        await user.type(nameInput, 'John Doe');
        
        expect(nameInput.value).toBe('John Doe');
    });

    it('should update email field when typing', async () => {
        const user = userEvent.setup();
        renderContactPage();
        
        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
        await user.type(emailInput, 'john@example.com');
        
        expect(emailInput.value).toBe('john@example.com');
    });

    it('should update request field when typing', async () => {
        const user = userEvent.setup();
        renderContactPage();
        
        const requestInput = screen.getByLabelText(/request/i) as HTMLTextAreaElement;
        await user.type(requestInput, 'This is my request');
        
        expect(requestInput.value).toBe('This is my request');
    });

    it('should show modal with thank you message when form is submitted', async () => {
        const user = userEvent.setup();
        renderContactPage();
        
        // Fill in the form
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const requestInput = screen.getByLabelText(/request/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(requestInput, 'This is my request');
        await user.click(submitButton);

        // Check if modal appears
        expect(screen.getByText('Thank you for your message')).toBeInTheDocument();
    });

    it('should show continue button in modal', async () => {
        const user = userEvent.setup();
        renderContactPage();
        
        // Fill in and submit the form
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const requestInput = screen.getByLabelText(/request/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(requestInput, 'This is my request');
        await user.click(submitButton);

        // Check if continue button appears in modal
        const continueButton = screen.getByRole('button', { name: /continue/i });
        expect(continueButton).toBeInTheDocument();
    });

    it('should clear form fields when continue button is clicked', async () => {
        const user = userEvent.setup();
        renderContactPage();
        
        // Fill in and submit the form
        const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
        const requestInput = screen.getByLabelText(/request/i) as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(requestInput, 'This is my request');
        await user.click(submitButton);

        // Click continue button
        const continueButton = screen.getByRole('button', { name: /continue/i });
        await user.click(continueButton);

        // Check if form fields are cleared
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(requestInput.value).toBe('');
    });

    it('should close modal when continue button is clicked', async () => {
        const user = userEvent.setup();
        renderContactPage();
        
        // Fill in and submit the form
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const requestInput = screen.getByLabelText(/request/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await user.type(nameInput, 'John Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(requestInput, 'This is my request');
        await user.click(submitButton);

        // Click continue button
        const continueButton = screen.getByRole('button', { name: /continue/i });
        await user.click(continueButton);

        // Check if modal is closed
        expect(screen.queryByText('Thank you for your message')).not.toBeInTheDocument();
    });

    it('should have contact-container class', () => {
        const { container } = renderContactPage();
        const contactContainer = container.querySelector('.contact-container');
        expect(contactContainer).toBeInTheDocument();
    });

    it('should have contact-form class', () => {
        const { container } = renderContactPage();
        const contactForm = container.querySelector('.contact-form');
        expect(contactForm).toBeInTheDocument();
    });

    it('should render h2 heading', () => {
        renderContactPage();
        const heading = screen.getByRole('heading', { level: 2, name: /contact us/i });
        expect(heading).toHaveTextContent('Contact Us');
    });

    it('should have form-group elements', () => {
        const { container } = renderContactPage();
        const formGroups = container.querySelectorAll('.form-group');
        expect(formGroups.length).toBe(3);
    });
});
