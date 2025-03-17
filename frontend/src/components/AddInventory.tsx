import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { InventoryItem } from '../types/Inventory';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

export const AddInventory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemToUpdate = location.state?.item as InventoryItem | undefined;
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<Omit<InventoryItem, '_id' | 'addedTime'>>({
    description: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    type: '',
    owner: '',
    currentUser: '',
  });

  useEffect(() => {
    if (itemToUpdate) {
      setFormData({
        description: itemToUpdate.description,
        manufacturer: itemToUpdate.manufacturer,
        model: itemToUpdate.model,
        serialNumber: itemToUpdate.serialNumber,
        type: itemToUpdate.type,
        owner: itemToUpdate.owner,
        currentUser: itemToUpdate.currentUser,
      });
    }
  }, [itemToUpdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      if (itemToUpdate) {
        await axios.put(`${API_URL}/inventory/${itemToUpdate._id}`, formData);
      } else {
        await axios.post(`${API_URL}/inventory`, formData);
      }
      // Reset form and navigate to search
      setFormData({
        description: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        type: '',
        owner: '',
        currentUser: '',
      });
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('An item with this serial number already exists. Please use a different serial number.');
      } else {
        setError('Error saving inventory item. Please try again.');
      }
      console.error('Error saving inventory item:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when serial number is changed
    if (name === 'serialNumber') {
      setError('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {itemToUpdate ? 'Update Inventory Item' : 'Add New Inventory Item'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
                {itemToUpdate ? 'Update' : 'Submit'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/')}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}; 