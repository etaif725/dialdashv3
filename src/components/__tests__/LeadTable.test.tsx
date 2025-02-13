import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadTable } from '../leads/LeadTable';
import { useStore } from '../../store';
import { mockLeads } from '../../../test/mocks/data';

// Mock the store
jest.mock('../../store');

describe('LeadTable', () => {
  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation(() => ({
      leads: mockLeads,
      isLoading: false,
      error: null,
      fetchLeads: jest.fn(),
      deleteLead: jest.fn(),
      updateLead: jest.fn(),
    }));
  });

  it('renders leads correctly', () => {
    render(<LeadTable />);
    
    mockLeads.forEach(lead => {
      expect(screen.getByText(lead.first_name)).toBeInTheDocument();
      expect(screen.getByText(lead.last_name)).toBeInTheDocument();
    });
  });

  it('handles sorting', async () => {
    render(<LeadTable />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    await waitFor(() => {
      const names = screen.getAllByTestId('lead-name');
      expect(names[0]).toHaveTextContent(mockLeads[0].first_name);
    });
  });

  it('handles filtering', async () => {
    render(<LeadTable />);
    
    const filterInput = screen.getByPlaceholderText('Search leads...');
    fireEvent.change(filterInput, { target: { value: 'John' } });
    
    await waitFor(() => {
      const filteredLeads = screen.getAllByTestId('lead-row');
      expect(filteredLeads).toHaveLength(1);
    });
  });

  it('handles pagination', async () => {
    render(<LeadTable />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument();
    });
  });
}); 