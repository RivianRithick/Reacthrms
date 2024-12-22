import React from 'react';
import {
  Box,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

const SearchFilters = ({ searchQuery, setSearchQuery, filters, handleFilterChange }) => {
  return (
    <Box sx={{ 
      backgroundColor: '#fff',
      borderRadius: 2,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: 3,
      marginBottom: 3
    }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>Search & Filters</Typography>
      <Grid container spacing={2}>
        {/* Search Field - Full Width */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search by Name, Email, or Address"
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
        </Grid>
        
        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            backgroundColor: 'white', 
            padding: 2, 
            borderRadius: 1,
            height: '100%'
          }}>
            <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Status Filter</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </Box>
        </Grid>

        {/* Block Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            backgroundColor: 'white', 
            padding: 2, 
            borderRadius: 1,
            height: '100%'
          }}>
            <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Block Filter</InputLabel>
            <Select
              name="isBlocked"
              value={filters.isBlocked}
              onChange={handleFilterChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Blocked</MenuItem>
              <MenuItem value="false">Not Blocked</MenuItem>
            </Select>
          </Box>
        </Grid>

        {/* Data Completion Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            backgroundColor: 'white', 
            padding: 2, 
            borderRadius: 1,
            height: '100%'
          }}>
            <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Data Completion Filter</InputLabel>
            <Select
              name="dataStatus"
              value={filters.dataStatus}
              onChange={handleFilterChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="complete">Complete</MenuItem>
              <MenuItem value="incomplete">Incomplete</MenuItem>
            </Select>
          </Box>
        </Grid>

        {/* Show Deleted Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            backgroundColor: 'white', 
            padding: 2, 
            borderRadius: 1,
            height: '100%'
          }}>
            <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Status</InputLabel>
            <Select
              name="showDeleted"
              value={filters.showDeleted}
              onChange={handleFilterChange}
              fullWidth
            >
              <MenuItem value={false}>Active Employees</MenuItem>
              <MenuItem value={true}>Disabled Employees</MenuItem>
            </Select>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchFilters; 