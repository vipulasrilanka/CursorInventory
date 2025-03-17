import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddInventory } from '../AddInventory';
import { BrowserRouter, useLocation } from 'react-router-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useNavigate and useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('AddInventory Component', () => {
  const mockNavigate = vi.fn();

  const renderComponent = (locationState = {}) => {
    (useLocation as jest.Mock).mockReturnValue({ state: locationState });
    render(
      <BrowserRouter>
        <AddInventory />
      </BrowserRouter>
    );
  };

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText(/manufacturer/i), { target: { value: 'Test Manufacturer' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Test Model' } });
    fireEvent.change(screen.getByLabelText(/serial number/i), { target: { value: 'TEST123' } });
    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'Test Type' } });
    fireEvent.change(screen.getByLabelText(/owner/i), { target: { value: 'Test Owner' } });
    fireEvent.change(screen.getByLabelText(/current user/i), { target: { value: 'Test User' } });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('submits form data successfully', async () => {
    renderComponent();
    fillForm();

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

  it('displays error message for duplicate serial number', async () => {
    renderComponent();
    fillForm();

    // Mock failed POST request with duplicate serial number
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: 'An item with this serial number already exists for this type'
        }
      }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/serial number already exists/i)).toBeInTheDocument();
    });
  });

  it('clears error message when serial number is changed', async () => {
    renderComponent();
    fillForm();

    // Mock failed POST request with duplicate serial number
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: 'An item with this serial number already exists for this type'
        }
      }
    });

    // Submit the form to trigger error
    fireEvent.click(screen.getByText(/submit/i));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/serial number already exists/i)).toBeInTheDocument();
    });

    // Change serial number
    fireEvent.change(screen.getByLabelText(/serial number/i), { target: { value: 'NEW123' } });

    // Verify error message is cleared
    expect(screen.queryByText(/serial number already exists/i)).not.toBeInTheDocument();
  });

  it('handles update mode correctly', async () => {
    const mockItem = {
      _id: '123',
      description: 'Existing Item',
      manufacturer: 'Existing Manufacturer',
      model: 'Existing Model',
      serialNumber: 'EXIST123',
      type: 'Existing Type',
      owner: 'Existing Owner',
      currentUser: 'Existing User',
      addedTime: new Date()
    };

    // Render component with mock item in location state
    renderComponent({ item: mockItem });

    // Verify update mode title
    expect(screen.getByText('Update Inventory Item')).toBeInTheDocument();

    // Verify form is pre-filled with item data
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockItem.description);
    expect(screen.getByLabelText(/manufacturer/i)).toHaveValue(mockItem.manufacturer);
    expect(screen.getByLabelText(/model/i)).toHaveValue(mockItem.model);
    expect(screen.getByLabelText(/serial number/i)).toHaveValue(mockItem.serialNumber);
    expect(screen.getByLabelText(/type/i)).toHaveValue(mockItem.type);
    expect(screen.getByLabelText(/owner/i)).toHaveValue(mockItem.owner);
    expect(screen.getByLabelText(/current user/i)).toHaveValue(mockItem.currentUser);

    // Mock successful PUT request
    mockedAxios.put.mockResolvedValueOnce({ data: {} });

    // Submit the form
    fireEvent.click(screen.getByText('Update'));

    // Verify PUT request was made with correct data
    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `http://localhost:5001/api/inventory/${mockItem._id}`,
        {
          description: mockItem.description,
          manufacturer: mockItem.manufacturer,
          model: mockItem.model,
          serialNumber: mockItem.serialNumber,
          type: mockItem.type,
          owner: mockItem.owner,
          currentUser: mockItem.currentUser,
        }
      );
    });
  });

  it('handles update mode with duplicate serial number error', async () => {
    const mockItem = {
      _id: '123',
      description: 'Existing Item',
      manufacturer: 'Existing Manufacturer',
      model: 'Existing Model',
      serialNumber: 'EXIST123',
      type: 'Existing Type',
      owner: 'Existing Owner',
      currentUser: 'Existing User',
      addedTime: new Date()
    };

    // Render component with mock item in location state
    renderComponent({ item: mockItem });

    // Mock failed PUT request with duplicate serial number
    mockedAxios.put.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: 'An item with this serial number already exists for this type'
        }
      }
    });

    // Submit the form
    fireEvent.click(screen.getByText('Update'));

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/serial number already exists/i)).toBeInTheDocument();
    });
  });
}); 