import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddInventory } from '../AddInventory';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('AddInventory Component', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AddInventory />
      </BrowserRouter>
    );
  };

  it('renders all form fields', () => {
    renderComponent();
    
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/manufacturer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/serial number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current user/i)).toBeInTheDocument();
  });

  it('submits form data correctly', async () => {
    renderComponent();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText(/manufacturer/i), { target: { value: 'Test Manufacturer' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Test Model' } });
    fireEvent.change(screen.getByLabelText(/serial number/i), { target: { value: 'TEST123' } });
    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'Test Type' } });
    fireEvent.change(screen.getByLabelText(/owner/i), { target: { value: 'Test Owner' } });
    fireEvent.change(screen.getByLabelText(/current user/i), { target: { value: 'Test User' } });

    // Mock successful POST request
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Verify axios was called with correct data
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5001/api/inventory',
        {
          description: 'Test Item',
          manufacturer: 'Test Manufacturer',
          model: 'Test Model',
          serialNumber: 'TEST123',
          type: 'Test Type',
          owner: 'Test Owner',
          currentUser: 'Test User',
        }
      );
    });
  });
}); 