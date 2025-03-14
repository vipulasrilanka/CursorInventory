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
} from '@mui/material';
import axios from 'axios';
import { InventoryItem } from '../types/Inventory';

const API_URL = 'http://localhost:5001/api';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Omit<InventoryItem, '_id' | 'addedTime'>>({
    description: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    type: '',
    owner: '',
    currentUser: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/inventory`, formData);
      // Reset form
      setFormData({
        description: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        type: '',
        owner: '',
        currentUser: '',
      });
      // Refresh items
      handleSearch();
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Add New Inventory Item
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Serial Number"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current User"
                    name="currentUser"
                    value={formData.currentUser}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Add Item
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12}>
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
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}; 