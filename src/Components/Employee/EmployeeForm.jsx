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
} from '@mui/material';
import { MdBlock } from "react-icons/md";
import { FaIdCard } from "react-icons/fa";
import DocumentUpload from './DocumentUpload';
import { bloodGroups, documentTypes } from '../../constants';
import useOnboardingManagerData from '../../hooks/useOnboardingManagerData';
import useRecruiterData from '../../hooks/useRecruiterData';
import { toast } from 'react-toastify';

// Styled Components
const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
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
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const StyledCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(61, 82, 160, 0.05)',
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
      borderRadius: '12px',
      transition: 'all 0.2s ease-in-out',
      '&:hover fieldset': {
        borderColor: '#7091E6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3D52A0',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#3D52A0',
    },
  },
  sectionTitle: {
    color: '#3D52A0',
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: 2,
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
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <GradientTypography variant="h4" align="center">
          Create New Employee
        </GradientTypography>
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 4 
          }}
        >
          Enter contact number to create a new employee profile
        </Typography>

        <TextField
          fullWidth
          label="Contact Number"
          name="contact"
          value={employee.contact}
          onChange={handleContactChange}
          required
          sx={{ 
            mb: 4,
            ...formStyles.formField
          }}
          helperText="Format: +91 followed by 10 digits"
        />

        <Box sx={{ 
          display: "flex", 
          gap: 2, 
          justifyContent: "center"
        }}>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              color: '#FFFFFF',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 32px',
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
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'inherit' }} />
                Creating...
              </Box>
            ) : (
              'Create Employee'
            )}
          </Button>
          <Button 
            variant="outlined" 
            onClick={resetForm}
            sx={{
              borderColor: '#3D52A0',
              color: '#3D52A0',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 32px',
              '&:hover': {
                borderColor: '#2A3B7D',
                backgroundColor: 'rgba(61, 82, 160, 0.04)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Cancel
          </Button>
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
      <StyledCard sx={{ mb: 3 }}>
        <Box sx={{ 
          borderBottom: '1px solid rgba(61, 82, 160, 0.1)', 
          pb: 3, 
          mb: 4,
          textAlign: 'center'
        }}>
          <GradientTypography>
            Edit Employee Profile
          </GradientTypography>
          <Typography variant="body1" color="text.secondary">
            Update employee information and documents
          </Typography>
        </Box>

        <StyledStepper activeStep={activeTab} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        <StyledCard sx={{ mb: 4 }}>
          {/* Basic Info Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={employee.firstName || ""}
                  onChange={handleChange}
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
                    sx={formStyles.formField}
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
                    sx={formStyles.formField}
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
                    sx={formStyles.formField}
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
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Family Details Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  name="fatherName"
                  value={employee.fatherName || ""}
                  onChange={handleChange}
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
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Address Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Present Address"
                  name="presentAddress"
                  value={employee.presentAddress || ""}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Present State"
                  name="presentState"
                  value={employee.presentState || ""}
                  onChange={handleChange}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Present District"
                  name="presentDistrict"
                  value={employee.presentDistrict || ""}
                  onChange={handleChange}
                  sx={formStyles.formField}
                />
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
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={copyPresentToPermanent}
                  sx={{
                    borderColor: '#3D52A0',
                    color: '#3D52A0',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 16px',
                    '&:hover': {
                      borderColor: '#2A3B7D',
                      backgroundColor: 'rgba(61, 82, 160, 0.04)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Copy Present Address to Permanent Address
                </Button>
              </Grid>
            </Grid>
          )}

          {/* Bank Details Tab */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Account Name"
                  name="bankAccountName"
                  value={employee.bankAccountName || ""}
                  onChange={handleChange}
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
                    sx={formStyles.formField}
                  >
                    <MenuItem value="">Select Bank</MenuItem>
                    <MenuItem value="State Bank of India">State Bank of India</MenuItem>
                    <MenuItem value="Punjab National Bank">Punjab National Bank</MenuItem>
                    <MenuItem value="Bank of Baroda">Bank of Baroda</MenuItem>
                    <MenuItem value="Bank of India">Bank of India</MenuItem>
                    <MenuItem value="Canara Bank">Canara Bank</MenuItem>
                    <MenuItem value="Union Bank of India">Union Bank of India</MenuItem>
                    <MenuItem value="HDFC Bank">HDFC Bank</MenuItem>
                    <MenuItem value="ICICI Bank">ICICI Bank</MenuItem>
                    <MenuItem value="Axis Bank">Axis Bank</MenuItem>
                    <MenuItem value="Kotak Mahindra Bank">Kotak Mahindra Bank</MenuItem>
                    <MenuItem value="IndusInd Bank">IndusInd Bank</MenuItem>
                    <MenuItem value="Yes Bank">Yes Bank</MenuItem>
                    <MenuItem value="IDBI Bank">IDBI Bank</MenuItem>
                    <MenuItem value="Federal Bank">Federal Bank</MenuItem>
                    <MenuItem value="South Indian Bank">South Indian Bank</MenuItem>
                    <MenuItem value="Karnataka Bank">Karnataka Bank</MenuItem>
                    <MenuItem value="Indian Bank">Indian Bank</MenuItem>
                    <MenuItem value="Indian Overseas Bank">Indian Overseas Bank</MenuItem>
                    <MenuItem value="UCO Bank">UCO Bank</MenuItem>
                    <MenuItem value="Bank of Maharashtra">Bank of Maharashtra</MenuItem>
                    <MenuItem value="Central Bank of India">Central Bank of India</MenuItem>
                    <MenuItem value="Punjab & Sind Bank">Punjab & Sind Bank</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="bankAccountNumber"
                  value={employee.bankAccountNumber || ""}
                  onChange={handleChange}
                  sx={formStyles.formField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  name="ifscCode"
                  value={employee.ifscCode || ""}
                  onChange={handleChange}
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Previous Employment Tab */}
          {activeTab === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="UAN Number"
                  name="previousUANNumber"
                  value={employee.previousUANNumber || ""}
                  onChange={handleChange}
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
                  sx={formStyles.formField}
                />
              </Grid>
            </Grid>
          )}

          {/* Documents Tab */}
          {activeTab === 5 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Identity Documents */}
              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  Identity Documents
                </Typography>
                <Grid container spacing={3}>
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
                      description="Upload PAN Card (PDF or Image)"
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
                      description="Upload Aadhaar Card (PDF or Image)"
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
                      description="Upload Voter ID (PDF or Image)"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        voterIdPath: filePath
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Educational Documents */}
              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  Educational Documents
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="10th Certificate"
                      filePath={employee.tenthCertificatePath}
                      documentType="TENTH_CERTIFICATE"
                      contact={employee.contact}
                      description="Upload 10th Certificate (PDF or Image)"
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
                      description="Upload 12th Certificate (PDF or Image)"
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
                      description="Upload Degree Certificate (PDF or Image)"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        degreeCertificatePath: filePath
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Professional Documents */}
              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  Professional Documents
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DocumentUpload
                      label="Offer Letter"
                      filePath={employee.offerLetterPath}
                      documentType="OFFER_LETTER"
                      contact={employee.contact}
                      description="Upload Offer Letter (PDF)"
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
                      description="Upload Experience Letter (PDF)"
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
                      description="Upload Latest Payslip (PDF)"
                      onUploadSuccess={(filePath) => setEmployee(prev => ({
                        ...prev,
                        payslipPath: filePath
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Family Documents */}
              <Box>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  Family Documents
                </Typography>
                <Grid container spacing={3}>
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
                      description="Upload Bank Passbook (PDF or Image)"
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

          {/* New Assignments Tab */}
          {activeTab === 6 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Typography variant="h6" sx={formStyles.sectionTitle}>
                Employee Assignments
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Onboarding Manager</InputLabel>
                    <Select
                      name="onboardingManagerId"
                      value={employee.onboardingManagerId || ""}
                      onChange={(e) => handleAssignOnboardingManager(e.target.value)}
                      label="Onboarding Manager"
                      disabled={managersLoading}
                      sx={formStyles.formField}
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
                      sx={formStyles.formField}
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

                {/* Display current assignments info */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    mt: 4, 
                    p: 3, 
                    bgcolor: 'rgba(61, 82, 160, 0.04)', 
                    borderRadius: 2,
                    border: '1px solid rgba(61, 82, 160, 0.1)'
                  }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                      Current Assignments
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Onboarding Manager:
                        </Typography>
                        <Typography variant="body1">
                          {managers.find(m => m.onboardingManagerId === employee.onboardingManagerId)
                            ? `${managers.find(m => m.onboardingManagerId === employee.onboardingManagerId).firstName} ${managers.find(m => m.onboardingManagerId === employee.onboardingManagerId).lastName}`
                            : 'Not Assigned'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Recruiter:
                        </Typography>
                        <Typography variant="body1">
                          {recruiters.find(r => r.recruiterId === employee.recruiterId)
                            ? `${recruiters.find(r => r.recruiterId === employee.recruiterId).firstName} ${recruiters.find(r => r.recruiterId === employee.recruiterId).lastName}`
                            : 'Not Assigned'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </StyledCard>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 4,
          pt: 3,
          borderTop: '1px solid rgba(61, 82, 160, 0.1)',
        }}>
          <Button
            onClick={handlePreviousTab}
            disabled={activeTab === 0}
            sx={{
              color: '#3D52A0',
              '&:hover': {
                backgroundColor: 'rgba(61, 82, 160, 0.04)',
              },
            }}
          >
            Previous
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={resetForm}
              sx={{
                borderColor: '#3D52A0',
                color: '#3D52A0',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 24px',
                '&:hover': {
                  borderColor: '#2A3B7D',
                  backgroundColor: 'rgba(61, 82, 160, 0.04)',
                  transform: 'translateY(-1px)',
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
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'inherit' }} />
                    Saving...
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
      <StyledCard>
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
              background: employee.isApproved 
                ? 'linear-gradient(45deg, #dc2626, #ef4444)'
                : 'linear-gradient(45deg, #059669, #34d399)',
              color: '#FFFFFF',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 32px',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                background: employee.isApproved 
                  ? 'linear-gradient(45deg, #b91c1c, #dc2626)'
                  : 'linear-gradient(45deg, #047857, #10b981)',
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
              background: employee.isBlocked 
                ? 'linear-gradient(45deg, #059669, #34d399)'
                : 'linear-gradient(45deg, #dc2626, #ef4444)',
              color: '#FFFFFF',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '12px 32px',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                background: employee.isBlocked 
                  ? 'linear-gradient(45deg, #047857, #10b981)'
                  : 'linear-gradient(45deg, #b91c1c, #dc2626)',
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