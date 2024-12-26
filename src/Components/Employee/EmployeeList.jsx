import React from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Tag as TagIcon,
  VerifiedUser as VerifiedUserIcon,
  CircleOutlined as StatusIcon,
  Settings as SettingsIcon,
  Clear as ClearIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return {
        background: 'linear-gradient(45deg, #059669, #34d399)',
        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.15)'
      };
    case 'inactive':
      return {
        background: 'linear-gradient(45deg, #dc2626, #ef4444)',
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)'
      };
    case 'pending':
      return {
        background: 'linear-gradient(45deg, #d97706, #fbbf24)',
        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)'
      };
    default:
      return {
        background: 'linear-gradient(45deg, #6b7280, #9ca3af)',
        boxShadow: '0 2px 8px rgba(107, 114, 128, 0.15)'
      };
  }
};

const EmployeeList = ({ 
  employees, 
  handleEdit, 
  handleDelete, 
  setShowForm, 
  resetForm,
  setSelectedEmployee,
  assignedEmployees,
  searchQuery,
  setSearchQuery,
  filters,
  handleFilterChange
}) => {
  const tableContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={tableContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sticky Header */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        backgroundColor: 'background.default',
        pt: 2,
        pb: 3,
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "primary.main",
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
            Employees List
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              icon={<PersonIcon />}
              label={`Total Records: ${employees.length}`}
              color="primary"
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>
        </Box>

        {/* Search and Add Section */}
        <Box sx={{ position: 'relative' }}>
        <Paper 
          elevation={0}
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 3,
              p: 0,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(61, 82, 160, 0.15)',
              mb: 2,
              position: 'sticky',
              top: 0,
              zIndex: 1100,
            }}
          >
            {/* Header Section with Create Button */}
            <Box sx={{ 
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
            }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Employee Management
                </Typography>
              </Box>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedEmployee(null);
              resetForm();
              setShowForm(true);
            }}
            startIcon={<AddIcon />}
            sx={{
              minWidth: '180px',
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              borderRadius: '8px',
              padding: '8px 24px',
              boxShadow: '0 4px 12px rgba(61, 82, 160, 0.18)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(61, 82, 160, 0.25)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Create New Employee
          </Button>
      </Box>

            {/* Filters Row */}
            <Box sx={{ 
              px: 3,
              py: 2,
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
              background: 'white',
            }}>
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 200,
                  flex: 1,
                  maxWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    background: 'white',
                    '&:hover': {
                      background: 'white',
                    },
                  }
                }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  name="dataStatus"
                  value={filters.dataStatus}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="enabled">Enabled</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </Select>
              </FormControl>

              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 200,
                  flex: 1,
                  maxWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    background: 'white',
                    '&:hover': {
                      background: 'white',
                    },
                  }
                }}
              >
                <InputLabel>Block Status</InputLabel>
                <Select
                  name="isBlocked"
                  value={filters.isBlocked}
                  onChange={handleFilterChange}
                  label="Block Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="unblocked">Unblocked</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                placeholder="Search by name, email, contact..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  flex: 2,
                  minWidth: 300,
                  '& .MuiOutlinedInput-root': {
                    background: 'white',
                    '&:hover': {
                      background: 'white',
                    },
                  }
                }}
              />
            </Box>
          </Paper>

          <TableContainer
            component={Paper}
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                  fontWeight: 600,
                  color: 'primary.main',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TagIcon sx={{ color: 'primary.main' }} />
                    #
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                  fontWeight: 600,
                  color: 'primary.main',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: 'primary.main' }} />
                    First Name
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                  fontWeight: 600,
                  color: 'primary.main',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: 'primary.main' }} />
                    Last Name
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                  fontWeight: 600,
                  color: 'primary.main',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: 'primary.main' }} />
                    Contact
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                  fontWeight: 600,
                  color: 'primary.main',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedUserIcon sx={{ color: 'primary.main' }} />
                    Verification
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                  fontWeight: 600,
                  color: 'primary.main',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StatusIcon sx={{ color: 'primary.main' }} />
                    Status
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ 
                  background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                  fontWeight: 600,
                  color: 'primary.main',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <SettingsIcon sx={{ color: 'primary.main' }} />
                    Actions
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={7} 
                      align="center"
                      sx={{ 
                        py: 8,
                        color: 'text.secondary',
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <PersonIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary">
                          No employees found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add a new employee to get started
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      component={TableRow}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(245, 247, 255, 0.5)',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(61, 82, 160, 0.04)',
                          transform: 'scale(1.001) translateZ(0)',
                          boxShadow: '0 4px 20px rgba(61, 82, 160, 0.08)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TagIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          {index + 1}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32,
                              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                              color: 'white',
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {employee.firstName?.[0]?.toUpperCase() || ''}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {employee.firstName || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.lastName || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="body2">
                            {employee.contact || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {employee.isApproved ? (
                          <Chip 
                            label={`Verified by ${employee.verifiedBy || "Unknown"}`}
                            size="small"
                            className="verification-chip"
                            sx={{ 
                              background: 'linear-gradient(45deg, #059669, #34d399)',
                              color: 'white',
                              fontWeight: 600,
                              border: 'none',
                              borderRadius: '16px',
                              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.15)',
                              '&.verification-chip': {
                                background: 'linear-gradient(45deg, #059669, #34d399) !important',
                              },
                              '& .MuiChip-label': {
                                px: 2,
                              }
                            }}
                          />
                        ) : (
                          <Chip 
                            label="Not Verified"
                            size="small"
                            className="verification-chip"
                            sx={{ 
                              background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                              color: 'white',
                              fontWeight: 600,
                              border: 'none',
                              borderRadius: '16px',
                              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)',
                              '&.verification-chip': {
                                background: 'linear-gradient(45deg, #dc2626, #ef4444) !important',
                              },
                              '& .MuiChip-label': {
                                px: 2,
                              }
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.status || "Pending"}
                          size="small"
                          className="status-chip"
                          sx={{ 
                            background: getStatusColor(employee.status).background,
                            color: 'white',
                            fontWeight: 600,
                            border: 'none',
                            borderRadius: '16px',
                            boxShadow: getStatusColor(employee.status).boxShadow,
                            '&.status-chip': {
                              background: `${getStatusColor(employee.status).background} !important`,
                            },
                            '& .MuiChip-label': {
                              px: 2
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Edit Employee">
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(employee)}
                              size="small"
                              sx={{
                                background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                color: 'white',
                                borderRadius: '8px',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={employee.isDeleted ? "Enable Employee" : "Disable Employee"}>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(employee)}
                              size="small"
                              sx={{
                                background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                                color: 'white',
                                borderRadius: '8px',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default React.memo(EmployeeList); 