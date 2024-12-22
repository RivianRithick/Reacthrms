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
  Fade
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return {
        color: '#059669',
        bgColor: '#d1fae5',
        borderColor: '#34d399'
      };
    case 'inactive':
      return {
        color: '#dc2626',
        bgColor: '#fee2e2',
        borderColor: '#f87171'
      };
    case 'pending':
      return {
        color: '#d97706',
        bgColor: '#fef3c7',
        borderColor: '#fbbf24'
      };
    default:
      return {
        color: '#6b7280',
        bgColor: '#f3f4f6',
        borderColor: '#d1d5db'
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
  assignedEmployees 
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
      <Paper 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          transform: 'translateZ(0)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(135deg, rgba(61, 82, 160, 0.03) 0%, rgba(112, 145, 230, 0.03) 100%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'rgba(61, 82, 160, 0.1)',
          background: 'linear-gradient(to right, rgba(245, 247, 255, 0.8), rgba(232, 236, 255, 0.8))',
          backdropFilter: 'blur(8px)',
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            Employees List
            <Chip 
              label={`Total: ${employees.length}`}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(61, 82, 160, 0.08)',
                color: '#3D52A0',
                fontWeight: 600,
                border: '1px solid',
                borderColor: 'rgba(61, 82, 160, 0.2)',
                '& .MuiChip-label': {
                  px: 2
                }
              }}
            />
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => {
              setSelectedEmployee(null);
              resetForm();
              setShowForm(true);
            }}
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              borderRadius: 3,
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
              },
            }}
          >
            Add Employee
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '5%'
                }}>#</TableCell>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '12%'
                }}>First Name</TableCell>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '12%'
                }}>Last Name</TableCell>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '12%'
                }}>Contact</TableCell>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '15%'
                }}>Email</TableCell>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '17%'
                }}>Verification</TableCell>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '12%'
                }}>Status</TableCell>
                <TableCell sx={{ 
                  backgroundColor: 'rgba(245, 247, 255, 0.95)',
                  fontWeight: 600,
                  color: '#3D52A0',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(61, 82, 160, 0.1)',
                  width: '15%'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={8} 
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
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              background: `linear-gradient(135deg, ${employee.firstName?.[0] ? '#3D52A0' : '#8697C4'}, ${employee.firstName?.[0] ? '#7091E6' : '#ADBBDA'})`,
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: 600,
                              boxShadow: '0 2px 8px rgba(61, 82, 160, 0.15)',
                              border: '2px solid white',
                            }}
                          >
                            {(employee.firstName?.[0] || '').toUpperCase()}
                          </Avatar>
                          <Typography variant="body2">
                            {employee.firstName || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {employee.lastName || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {employee.contact || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {employee.email || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {employee.isApproved ? (
                          <Chip 
                            label={`Verified by ${employee.verifiedBy || "Unknown"}`}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(61, 82, 160, 0.08)',
                              color: '#3D52A0',
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: 'rgba(61, 82, 160, 0.2)',
                              backdropFilter: 'blur(4px)',
                              '& .MuiChip-label': {
                                px: 2,
                              }
                            }}
                          />
                        ) : (
                          <Chip 
                            label="Not Verified"
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(107, 114, 128, 0.1)',
                              color: '#6b7280',
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: 'rgba(107, 114, 128, 0.2)',
                              backdropFilter: 'blur(4px)',
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
                          sx={{ 
                            backgroundColor: getStatusColor(employee.status).bgColor,
                            color: getStatusColor(employee.status).color,
                            border: '1px solid',
                            borderColor: getStatusColor(employee.status).borderColor,
                            fontWeight: 500,
                            backdropFilter: 'blur(4px)',
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEdit(employee)}
                              size="small"
                              sx={{
                                color: 'warning.main',
                                '&:hover': {
                                  backgroundColor: 'warning.light',
                                  transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={employee.isDeleted ? "Enable" : "Disable"}>
                            <IconButton
                              onClick={() => handleDelete(employee)}
                              size="small"
                              sx={{
                                color: employee.isDeleted ? 'success.main' : 'error.main',
                                '&:hover': {
                                  backgroundColor: employee.isDeleted ? 'success.light' : 'error.light',
                                  transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out',
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
      </Paper>
    </motion.div>
  );
};

export default EmployeeList; 