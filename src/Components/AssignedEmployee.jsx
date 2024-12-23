import React, { useState, useCallback, useMemo } from "react";
import useDebounce from '../hooks/useDebounce';
import useAssignedEmployeeData from '../hooks/useAssignedEmployeeData';
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
  TextField,
  CircularProgress,
  Container,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Work as WorkIcon,
  BusinessCenter as BusinessCenterIcon,
  Autorenew as AutorenewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3D52A0',
      light: '#7091E6',
      dark: '#8697C4',
    },
    secondary: {
      main: '#ADBBDA',
      light: '#EDE8F5',
      dark: '#5F739C',
    },
    success: {
      main: '#059669',
      light: '#34d399',
      dark: '#065f46',
    },
    warning: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#92400e',
    },
    error: {
      main: '#dc2626',
      light: '#f87171',
      dark: '#991b1b',
    },
    background: {
      default: '#F5F7FF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #F5F7FF 0%, #E8ECFF 100%)',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
          },
          transition: 'all 0.2s ease-in-out',
          '&.MuiButton-containedSuccess': {
            background: 'linear-gradient(45deg, #059669, #34d399)',
            '&:hover': {
              background: 'linear-gradient(45deg, #047857, #10b981)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(61, 82, 160, 0.08)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(61, 82, 160, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#7091E6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3D52A0',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '&.MuiChip-filled': {
            background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #3D52A0, #7091E6)',
          color: '#FFFFFF',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(61, 82, 160, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: 'rgba(245, 247, 255, 0.95)',
          fontWeight: 600,
          color: '#3D52A0',
          borderBottom: '2px solid',
          borderColor: 'rgba(61, 82, 160, 0.1)',
        },
        root: {
          borderColor: 'rgba(61, 82, 160, 0.08)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(245, 247, 255, 0.5)',
          },
          '&:hover': {
            backgroundColor: 'rgba(61, 82, 160, 0.04)',
            transform: 'scale(1.001) translateZ(0)',
            boxShadow: '0 4px 20px rgba(61, 82, 160, 0.08)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
  },
});

const baseUrl = process.env.REACT_APP_BASE_URL;

const AssignedEmployee = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMap, setLoadingMap] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use assigned employee data hook
  const {
    assignedEmployees,
    assignedMap,
    isLoading,
    error: apiError,
    generateOfferLetter,
    downloadOfferLetter
  } = useAssignedEmployeeData(debouncedSearchQuery);

  // Memoize filtered employees
  const filteredEmployees = useMemo(() => {
    if (!assignedEmployees) return [];
    const searchLower = debouncedSearchQuery.toLowerCase();
    return assignedEmployees.filter((item) => {
      const employeeName = `${item.employee?.firstName || ""} ${item.employee?.lastName || ""}`.toLowerCase();
      const clientName = item.client?.clientName?.toLowerCase() || "";
      const departmentName = item.department?.departmentName?.toLowerCase() || "";
      const jobTitle = item.jobRole?.jobTitle?.toLowerCase() || "";

      return (
        employeeName.includes(searchLower) ||
        clientName.includes(searchLower) ||
        departmentName.includes(searchLower) ||
        jobTitle.includes(searchLower)
      );
    });
  }, [assignedEmployees, debouncedSearchQuery]);

  // Handler functions with useCallback
  const updateLoadingMap = useCallback((id, isLoading) => {
    setLoadingMap(prev => ({
      ...prev,
      [id]: isLoading
    }));
  }, []);

  const handleGenerateOfferLetter = useCallback(async (employeeId, roleAssignId) => {
    setError("");
    setSuccessMessage("");
    updateLoadingMap(roleAssignId, true);

    try {
      await generateOfferLetter.mutateAsync({
        employeeId,
        roleAssignId,
        generatedBy: "Admin",
      });
      setSuccessMessage("Offer letter generated successfully!");
    } catch (error) {
      console.error("Error generating offer letter:", error);
      setError("Failed to generate offer letter.");
    } finally {
      updateLoadingMap(roleAssignId, false);
    }
  }, [generateOfferLetter]);

  const handleDownloadOfferLetter = useCallback(async (assignedEmployeeId) => {
    setError("");
    const roleAssignId = assignedEmployees.find(
      emp => assignedMap.get(emp.id)?.id === assignedEmployeeId
    )?.id;
    updateLoadingMap(roleAssignId, true);

    try {
      await downloadOfferLetter.mutateAsync(assignedEmployeeId);
      setSuccessMessage("Offer letter downloaded successfully!");
    } catch (error) {
      console.error("Error downloading offer letter:", error);
      setError("Failed to download offer letter.");
    } finally {
      updateLoadingMap(roleAssignId, false);
    }
  }, [assignedEmployees, assignedMap, downloadOfferLetter]);

  // Effect for handling messages timeout
  React.useEffect(() => {
    if (successMessage || error || apiError) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, apiError]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              textAlign: "center", 
              color: "primary.main",
              marginBottom: 4
            }}
          >
            Assigned Employee Management
          </Typography>

          {/* Search & Filters Section */}
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
                <BusinessCenterIcon sx={{ color: 'primary.main' }} />
                Search & Filters
              </Typography>

              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  placeholder="Search by Employee Name, Client Name, Department Name, or Job Title..."
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
            </Paper>
          </motion.div>

          {/* Employees List Section */}
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
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <WorkIcon sx={{ color: 'primary.main' }} />
                  Assigned Employees List
                  <Chip 
                    label={`Total: ${filteredEmployees.length}`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                      fontWeight: 500,
                      ml: 2
                    }}
                  />
                </Typography>
              </Box>

              {isLoading ? (
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  minHeight: "400px",
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <CircularProgress size={48} thickness={4} />
                  <Typography variant="body1" color="text.secondary">
                    Loading employee data...
                  </Typography>
                </Box>
              ) : filteredEmployees.length === 0 ? (
                <Box sx={{ 
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Typography variant="h6" color="text.secondary">
                    No assigned employees found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 'calc(100vh - 50px)' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          backgroundColor: 'background.paper',
                          fontWeight: 600,
                          color: 'text.primary',
                          borderBottom: '2px solid',
                          borderColor: 'primary.light',
                        }}>#</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'background.paper',
                          fontWeight: 600,
                          color: 'text.primary',
                          borderBottom: '2px solid',
                          borderColor: 'primary.light',
                        }}>Employee Name</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'background.paper',
                          fontWeight: 600,
                          color: 'text.primary',
                          borderBottom: '2px solid',
                          borderColor: 'primary.light',
                        }}>Client</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'background.paper',
                          fontWeight: 600,
                          color: 'text.primary',
                          borderBottom: '2px solid',
                          borderColor: 'primary.light',
                        }}>Department</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'background.paper',
                          fontWeight: 600,
                          color: 'text.primary',
                          borderBottom: '2px solid',
                          borderColor: 'primary.light',
                        }}>Job Role</TableCell>
                        <TableCell sx={{ 
                          backgroundColor: 'background.paper',
                          fontWeight: 600,
                          color: 'text.primary',
                          borderBottom: '2px solid',
                          borderColor: 'primary.light',
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <AnimatePresence>
                        {filteredEmployees.map((item, index) => (
                          <motion.tr
                            key={item.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            component={TableRow}
                            sx={{
                              '&:nth-of-type(odd)': {
                                backgroundColor: 'action.hover',
                              },
                              '&:hover': {
                                backgroundColor: 'action.selected',
                              },
                              transition: 'background-color 0.2s ease-in-out',
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar 
                                  sx={{ 
                                    width: 32, 
                                    height: 32,
                                    backgroundColor: 'primary.light',
                                    color: 'primary.main',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                  }}
                                >
                                  {(item.employee?.firstName?.[0] || '').toUpperCase()}
                                </Avatar>
                                <Typography variant="body2">
                                  {`${item.employee?.firstName || "N/A"} ${item.employee?.lastName || ""}`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {item.client?.clientName || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {item.department?.departmentName || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {item.jobRole?.jobTitle || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ 
                                display: "flex", 
                                gap: 2
                              }}>
                                <Button
                                  variant="contained"
                                  disabled={!!assignedMap.get(item.id)?.hasGeneratedOfferLetter || loadingMap[item.id]}
                                  onClick={() => handleGenerateOfferLetter(item.employee?.id, item.id)}
                                  startIcon={loadingMap[item.id] ? 
                                    <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 
                                    <AutorenewIcon />
                                  }
                                  sx={{
                                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                    color: '#FFFFFF',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    padding: '10px 24px',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                                    },
                                    '&.Mui-disabled': {
                                      background: 'rgba(0, 0, 0, 0.12)',
                                      color: 'rgba(0, 0, 0, 0.26)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                  }}
                                >
                                  {assignedMap.get(item.id)?.hasGeneratedOfferLetter ? "Generated" : "Generate"}
                                </Button>
                                <Button
                                  variant="contained"
                                  disabled={!assignedMap.get(item.id)?.hasGeneratedOfferLetter || loadingMap[item.id]}
                                  onClick={() => handleDownloadOfferLetter(assignedMap.get(item.id)?.id)}
                                  startIcon={loadingMap[item.id] ? 
                                    <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 
                                    <DownloadIcon />
                                  }
                                  sx={{
                                    background: 'linear-gradient(45deg, #059669, #34d399)',
                                    color: '#FFFFFF',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    padding: '10px 24px',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      background: 'linear-gradient(45deg, #047857, #10b981)',
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                                    },
                                    '&.Mui-disabled': {
                                      background: 'rgba(0, 0, 0, 0.12)',
                                      color: 'rgba(0, 0, 0, 0.26)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                  }}
                                >
                                  Download
                                </Button>
                              </Box>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </motion.div>

          {/* Toast Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                  zIndex: 2000
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Paper>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                  zIndex: 2000
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'success.main',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="body2">{successMessage}</Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
});

export default AssignedEmployee;
