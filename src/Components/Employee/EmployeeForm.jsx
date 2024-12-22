import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  styled
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { FaIdCard, FaAddressCard, FaBook } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';
import { MdWork, MdDocumentScanner, MdBlock } from 'react-icons/md';
import DocumentUpload from './DocumentUpload';
import { bloodGroups, bankNames, documentTypes, formStyles } from './constants';

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 60,
  minWidth: 160,
  width: 160,
  padding: '8px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  
  '&.Mui-selected': {
    color: '#fff',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 2px 10px rgba(33, 150, 243, 0.3)',
  },

  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    transform: 'translateY(-2px)',
  },

  '& .MuiTab-iconWrapper': {
    marginRight: '8px',
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  textAlign: 'center',
  fontSize: '2.5rem',
  marginBottom: '0.5rem',
  animation: 'fadeIn 0.5s ease-in',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

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
  setBlockRemarksDialogOpen
}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNextTab = () => {
    setActiveTab((prev) => Math.min(prev + 1, 5));
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

  if (!selectedEmployee) {
    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: { xs: 2, sm: 4 },
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            textAlign: "center",
            mb: 4
          }}
        >
          Create New Employee
        </Typography>

        <TextField
          fullWidth
          label="Contact Number"
          name="contact"
          value={employee.contact}
          onChange={handleContactChange}
          required
          sx={{ mb: 3 }}
          helperText="Format: +91 followed by 10 digits"
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              py: 1.5
            }}
          >
            {isLoading ? "Creating..." : "Create Employee"}
          </Button>
          <Button 
            variant="outlined" 
            onClick={resetForm}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              py: 1.5
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={formStyles.formContainer}
    >
      <Box sx={{ 
        borderBottom: '1px solid #eee', 
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

      <Box sx={{ 
        borderBottom: '1px solid #eee',
        mb: 4,
        position: 'relative'
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 0,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTabs-flexContainer': {
              gap: 1,
            },
            '& .MuiTab-root': {
              minWidth: 160,
              width: 160,
            }
          }}
        >
          <StyledTab 
            label="Basic Info" 
            icon={<FaIdCard size={20} />} 
            iconPosition="start"
          />
          <StyledTab 
            label="Family Info" 
            icon={<FaAddressCard size={20} />} 
            iconPosition="start"
          />
          <StyledTab 
            label="Address" 
            icon={<FaBook size={20} />} 
            iconPosition="start"
          />
          <StyledTab 
            label="Bank Details" 
            icon={<BsBank2 size={20} />} 
            iconPosition="start"
          />
          <StyledTab 
            label="Employment" 
            icon={<MdWork size={20} />} 
            iconPosition="start"
          />
          <StyledTab 
            label="Documents" 
            icon={<MdDocumentScanner size={20} />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <Box sx={formStyles.tabPanel}>
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
                  sx={formStyles.formField}
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

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
                size="small"
                onClick={copyPresentToPermanent}
                sx={{ 
                  mt: 1,
                  ...formStyles.formField 
                }}
              >
                Copy Present Address to Permanent Address
              </Button>
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
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
                  {bankNames.map((bank) => (
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

        {activeTab === 5 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(documentTypes).map(([section, docs]) => (
              <Box key={section}>
                <Typography variant="h6" sx={formStyles.sectionTitle}>
                  {section.replace(/_/g, ' ')}
                </Typography>
                <Grid container spacing={3}>
                  {docs.map((doc) => (
                    <Grid item xs={12} sm={6} md={section === 'IDENTITY' ? 3 : 4} key={doc.key}>
                      <Box sx={formStyles.documentCard}>
                        <DocumentUpload
                          label={doc.label}
                          filePath={employee[doc.path]}
                          documentType={doc.key}
                          contact={employee.contact}
                          description={doc.description}
                          onUploadSuccess={(field, value) => setEmployee(prev => ({
                            ...prev,
                            [field]: value
                          }))}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}

            <Box sx={{ 
              mt: 4, 
              pt: 4, 
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'center',
              gap: 3
            }}>
              <Button
                variant="contained"
                color={employee.isApproved ? "error" : "success"}
                onClick={() => {
                  setEmployee(prev => ({
                    ...prev,
                    isApproved: !prev.isApproved,
                    status: !prev.isApproved ? "Active" : "Pending"
                  }));
                }}
                disabled={employee.isBlocked || assignedEmployees.some(id => id === employee.id)}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: employee.isApproved ? 
                    'linear-gradient(45deg, #ff1744 30%, #ff4569 90%)' : 
                    'linear-gradient(45deg, #00c853 30%, #69f0ae 90%)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e'
                  }
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
                color={employee.isBlocked ? "success" : "error"}
                onClick={() => {
                  setBlockDialogOpen(true);
                  setTempIsBlocked(!employee.isBlocked);
                }}
                disabled={employee.isApproved}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: employee.isBlocked ? 
                    'linear-gradient(45deg, #00c853 30%, #69f0ae 90%)' : 
                    'linear-gradient(45deg, #ff1744 30%, #ff4569 90%)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e'
                  }
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
          </Box>
        )}
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mt: 4,
        pt: 3,
        borderTop: '1px solid #eee'
      }}>
        {activeTab > 0 && (
          <Button
            onClick={handlePreviousTab}
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              py: 1.5
            }}
          >
            Previous
          </Button>
        )}
        {activeTab < 5 ? (
          <Button
            onClick={handleNextTab}
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              ml: 'auto',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 4px 15px rgba(33, 203, 243, .3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(33, 203, 243, .4)',
              },
            }}
          >
            Next
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              sx={{
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 500,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Saving...
                </Box>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button 
              variant="outlined" 
              onClick={resetForm}
              sx={{
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 500,
                px: 4,
                py: 1.5
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeForm; 