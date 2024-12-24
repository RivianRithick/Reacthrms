import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  styled,
  InputAdornment,
  Paper,
} from '@mui/material';
import { MdBlock } from "react-icons/md";
import { FaIdCard } from "react-icons/fa";
import DocumentUpload from './DocumentUpload';
import { bloodGroups, documentTypes } from '../../constants';
import useOnboardingManagerData from '../../hooks/useOnboardingManagerData';
import useRecruiterData from '../../hooks/useRecruiterData';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Bloodtype as BloodtypeIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  Favorite as FavoriteIcon,
  Phone as PhoneIcon,
  CreditCard as CreditCardIcon,
  Badge as BadgeIcon,
  People as PeopleIcon,
  LocationOn as LocationOnIcon,
  ContentCopy as ContentCopyIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  PinDrop as PinDropIcon,
  AccountBalance as AccountBalanceIcon,
  Numbers as NumbersIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  Work as WorkIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from '@mui/icons-material';

// Styled Components
const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiStepLabel-root .Mui-completed': {
    color: '#3D52A0',
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: '#7091E6',
  },
  '& .MuiStepLabel-label': {
    marginTop: theme.spacing(0.5),
    fontSize: '0.875rem',
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontSize: '1.75rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(61, 82, 160, 0.08)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const formStyles = {
  formField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
        }
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderWidth: '2px',
          borderColor: 'primary.main',
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      '&.Mui-focused': {
        color: 'primary.main'
      }
    },
  },
  sectionTitle: {
    color: 'text.primary',
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&::after': {
      content: '""',
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg, rgba(61, 82, 160, 0.2), transparent)',
    },
  },
  documentCard: {
    height: '100%',
  },
};

const steps = [
  'Basic Info',
  'Family Details',
  'Address',
  'Bank Details',
  'Previous Employment',
  'Documents',
  'Assignments',
];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const indianBanks = [
  "State Bank of India",
  "Punjab National Bank",
  "Bank of Baroda",
  "Bank of India",
  "Canara Bank",
  "Union Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "Indian Overseas Bank",
  "UCO Bank",
  "Bank of Maharashtra",
  "Punjab & Sind Bank",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Yes Bank",
  "IDBI Bank",
  "Federal Bank",
  "South Indian Bank",
  "Karnataka Bank",
  "Bandhan Bank",
  "IDFC First Bank",
  "RBL Bank",
  "City Union Bank",
  "Karur Vysya Bank",
  "Tamilnad Mercantile Bank",
  "CSB Bank",
  "DCB Bank",
  "Dhanlaxmi Bank",
  "Jammu & Kashmir Bank",
  "Nainital Bank",
  "AU Small Finance Bank",
  "Equitas Small Finance Bank",
  "Ujjivan Small Finance Bank",
  "Jana Small Finance Bank"
];

