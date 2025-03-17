import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from '../../App';

describe('App Component', () => {
  it('renders the app title correctly', () => {
    render(<App />);
    expect(screen.getByText('Zone24x7 Inventory Manager')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add item/i })).toBeInTheDocument();
  });

  it('navigates to Add Item page when clicking Add Item link', async () => {
    render(<App />);
    const addLink = screen.getByRole('link', { name: /add item/i });
    await userEvent.click(addLink);
    expect(screen.getByText('Add New Inventory Item')).toBeInTheDocument();
  });

  it('navigates to Search page when clicking Search link', async () => {
    render(<App />);
    const searchLink = screen.getByRole('link', { name: /search/i });
    await userEvent.click(searchLink);
    expect(screen.getByText('Search Inventory')).toBeInTheDocument();
  });

  it('applies theme correctly', () => {
    render(<App />);
    const appBar = screen.getByRole('banner');
    const computedStyle = window.getComputedStyle(appBar);
    expect(computedStyle.backgroundColor).toBe('rgb(0, 0, 0)'); // Black AppBar from theme
  });
}); 