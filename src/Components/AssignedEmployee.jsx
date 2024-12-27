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
  Tooltip,
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
  Tag as TagIcon,
  Domain as DomainIcon,
  Settings as SettingsIcon,
  SearchOff as SearchOffIcon,
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
    return assignedEmployees
      .filter(item => item.isAssigned === true && !item.isDeleted)
      .filter((item) => {
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
    updateLoadingMap(assignedEmployeeId, true);

    try {
      await downloadOfferLetter.mutateAsync(assignedEmployeeId);
      setSuccessMessage("Offer letter downloaded successfully!");
    } catch (error) {
      console.error("Error downloading offer letter:", error);
      setError("Failed to download offer letter.");
    } finally {
      updateLoadingMap(assignedEmployeeId, false);
    }
  }, [downloadOfferLetter]);

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
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
                  gap: 2
                }}
              >
                <WorkIcon sx={{ fontSize: 40 }} />
                Assigned Employee Management
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  icon={<WorkIcon />}
                  label={`Total Records: ${filteredEmployees.length}`}
                  color="primary"
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>
            </Box>

            {/* Search Section */}
            <Paper 
              elevation={0}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: 3,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(61, 82, 160, 0.15)',
              }}
            >
              <TextField
                fullWidth
                placeholder="Search by Employee Name, Client Name, Department Name, or Designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.9)',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Paper>
          </Box>

          {/* Employees List Section */}
          <Paper 
            elevation={0}
            sx={{ 
              backgroundColor: 'background.paper',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              mt: 2,
            }}
          >
            {isLoading ? (
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                py: 8,
                flexDirection: 'column',
                gap: 2
              }}>
                <CircularProgress 
                  size={48} 
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }}
                />
                <Typography variant="h6" color="primary">
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
                <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography variant="h6" color="primary">
                  No assigned employees found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria
                </Typography>
              </Box>
            ) : (
              <TableContainer>
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
                          <WorkIcon sx={{ color: 'primary.main' }} />
                          Employee Name
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessCenterIcon sx={{ color: 'primary.main' }} />
                          Client
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DomainIcon sx={{ color: 'primary.main' }} />
                          Department
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        background: 'linear-gradient(145deg, #F5F7FF, #E8ECFF)',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkIcon sx={{ color: 'primary.main' }} />
                          Designation
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        width: '250px',
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
                                {(item.employee?.firstName?.[0] || '').toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {`${item.employee?.firstName || "N/A"} ${item.employee?.lastName || ""}`}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessCenterIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                              <Typography variant="body2">
                                {item.client?.clientName || "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DomainIcon sx={{ color: 'success.main', fontSize: 20 }} />
                              <Typography variant="body2">
                                {item.department?.departmentName || "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <WorkIcon sx={{ color: 'info.main', fontSize: 20 }} />
                              <Typography variant="body2">
                                {item.jobRole?.jobTitle || "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
                              <Tooltip title={assignedMap.get(item.id)?.hasGeneratedOfferLetter ? "Already Generated" : "Generate Offer Letter"}>
                                <span>
                                  <Button
                                    variant="contained"
                                    disabled={!!assignedMap.get(item.id)?.hasGeneratedOfferLetter || loadingMap[item.id]}
                                    onClick={() => handleGenerateOfferLetter(item.employee?.id, item.id)}
                                    startIcon={loadingMap[item.id] ? 
                                      <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 
                                      <AutorenewIcon />
                                    }
                                    size="small"
                                    sx={{
                                      minWidth: '150px',
                                      background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                                      color: '#FFFFFF',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                                        transform: 'translateY(-1px)',
                                      },
                                      '&.Mui-disabled': {
                                        background: 'rgba(0, 0, 0, 0.12)',
                                        color: 'rgba(0, 0, 0, 0.26)',
                                      },
                                    }}
                                  >
                                    {assignedMap.get(item.id)?.hasGeneratedOfferLetter ? "Generated" : "Generate"}
                                  </Button>
                                </span>
                              </Tooltip>
                              <Tooltip title={!assignedMap.get(item.id)?.hasGeneratedOfferLetter ? "Generate offer letter first" : "Download Offer Letter"}>
                                <span>
                                  <Button
                                    variant="contained"
                                    disabled={!assignedMap.get(item.id)?.hasGeneratedOfferLetter || loadingMap[item.id]}
                                    onClick={() => handleDownloadOfferLetter(assignedMap.get(item.id)?.id)}
                                    startIcon={loadingMap[item.id] ? 
                                      <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 
                                      <DownloadIcon />
                                    }
                                    size="small"
                                    sx={{
                                      minWidth: '150px',
                                      background: 'linear-gradient(45deg, #059669, #34d399)',
                                      color: '#FFFFFF',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #047857, #10b981)',
                                        transform: 'translateY(-1px)',
                                      },
                                      '&.Mui-disabled': {
                                        background: 'rgba(0, 0, 0, 0.12)',
                                        color: 'rgba(0, 0, 0, 0.26)',
                                      },
                                    }}
                                  >
                                    Download
                                  </Button>
                                </span>
                              </Tooltip>
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