const EmployeeForm = ({
  employee,
  handleChange,
  handleContactChange,
  handleSubmit,
  isLoading,
  selectedEmployee,
  resetForm,
  assignedEmployees,
  setEmployee,
  setBlockDialogOpen,
  setTempIsBlocked,
  setBlockRemarksDialogOpen,
  handleVerifyEmployee,
  handleBlockEmployee,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { managers = [], isLoading: managersLoading } = useOnboardingManagerData();
  const { recruiters = [], isLoading: recruitersLoading } = useRecruiterData();

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const handleNextTab = () => {
    setActiveTab((prev) => Math.min(prev + 1, 6));
  };

  const handlePreviousTab = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const copyPresentToPermanent = () => {
    setEmployee(prev => ({
      ...prev,
      permanentAddress: prev.presentAddress,
      permanentState: prev.presentState,
      permanentDistrict: prev.presentDistrict,
    }));
  };

  const handleAssignOnboardingManager = async (managerId) => {
    try {
      handleChange({
        target: {
          name: 'onboardingManagerId',
          value: managerId || ""
        }
      });
    } catch (error) {
      toast.error(error.message || 'Failed to update onboarding manager');
    }
  };

  const handleAssignRecruiter = async (recruiterId) => {
    try {
      handleChange({
        target: {
          name: 'recruiterId',
          value: recruiterId || ""
        }
      });
    } catch (error) {
      toast.error(error.message || 'Failed to update recruiter');
    }
  };

  if (!selectedEmployee) {
    return (
      <StyledCard
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(61, 82, 160, 0.1)',
          boxShadow: '0 8px 32px rgba(61, 82, 160, 0.1)',
        }}
      >
        <Box sx={{ 
          textAlign: 'center',
          mb: 4,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20px',
            left: '10%',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(61, 82, 160, 0.2), transparent)',
          }
        }}>
          <GradientTypography variant="h4">
            Create New Employee
          </GradientTypography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              mt: 1,
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Enter the contact number to create a new employee profile. Make sure to use the correct format.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          px: { xs: 2, sm: 4 },
          py: 4
        }}>
          <TextField
            fullWidth
            label="Contact Number"
            name="contact"
            value={employee.contact}
            onChange={handleContactChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px',
                    borderColor: 'primary.main',
                  }
                }
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: 'primary.main'
                }
              }
            }}
            helperText="Format: +91 followed by 10 digits"
          />

          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            justifyContent: "center",
            mt: 2
          }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading}
              sx={{
                minWidth: '180px',
                background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                color: '#FFFFFF',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '12px 32px',
                boxShadow: '0 4px 12px rgba(61, 82, 160, 0.18)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(61, 82, 160, 0.25)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                  boxShadow: 'none',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                  <span>Creating...</span>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddIcon />
                  <span>Create Employee</span>
                </Box>
              )}
            </Button>
            <Button 
              variant="outlined" 
              onClick={resetForm}
              startIcon={<CancelIcon />}
              sx={{
                minWidth: '120px',
                background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '12px 32px',
                border: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </StyledCard>
    );
  }

  return (
    <Box 
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <StyledCard sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(61, 82, 160, 0.1)',
        boxShadow: '0 8px 32px rgba(61, 82, 160, 0.1)',
      }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: 4,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20px',
            left: '10%',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(61, 82, 160, 0.2), transparent)',
          }
        }}>
          <GradientTypography>
            Edit Employee Profile
          </GradientTypography>
          <Typography variant="body1" sx={{ 
            color: 'text.secondary',
            mt: 1,
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Update employee information and documents
          </Typography>
        </Box>

        <StyledStepper 
          activeStep={activeTab} 
          alternativeLabel
          sx={{
            '& .MuiStepLabel-root .Mui-active': {
              color: '#7091E6',
              '& .MuiStepIcon-text': {
                fill: '#FFFFFF',
              }
            },
            '& .MuiStepLabel-root .Mui-completed': {
              color: '#3D52A0',
            },
            '& .MuiStepConnector-line': {
              borderColor: 'rgba(61, 82, 160, 0.2)',
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        <StyledCard sx={{ 
          mb: 4,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(61, 82, 160, 0.1)',
          boxShadow: '0 4px 20px rgba(61, 82, 160, 0.08)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(61, 82, 160, 0.12)',
          },
          transition: 'all 0.3s ease-in-out',
        }}>
          {/* Basic Info Tab */}
          {activeTab === 0 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}>
                  <PersonIcon sx={{ 
                    fontSize: 24,
                    color: 'white',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    borderRadius: '8px',
                    p: 1,
                  }} />
                  <Typography variant="h6" sx={formStyles.sectionTitle}>
                    Basic Information
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={employee.firstName || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={employee.lastName || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={employee.email || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    name="bloodGroup"
                    value={employee.bloodGroup || ""}
                    onChange={handleChange}
                    label="Blood Group"
                    startAdornment={
                      <InputAdornment position="start">
                        <BloodtypeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="">Select Blood Group</MenuItem>
                    {bloodGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={employee.dateOfBirth || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={employee.gender || ""}
                    onChange={handleChange}
                    label="Gender"
                    startAdornment={
                      <InputAdornment position="start">
                        <WcIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    name="maritalStatus"
                    value={employee.maritalStatus || ""}
                    onChange={handleChange}
                    label="Marital Status"
                    startAdornment={
                      <InputAdornment position="start">
                        <FavoriteIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Contact"
                  name="alternateContact"
                  value={employee.alternateContact || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Number"
                  name="aadhaarNumber"
                  value={employee.aadhaarNumber || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  name="panNumber"
                  value={employee.panNumber || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Family Details Tab */}
          {activeTab === 1 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}>
                  <PeopleIcon sx={{ 
                    fontSize: 24,
                    color: 'white',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    borderRadius: '8px',
                    p: 1,
                  }} />
                  <Typography variant="h6" sx={formStyles.sectionTitle}>
                    Family Details
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  name="fatherName"
                  value={employee.fatherName || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mother's Name"
                  name="motherName"
                  value={employee.motherName || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Father's Date of Birth"
                  type="date"
                  name="fatherDateOfBirth"
                  value={employee.fatherDateOfBirth || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mother's Date of Birth"
                  type="date"
                  name="motherDateOfBirth"
                  value={employee.motherDateOfBirth || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Spouse Name"
                  name="spouseName"
                  value={employee.spouseName || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Spouse Date of Birth"
                  type="date"
                  name="spouseDateOfBirth"
                  value={employee.spouseDateOfBirth || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Bank Details Tab */}
          {activeTab === 3 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}>
                  <AccountBalanceIcon sx={{ 
                    fontSize: 24,
                    color: 'white',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    borderRadius: '8px',
                    p: 1,
                  }} />
                  <Typography variant="h6" sx={formStyles.sectionTitle}>
                    Bank Details
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="bankAccountNumber"
                  value={employee.bankAccountNumber || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  name="bankAccountName"
                  value={employee.bankAccountName || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Bank Name</InputLabel>
                  <Select
                    name="bankName"
                    value={employee.bankName || ""}
                    onChange={handleChange}
                    label="Bank Name"
                    startAdornment={
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="">Select Bank</MenuItem>
                    {indianBanks.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  name="ifscCode"
                  value={employee.ifscCode || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CodeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Previous Employment Tab */}
          {activeTab === 4 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}>
                  <WorkIcon sx={{ 
                    fontSize: 24,
                    color: 'white',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    borderRadius: '8px',
                    p: 1,
                  }} />
                  <Typography variant="h6" sx={formStyles.sectionTitle}>
                    Previous Employment
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="UAN Number"
                  name="previousUANNumber"
                  value={employee.previousUANNumber || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ESIC Number"
                  name="previousESICNumber"
                  value={employee.previousESICNumber || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Documents Tab */}
          {activeTab === 5 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  <FaIdCard size={20} />
                  Identity Documents
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <DocumentUpload
                      label="Candidate Photo"
                      filePath={employee.candidatePhotoPath}
                      documentType="CANDIDATE_PHOTO"
                      contact={employee.contact}
                      description="Upload your recent photo"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        candidatePhotoPath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DocumentUpload
                      label="PAN Card"
                      filePath={employee.panCardFilePath}
                      documentType="PAN_CARD"
                      contact={employee.contact}
                      description="Upload PAN Card"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        panCardFilePath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DocumentUpload
                      label="Aadhaar Card"
                      filePath={employee.aadhaarCardFilePath}
                      documentType="AADHAAR_CARD"
                      contact={employee.contact}
                      description="Upload Aadhaar Card"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        aadhaarCardFilePath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DocumentUpload
                      label="Voter ID"
                      filePath={employee.voterIdPath}
                      documentType="VOTER_ID"
                      contact={employee.contact}
                      description="Upload Voter ID"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        voterIdPath: filePath
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  Educational Documents
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="10th Certificate"
                      filePath={employee.tenthCertificatePath}
                      documentType="TENTH_CERTIFICATE"
                      contact={employee.contact}
                      description="Upload 10th Certificate"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        tenthCertificatePath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="12th Certificate"
                      filePath={employee.twelthCertificatePath}
                      documentType="TWELTH_CERTIFICATE"
                      contact={employee.contact}
                      description="Upload 12th Certificate"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        twelthCertificatePath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="Degree Certificate"
                      filePath={employee.degreeCertificatePath}
                      documentType="DEGREE_CERTIFICATE"
                      contact={employee.contact}
                      description="Upload Degree Certificate"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        degreeCertificatePath: filePath
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  Professional Documents
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="Offer Letter"
                      filePath={employee.offerLetterPath}
                      documentType="OFFER_LETTER"
                      contact={employee.contact}
                      description="Upload Offer Letter"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        offerLetterPath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="Experience Letter"
                      filePath={employee.experienceLetterPath}
                      documentType="EXPERIENCE_LETTER"
                      contact={employee.contact}
                      description="Upload Experience Letter"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        experienceLetterPath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="Payslip"
                      filePath={employee.payslipPath}
                      documentType="PAYSLIP"
                      contact={employee.contact}
                      description="Upload Latest Payslip"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        payslipPath: filePath
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  Family Documents
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Family Photo"
                      filePath={employee.familyPhotoPath}
                      documentType="FAMILY_PHOTO"
                      contact={employee.contact}
                      description="Upload Family Photo (JPG or PNG)"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        familyPhotoPath: filePath
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DocumentUpload
                      label="Bank Passbook"
                      filePath={employee.passbookFilePath}
                      documentType="PASSBOOK"
                      contact={employee.contact}
                      description="Upload Bank Passbook"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        passbookFilePath: filePath
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}

          {/* Address Tab */}
          {activeTab === 2 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}>
                  <HomeIcon sx={{ 
                    fontSize: 24,
                    color: 'white',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    borderRadius: '8px',
                    p: 1,
                  }} />
                  <Typography variant="h6" sx={formStyles.sectionTitle}>
                    Address Information
                  </Typography>
                </Box>
              </Grid>

              {/* Present Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  mt: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <LocationOnIcon sx={{ color: 'primary.main' }} />
                  Present Address
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Present Address"
                  name="presentAddress"
                  value={employee.presentAddress || ""}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Present State</InputLabel>
                  <Select
                    name="presentState"
                    value={employee.presentState || ""}
                    onChange={handleChange}
                    label="Present State"
                    startAdornment={
                      <InputAdornment position="start">
                        <PublicIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {indianStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Present District"
                  name="presentDistrict"
                  value={employee.presentDistrict || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>

              {/* Permanent Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  mt: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <ApartmentIcon sx={{ color: 'primary.main' }} />
                  Permanent Address
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Permanent Address"
                  name="permanentAddress"
                  value={employee.permanentAddress || ""}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApartmentIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={formStyles.formField}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={copyPresentToPermanent}
                  startIcon={<ContentCopyIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    color: 'white',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 24px',
                    border: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Copy Present Address to Permanent Address
                </Button>
              </Grid>
            </Grid>
          )}

          {/* New Assignments Tab */}
          {activeTab === 6 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}>
                  <AssignmentIcon sx={{ 
                    fontSize: 24,
                    color: 'white',
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    borderRadius: '8px',
                    p: 1,
                  }} />
                  <Typography variant="h6" sx={formStyles.sectionTitle}>
                    Employee Assignments
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Onboarding Manager</InputLabel>
                  <Select
                    name="onboardingManagerId"
                    value={employee.onboardingManagerId || ""}
                    onChange={(e) => handleAssignOnboardingManager(e.target.value)}
                    label="Onboarding Manager"
                    disabled={managersLoading}
                    startAdornment={
                      <InputAdornment position="start">
                        <SupervisorAccountIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="">Select Onboarding Manager</MenuItem>
                    {managers.filter(m => m.isActive).map((manager) => (
                      <MenuItem key={manager.onboardingManagerId} value={manager.onboardingManagerId}>
                        {`${manager.firstName} ${manager.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Recruiter</InputLabel>
                  <Select
                    name="recruiterId"
                    value={employee.recruiterId || ""}
                    onChange={(e) => handleAssignRecruiter(e.target.value)}
                    label="Recruiter"
                    disabled={recruitersLoading}
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(61, 82, 160, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      }
                    }}
                  >
                    <MenuItem value="">Select Recruiter</MenuItem>
                    {recruiters.filter(r => r.isActive).map((recruiter) => (
                      <MenuItem key={recruiter.recruiterId} value={recruiter.recruiterId}>
                        {`${recruiter.firstName} ${recruiter.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </StyledCard>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 3,
          pt: 3,
          borderTop: '1px solid rgba(61, 82, 160, 0.1)',
        }}>
          <Button
            onClick={handlePreviousTab}
            disabled={activeTab === 0}
            sx={{
              background: 'linear-gradient(45deg, #6B7DB3, #A5B4E2)',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              opacity: activeTab === 0 ? 0.5 : 1,
              '&:hover': {
                background: 'linear-gradient(45deg, #5A6B99, #8E9CC8)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&.Mui-disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Previous
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={resetForm}
              startIcon={<CancelIcon />}
              sx={{
                minWidth: '120px',
                background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '12px 32px',
                border: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Cancel
            </Button>
            {activeTab === steps.length - 1 ? (
              <Button 
                onClick={() => {
                  console.log('Save button clicked');
                  console.log('Current employee data:', employee);
                  console.log('Selected employee:', selectedEmployee);
                  handleSubmit(employee);
                }}
                variant="contained"
                disabled={isLoading}
                sx={{
                  minWidth: '180px',
                  background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: '10px 24px',
                  boxShadow: '0 4px 12px rgba(61, 82, 160, 0.18)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(61, 82, 160, 0.25)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'inherit' }} />
                    <span>Saving...</span>
                  </Box>
                ) : (
                  'Save Changes'
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNextTab}
                variant="contained"
                sx={{
                  minWidth: '120px',
                  background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  padding: '10px 24px',
                  boxShadow: '0 4px 12px rgba(61, 82, 160, 0.18)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(61, 82, 160, 0.25)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </StyledCard>

      {/* Action Buttons */}
      <StyledCard sx={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(61, 82, 160, 0.1)',
        boxShadow: '0 8px 32px rgba(61, 82, 160, 0.1)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Button
            variant="contained"
            color={employee.isApproved ? "error" : "success"}
            onClick={() => {
              setBlockDialogOpen(true);
              setTempIsBlocked(!employee.isBlocked);
            }}
            disabled={assignedEmployees.some(id => id === employee.id)}
            sx={{
              minWidth: '200px',
              background: employee.isApproved 
                ? 'linear-gradient(45deg, #dc2626, #ef4444)'
                : 'linear-gradient(45deg, #059669, #34d399)',
              color: '#FFFFFF',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 32px',
              boxShadow: '0 4px 12px rgba(61, 82, 160, 0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                background: employee.isApproved 
                  ? 'linear-gradient(45deg, #b91c1c, #dc2626)'
                  : 'linear-gradient(45deg, #047857, #10b981)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(61, 82, 160, 0.25)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&.Mui-disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {employee.isApproved ? (
              <>
                <MdBlock size={20} />
                {assignedEmployees.some(id => id === employee.id) ? 
                  'Cannot Unverify (Assigned)' : 
                  'Unverify Employee'
                }
              </>
            ) : (
              <>
                <FaIdCard size={20} />
                {assignedEmployees.some(id => id === employee.id) ? 
                  'Cannot Verify (Assigned)' : 
                  'Verify Employee'
                }
              </>
            )}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setBlockDialogOpen(true);
              setTempIsBlocked(!employee.isBlocked);
            }}
            disabled={employee.isApproved}
            sx={{
              minWidth: '200px',
              background: employee.isBlocked 
                ? 'linear-gradient(45deg, #059669, #34d399)'
                : 'linear-gradient(45deg, #dc2626, #ef4444)',
              color: '#FFFFFF',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 32px',
              boxShadow: '0 4px 12px rgba(61, 82, 160, 0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                background: employee.isBlocked 
                  ? 'linear-gradient(45deg, #047857, #10b981)'
                  : 'linear-gradient(45deg, #b91c1c, #dc2626)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(61, 82, 160, 0.25)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&.Mui-disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {employee.isBlocked ? (
              <>
                <MdBlock size={20} />
                Unblock Employee
              </>
            ) : (
              <>
                <MdBlock size={20} />
                Block Employee
              </>
            )}
          </Button>
        </Box>
      </StyledCard>
    </Box>
  );
};

export default EmployeeForm; 