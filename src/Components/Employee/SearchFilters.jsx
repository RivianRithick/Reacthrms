import React from 'react';
import {
  Box,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SearchFilters = ({ searchQuery, setSearchQuery, filters, handleFilterChange }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          borderRadius: 3,
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3,
            color: 'text.primary',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&::after': {
              content: '""',
              flex: 1,
              height: '2px',
              background: 'linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0))',
              ml: 2
            }
          }}
        >
          Search & Filters
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or address..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'background.paper',
                      '& fieldset': {
                        borderWidth: '2px',
                        borderColor: 'primary.main',
                      },
                    },
                  },
                }}
              />
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Box sx={{ height: '100%' }}>
                <InputLabel 
                  sx={{ 
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  displayEmpty
                  fullWidth
                  sx={{
                    backgroundColor: 'background.paper',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Box sx={{ height: '100%' }}>
                <InputLabel 
                  sx={{ 
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  Block Status
                </InputLabel>
                <Select
                  name="isBlocked"
                  value={filters.isBlocked}
                  onChange={handleFilterChange}
                  displayEmpty
                  fullWidth
                  sx={{
                    backgroundColor: 'background.paper',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Blocked</MenuItem>
                  <MenuItem value="false">Not Blocked</MenuItem>
                </Select>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Box sx={{ height: '100%' }}>
                <InputLabel 
                  sx={{ 
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  Data Status
                </InputLabel>
                <Select
                  name="dataStatus"
                  value={filters.dataStatus}
                  onChange={handleFilterChange}
                  displayEmpty
                  fullWidth
                  sx={{
                    backgroundColor: 'background.paper',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                  <MenuItem value="incomplete">Incomplete</MenuItem>
                </Select>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Box sx={{ height: '100%' }}>
                <InputLabel 
                  sx={{ 
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  Employee Status
                </InputLabel>
                <Select
                  name="showDeleted"
                  value={filters.showDeleted}
                  onChange={handleFilterChange}
                  fullWidth
                  sx={{
                    backgroundColor: 'background.paper',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <MenuItem value={false}>Active Employees</MenuItem>
                  <MenuItem value={true}>Disabled Employees</MenuItem>
                </Select>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default SearchFilters; 