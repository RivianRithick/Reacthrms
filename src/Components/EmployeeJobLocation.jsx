import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const EmployeeJobLocation = () => {
  const [jobLocations, setJobLocations] = useState([]);
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    country: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const fetchJobLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/employeejoblocation`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch job locations');
      }
      
      const result = await response.json();
      if (result.status === "Success") {
        setJobLocations(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch job locations');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Failed to fetch job locations.');
      setError('Failed to fetch job locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = selectedLocation
        ? `${baseUrl}/api/employeejoblocation/update`
        : `${baseUrl}/api/employeejoblocation/create`;
      
      const payload = {
        City: formData.city,
        State: formData.state,
        Country: formData.country,
        Address: formData.address,
      };

      if (selectedLocation) {
        payload.Id = selectedLocation.id;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save job location');
      }
      
      const result = await response.json();
      toast.success(result.message || 'Job location saved successfully');
      resetForm();
      fetchJobLocations();
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Failed to save job location.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job location?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/employeejoblocation/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(id),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job location');
      }
      
      const result = await response.json();
      toast.success(result.message || 'Job location deleted successfully');
      fetchJobLocations();
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Failed to delete job location.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setFormData({
      city: location.city,
      state: location.state,
      country: location.country,
      address: location.address,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      city: '',
      state: '',
      country: '',
      address: '',
    });
    setSelectedLocation(null);
    setShowForm(false);
  };

  const filteredLocations = jobLocations.filter(location =>
    location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <ToastContainer />
      
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: "center", 
          fontWeight: "bold",
          color: "primary.main",
          marginBottom: 4
        }}
      >
        Job Location Management
      </Typography>

      {!showForm && (
        <Box sx={{ 
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: 3,
          marginBottom: 3
        }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Search & Filters</Typography>
          <TextField
            fullWidth
            label="Search by City, State or Country"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>
      )}

      {showForm ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: 4,
            maxWidth: 800,
            margin: '0 auto'
          }}
        >
          <Typography variant="h5" sx={{ 
            marginBottom: 4, 
            color: 'primary.main',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {selectedLocation ? 'Edit Job Location' : 'Create Job Location'}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            marginTop: 4,
            justifyContent: 'center'
          }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{
                minWidth: 120,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              {loading ? <CircularProgress size={24} /> : selectedLocation ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="outlined"
              onClick={resetForm}
              sx={{
                minWidth: 120,
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ 
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: 3
        }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Job Locations List
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => setShowForm(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <IoIosAddCircle style={{ marginRight: '4px' }} /> Add Location
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", margin: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>State</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Country</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLocations.length === 0 ? (
                    <TableRow>
                      <TableCell 
                        colSpan={6} 
                        align="center"
                        sx={{ 
                          py: 4,
                          color: 'text.secondary',
                          fontSize: '1.1rem'
                        }}
                      >
                        No job locations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLocations.map((location, index) => (
                      <TableRow 
                        key={location.id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{location.city}</TableCell>
                        <TableCell>{location.state}</TableCell>
                        <TableCell>{location.country}</TableCell>
                        <TableCell>{location.address}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() => handleEdit(location)}
                              sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.2s'
                                }
                              }}
                            >
                              <FaEdit style={{ marginRight: '4px' }} /> Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(location.id)}
                              sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.2s'
                                }
                              }}
                            >
                              <MdDelete style={{ marginRight: '4px' }} /> Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EmployeeJobLocation;
