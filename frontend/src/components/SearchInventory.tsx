import React, { useState, useEffect } from 'react';
import {
  Container,
  Input,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CardActions,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { InventoryItem } from '../types/Inventory';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const API_URL = 'http://localhost:5001/api';

export const SearchInventory: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/inventory/search`, {
        params: { query }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error searching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleEdit = (item: InventoryItem) => {
    navigate('/add', { state: { item } });
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Search Inventory
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          position: 'relative',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1
        }}>
          <SearchIcon color="action" />
          <Input
            fullWidth
            disableUnderline
            placeholder="Search by any field..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isLoading && <CircularProgress size={20} />}
        </Box>

        <Box sx={{ 
          width: '100%', 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 300px)',
            md: 'repeat(3, 300px)'
          },
          gap: 2,
          justifyContent: 'start'
        }}>
          {items.map((item) => (
            <Card key={item._id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.description}
                </Typography>
                <Typography color="textSecondary">
                  Manufacturer: {item.manufacturer}
                </Typography>
                <Typography color="textSecondary">
                  Model: {item.model}
                </Typography>
                <Typography color="textSecondary">
                  Serial: {item.serialNumber}
                </Typography>
                <Typography color="textSecondary">
                  Type: {item.type}
                </Typography>
                <Typography color="textSecondary">
                  Owner: {item.owner}
                </Typography>
                <Typography color="textSecondary">
                  Current User: {item.currentUser}
                </Typography>
                <Typography color="textSecondary">
                  Added: {new Date(item.addedTime).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}; 