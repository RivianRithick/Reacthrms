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
  Tooltip
} from '@mui/material';
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success.main';
    case 'inactive':
      return 'error.main';
    case 'pending':
      return 'warning.main';
    default:
      return 'text.secondary';
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
  return (
    <Box sx={{ 
      backgroundColor: '#fff',
      borderRadius: 2,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: 3,
      width: '100%',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 3
      }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Employees List
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setSelectedEmployee(null);
            resetForm();
            setShowForm(true);
          }}
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
          <IoIosAddCircle sx={{ marginRight: 1 }} /> Add Employee
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 2,
          width: '100%',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '5%' }}>#</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '12%' }}>First Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '12%' }}>Last Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '12%' }}>Contact</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '17%' }}>Verification Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '12%' }}>Active Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={8} 
                  align="center"
                  sx={{ 
                    py: 4,
                    color: 'text.secondary',
                    fontSize: '1.1rem'
                  }}
                >
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee, index) => (
                <TableRow 
                  key={employee.id}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <TableCell sx={{ width: '5%' }}>{index + 1}</TableCell>
                  <TableCell sx={{ width: '12%' }}>
                    <Tooltip title={employee.firstName || "N/A"}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {employee.firstName || "N/A"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ width: '12%' }}>
                    <Tooltip title={employee.lastName || "N/A"}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {employee.lastName || "N/A"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ width: '12%' }}>
                    <Tooltip title={employee.contact || "N/A"}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {employee.contact || "N/A"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <Tooltip title={employee.email || "N/A"}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {employee.email || "N/A"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ width: '17%' }}>
                    {employee.isApproved ? (
                      <Tooltip 
                        title={`Verified on: ${
                          employee.verifiedOn 
                            ? new Date(employee.verifiedOn).toLocaleDateString()
                            : 'Date not available'
                        }`}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'success.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          ✓ Verified by {employee.verifiedBy || "Unknown"}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Not Verified
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ width: '12%' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: getStatusColor(employee.status),
                        fontWeight: 'medium',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {employee.status || "Pending"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit">
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => handleEdit(employee)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            padding: '4px 8px',
                            minWidth: 'auto',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          <FaEdit style={{ fontSize: '14px' }} />
                        </Button>
                      </Tooltip>
                      <Tooltip title={employee.isDeleted ? "Enable" : "Disable"}>
                        <span>
                          <Button
                            onClick={() => handleDelete(employee)}
                            variant="contained"
                            color={employee.isDeleted ? "success" : "error"}
                            size="small"
                            disabled={employee.isBlocked || employee.isApproved}
                            sx={{
                              borderRadius: 1,
                              textTransform: 'none',
                              padding: '4px 8px',
                              minWidth: 'auto',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                transition: 'transform 0.2s'
                              }
                            }}
                          >
                            <MdDelete style={{ fontSize: '14px' }} />
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeList; 