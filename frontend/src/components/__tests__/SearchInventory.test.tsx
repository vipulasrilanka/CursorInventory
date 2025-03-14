import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SearchInventory } from '../SearchInventory';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock data
const mockItems = [
  {
    _id: '1',
    description: 'Test Item',
    manufacturer: 'Test Manufacturer',
    model: 'Test Model',
    serialNumber: 'TEST123',
    type: 'Test Type',
    owner: 'Test Owner',
    currentUser: 'Test User',
    addedTime: new Date().toISOString(),
  },
];

describe('SearchInventory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock initial data load with empty array
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
  });

  const renderComponent = async () => {
    const result = render(
      <BrowserRouter>
        <SearchInventory />
      </BrowserRouter>
    );
    // Wait for initial data load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
    return result;
  };

  it('renders search field correctly', async () => {
    await renderComponent();
    
    expect(screen.getByPlaceholderText(/search by any field/i)).toBeInTheDocument();
    expect(screen.getByTestId('SearchIcon')).toBeInTheDocument();
  });

  it('performs search and displays results', async () => {
    await renderComponent();
    
    // Mock the search response
    mockedAxios.get.mockResolvedValueOnce({ data: mockItems });

    // Type in search field
    const searchInput = screen.getByPlaceholderText(/search by any field/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Wait for debounced search to be called
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/inventory/search'),
        expect.objectContaining({
          params: { query: 'test' }
        })
      );
    });

    // Wait for and verify results
    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });

  it('displays edit button for each item', async () => {
    // Mock initial data load with items
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValueOnce({ data: mockItems });
    
    await renderComponent();

    // Verify edit button is present
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });
  });
}); 