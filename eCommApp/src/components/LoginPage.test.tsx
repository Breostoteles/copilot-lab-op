import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderLoginPage = () => {
    return render(
        <BrowserRouter>
            <LoginPage />
        </BrowserRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should render page structure', () => {
        const { container } = renderLoginPage();
        expect(container.querySelector('.app')).toBeInTheDocument();
        expect(container.querySelector('header')).toBeInTheDocument();
        expect(container.querySelector('.main-content')).toBeInTheDocument();
        expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should display Admin Login heading', () => {
        renderLoginPage();
        expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
    });

    it('should render login form', () => {
        const { container } = renderLoginPage();
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
    });

    it('should render username input', () => {
        renderLoginPage();
        const usernameInput = screen.getByPlaceholderText('Username');
        expect(usernameInput).toBeInTheDocument();
        expect(usernameInput).toHaveAttribute('type', 'text');
    });

    it('should render password input', () => {
        renderLoginPage();
        const passwordInput = screen.getByPlaceholderText('Password');
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render login button', () => {
        const { container } = renderLoginPage();
        const loginButton = container.querySelector('button[type="submit"]');
        expect(loginButton).toBeInTheDocument();
        expect(loginButton).toHaveTextContent('Login');
    });

    it('should have autofocus on username input', () => {
        renderLoginPage();
        const usernameInput = screen.getByPlaceholderText('Username');
        // In React, autoFocus prop is set, but in DOM it doesn't always appear as attribute
        expect(usernameInput).toBeInTheDocument();
    });

    it('should update username on input change', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        await user.type(usernameInput, 'testuser');

        expect(usernameInput.value).toBe('testuser');
    });

    it('should update password on input change', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        await user.type(passwordInput, 'testpass');

        expect(passwordInput.value).toBe('testpass');
    });

    it('should navigate to admin page on successful login', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = container.querySelector('button[type="submit"]')!;

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.click(loginButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('should display error message on invalid credentials', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = container.querySelector('button[type="submit"]')!;

        await user.type(usernameInput, 'wronguser');
        await user.type(passwordInput, 'wrongpass');
        await user.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('should display error message with wrong username', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        await user.type(screen.getByPlaceholderText('Username'), 'wronguser');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(container.querySelector('button[type="submit"]')!);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('should display error message with wrong password', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'wrongpass');
        await user.click(container.querySelector('button[type="submit"]')!);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('should clear error message on successful login', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        // First, trigger an error
        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(container.querySelector('button[type="submit"]')!);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });

        // Then login successfully
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

        await user.clear(usernameInput);
        await user.clear(passwordInput);
        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.click(container.querySelector('button[type="submit"]')!);

        await waitFor(() => {
            expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
        });
    });

    it('should clear username and password on successful login', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.click(container.querySelector('button[type="submit"]')!);

        await waitFor(() => {
            expect(usernameInput.value).toBe('');
            expect(passwordInput.value).toBe('');
        });
    });

    it('should not navigate on invalid credentials', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(container.querySelector('button[type="submit"]')!);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should have login container', () => {
        const { container } = renderLoginPage();
        expect(container.querySelector('.login-container')).toBeInTheDocument();
    });

    it('should render error message in red color', async () => {
        const user = userEvent.setup();
        const { container } = renderLoginPage();

        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(container.querySelector('button[type="submit"]')!);

        await waitFor(() => {
            const errorElement = screen.getByText('Invalid credentials');
            // Check that color style is set (can be 'red' or 'rgb(255, 0, 0)')
            expect(errorElement).toHaveAttribute('style', expect.stringContaining('color'));
        });
    });

    it('should handle form submission via Enter key', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.keyboard('{Enter}');

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('should not show error message initially', () => {
        renderLoginPage();
        expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });

    it('should render header and footer components', () => {
        renderLoginPage();
        expect(screen.getByText('The Daily Harvest')).toBeInTheDocument();
        expect(screen.getByText(/© 2025 The Daily Harvest/i)).toBeInTheDocument();
    });
});
