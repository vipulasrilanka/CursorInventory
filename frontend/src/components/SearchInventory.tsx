import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CardActions,
} from '@mui/material';
import axios from 'axios';
import { InventoryItem } from '../types/Inventory';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

export const SearchInventory: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory/search`, {
        params: { query: searchQuery }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error searching inventory:', error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    navigate('/add', { state: { item } });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Search Inventory
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field..."
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
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
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}; 