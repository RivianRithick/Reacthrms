export const bloodGroups = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"
];

export const bankNames = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Axis Bank",
  "Canara Bank",
  "Union Bank of India",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "IndusInd Bank",
  "Yes Bank",
  "Kotak Mahindra Bank",
  "Federal Bank"
];

export const documentTypes = {
  PHOTOS: [
    { label: "Candidate Photo", key: "candidate", path: "candidatePhotoPath" },
    { label: "Family Photo", key: "family", path: "familyPhotoPath" }
  ],
  EDUCATIONAL: [
    { label: "10th Certificate", key: "tenth", path: "tenthCertificatePath" },
    { label: "12th Certificate", key: "twelth", path: "twelthCertificatePath" },
    { label: "Degree Certificate", key: "degree", path: "degreeCertificatePath" }
  ],
  EXPERIENCE: [
    { label: "Offer Letter", key: "offer", path: "offerLetterPath" },
    { label: "Experience/Relieving Letter", key: "experience", path: "experienceLetterPath" },
    { label: "Payslip", key: "payslip", path: "payslipPath" }
  ],
  IDENTITY: [
    { label: "PAN Card", key: "pan", path: "panCardFilePath" },
    { label: "Aadhaar Card", key: "aadhar", path: "aadhaarCardFilePath" },
    { label: "Passbook", key: "passbook", path: "passbookFilePath" },
    { label: "Voter ID", key: "voterid", path: "voterIdPath" }
  ]
};

export const initialEmployeeState = {
  // Basic Personal Information
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  maritalStatus: "",
  email: "",
  contact: "+91",
  alternateContact: "",
  candidatePhotoPath: "",

  // Family Information
  fatherName: "",
  motherName: "",
  fatherDateOfBirth: "",
  motherDateOfBirth: "",
  spouseName: "",
  spouseDateOfBirth: "",
  familyPhotoPath: "",

  // Address Information
  presentAddress: "",
  presentState: "",
  presentDistrict: "",
  permanentAddress: "",

  // Bank Account Details
  bankAccountName: "",
  bankName: "",
  bankAccountNumber: "",
  ifscCode: "",

  // Previous Employment Details
  previousUANNumber: "",
  previousESICNumber: "",

  // Identity Documents
  aadhaarNumber: "",
  panNumber: "",

  // Document Paths
  panCardFilePath: "",
  aadhaarCardFilePath: "",
  passbookFilePath: "",
  voterIdPath: "",
  tenthCertificatePath: "",
  twelthCertificatePath: "",
  degreeCertificatePath: "",
  offerLetterPath: "",
  experienceLetterPath: "",
  payslipPath: "",

  // Status and Tracking
  status: "Pending",
  isBlocked: false,
  isApproved: false,
  isDeleted: false,
  blockedRemarks: "",
  blockedBy: "",
  deletedBy: "",
  deletedOn: null,
  deleteRemarks: ""
};

export const formStyles = {
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    padding: { xs: 2, sm: 4 },
    maxWidth: 1200,
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '8px',
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    },
  },
  tabPanel: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: 3,
    mt: 2,
    animation: 'fadeIn 0.3s ease-in',
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(10px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  formField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      '&.Mui-focused': {
        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      '&.Mui-focused': {
        color: '#2196F3',
      },
    },
  },
  documentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    p: 3,
    height: '100%',
    transition: 'all 0.3s ease',
    border: '1px solid #eee',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      borderColor: '#2196F3',
    },
  },
  sectionTitle: {
    color: '#2196F3',
    fontWeight: 600,
    mb: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&::after': {
      content: '""',
      flex: 1,
      height: '2px',
      background: 'linear-gradient(to right, #2196F3 0%, transparent 100%)',
      marginLeft: '8px',
    },
  },
}; 