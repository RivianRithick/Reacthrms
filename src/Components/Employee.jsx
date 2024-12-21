import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "./ConfirmationDialog";
import CircularProgress from "@mui/material/CircularProgress";
import { MdDelete, MdClear, MdBlock } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit, FaIdCard, FaAddressCard, FaBook } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { Visibility, Download } from "@mui/icons-material";
import apiService from "../apiService";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControl,
  Tabs,
  Tab
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import { BsBank2 } from 'react-icons/bs';
import { MdWork, MdDocumentScanner } from 'react-icons/md';

const baseUrl = process.env.REACT_APP_BASE_URL;
const EmployeeComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [tempIsBlocked, setTempIsBlocked] = useState(false);
  const [tempBlockRemarks, setTempBlockRemarks] = useState("");
  const [tempIsApproved, setTempIsApproved] = useState(false);
  const [employee, setEmployee] = useState({
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    isBlocked: "",
    status: "",
    dataStatus: "all",
    showDeleted: false
  });
  const [showBlockRemarks, setShowBlockRemarks] = useState(false);
  const [deleteRemarks, setDeleteRemarks] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [blockRemarksDialogOpen, setBlockRemarksDialogOpen] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const bloodGroups = [
    "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"
  ];

  const bankNames = [
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

  useEffect(() => {
    fetchEmployees();
    fetchAssignedEmployees();
  }, [filters]);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/api/employee-registration?includeDeleted=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 
            ? "You are not authorized to view employees" 
            : "Failed to fetch employees. Please try again later."
        );
      }

      const data = await response.json();

      if (data?.status !== "Success" || !Array.isArray(data.data)) {
        throw new Error("Invalid response format from server");
      }

      // Fetch verification details for each approved employee
      const employeesWithDetails = await Promise.all(
        data.data.map(async (emp) => {
          const isDisabled = emp.isDisabled === true || 
                            emp.isDisabled === 1 || 
                            emp.disabledBy !== null || 
                            emp.disabledOn !== null;
          
          const employeeData = {
            ...emp,
            isActive: typeof emp.isActive === 'boolean' ? emp.isActive : true,
            isDisabled: isDisabled,
          };
          
          if (emp.isApproved) {
            try {
              const verifyResponse = await fetch(
                `${baseUrl}/api/employee-registration/update-is-approved`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    employeeId: emp.id,
                    isApproved: emp.isApproved,
                  }),
                }
              );
              
              if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                return {
                  ...employeeData,
                  verifiedBy: verifyData.data.verifiedBy,
                  verifiedOn: verifyData.data.verifiedOn,
                };
              }
            } catch (error) {
              console.error("Error fetching verification details:", error);
            }
          }
          return employeeData;
        })
      );

      setEmployees(employeesWithDetails);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignedEmployees = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/EmployeeRoleAssign?isAssigned=true`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Assigned employees response:', result);
        
        // Extract employee IDs from the response
        const assignedIds = result.data.map(assignment => {
          const empId = assignment.employeeRegistrationId || 
                       assignment.EmployeeRegistrationId || 
                       assignment.Employee?.Id || 
                       assignment.employee?.id;
          console.log('Processing assignment:', assignment);
          console.log('Extracted ID:', empId);
          return empId;
        }).filter(id => id !== undefined && id !== null);
        
        console.log('All assigned IDs:', assignedIds);
        setAssignedEmployees(assignedIds);
      }
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    
    // For alternate contact, allow empty or valid format
    if (name === 'alternateContact') {
      if (value === '' || value === '+91') {
        setEmployee(prev => ({ ...prev, [name]: value }));
        return;
      }
      if (value.startsWith('+91') && /^\+91\d*$/.test(value)) {
        setEmployee(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    // For primary contact
    if (name === 'contact') {
      if (value === '+91') {
        setEmployee(prev => ({ ...prev, [name]: value }));
        return;
      }
      if (value.startsWith('+91') && /^\+91\d*$/.test(value) && value.length <= 13) {
        setEmployee(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleView = async (contact, documentType) => {
    try {
      // Map documentType to backend-compatible format
      const mapDocumentType = (type) => {
        const mapping = {
          PAN: "pan",
          Aadhaar: "aadhar",
          Passbook: "passbook",
        };
        return mapping[type] || type.toLowerCase();
      };

      const normalizedDocumentType = mapDocumentType(documentType);

      // API request
      const response = await apiService.get(
        `/api/employee-registration/download-document?contact=${encodeURIComponent(
          contact
        )}&documentType=${normalizedDocumentType}`,
        { responseType: "blob" } // Expect binary data
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });

      // Open in a new tab
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing document:", error);
      toast.error(
        error.response?.status === 404
          ? `${documentType} document not found for this employee`
          : error.response?.status === 401
          ? "You are not authorized to view documents"
          : "Failed to view the document. Please try again later."
      );
    }
  };

  const handleDownload = async (contact, documentType) => {
    try {
      // Map documentType to backend-compatible format
      const mapDocumentType = (type) => {
        const mapping = {
          PAN: "pan",
          Aadhaar: "aadhar",
          Passbook: "passbook",
        };
        return mapping[type] || type.toLowerCase();
      };

      const normalizedDocumentType = mapDocumentType(documentType);

      // API request
      const response = await apiService.get(
        `/api/employee-registration/download-document?contact=${encodeURIComponent(
          contact
        )}&documentType=${normalizedDocumentType}`,
        { responseType: "blob" }
      );

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });

      // Trigger file download
      const fileName = `${normalizedDocumentType}_${contact}.${
        contentType.includes("pdf") ? "pdf" : "jpg"
      }`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error(
        error.response?.status === 404
          ? `Document of type "${documentType}" not found.`
          : "Failed to download the document."
      );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If creating new employee (no selectedEmployee)
      if (!selectedEmployee) {
        // Validate contact number
        if (!employee.contact || !/^\+91\d{10}$/.test(employee.contact)) {
          toast.error("Please enter a valid contact number (+91 followed by 10 digits)");
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(`${baseUrl}/api/employee-registration`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              contact: employee.contact
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 409) {
              toast.error("This contact number is already registered");
            } else {
              throw new Error(data.message || "Failed to create employee");
            }
            setIsLoading(false);
            return;
          }

          toast.success("Employee created successfully!");
          await fetchEmployees();
          setShowForm(false);
        } catch (error) {
          console.error("Error creating employee:", error);
          toast.error(error.message || "Failed to create employee. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Handle existing employee update (keep the existing update logic)
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          Object.values(errors).forEach(error => toast.error(error));
          setIsLoading(false);
          return;
        }

        // Format dates properly
        const formatDate = (dateString) => {
          if (!dateString || dateString === "") return null;
          return new Date(dateString).toISOString().split('T')[0];
        };

        // Prepare the payload with properly formatted dates and status
        const payload = {
          ...employee,
          id: selectedEmployee.id,
          dateOfBirth: formatDate(employee.dateOfBirth),
          fatherDateOfBirth: formatDate(employee.fatherDateOfBirth),
          motherDateOfBirth: formatDate(employee.motherDateOfBirth),
          spouseDateOfBirth: formatDate(employee.spouseDateOfBirth),
          // Handle other fields that should be null when empty
          alternateContact: employee.alternateContact === '+91' ? null : employee.alternateContact,
          spouseName: employee.spouseName || null,
          previousUANNumber: employee.previousUANNumber || null,
          previousESICNumber: employee.previousESICNumber || null,
          blockedBy: employee.blockedBy || null,
          blockedOn: null,
          blockedRemarks: employee.blockedRemarks || null,
          deletedBy: employee.deletedBy || null,
          deletedOn: null,
          deleteRemarks: employee.deleteRemarks || null,
          // Explicitly include status-related fields
          status: employee.status,
          isApproved: employee.status === "Active",
          verifiedBy: employee.status === "Active" ? employee.verifiedBy : null,
          verifiedOn: employee.status === "Active" ? employee.verifiedOn : null
        };

        // If status is being changed to Active, update approval status first
        if (employee.status === "Active" && selectedEmployee.status !== "Active") {
          const approvalResponse = await fetch(
            `${baseUrl}/api/employee-registration/update-is-approved`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                employeeId: selectedEmployee.id,
                isApproved: true
              }),
            }
          );

          if (!approvalResponse.ok) {
            throw new Error("Failed to update approval status");
          }
        }

        // Then proceed with the main update
        const updateResponse = await fetch(
          `${baseUrl}/api/employee-registration/update-by-contact`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.message || "Failed to update employee");
        }

        toast.success("Employee updated successfully!");
        await fetchEmployees();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error processing employee:", error);
      toast.error(
        error.response?.status === 405
          ? "Invalid API endpoint. Please contact support."
          : error.message || "Failed to process employee"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmployee((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
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
    }));

    setTempIsBlocked(false);
    setTempBlockRemarks("");
    setTempIsApproved(false);
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    // Helper function to format dates
    const formatDate = (dateString) => {
      if (!dateString) return "";
      // Remove time part and just keep the date
      return dateString.split('T')[0];
    };

    setSelectedEmployee(employee);
    setEmployee({
      ...employee,
      // Format all date fields
      dateOfBirth: formatDate(employee.dateOfBirth),
      fatherDateOfBirth: formatDate(employee.fatherDateOfBirth),
      motherDateOfBirth: formatDate(employee.motherDateOfBirth),
      spouseDateOfBirth: formatDate(employee.spouseDateOfBirth),
      gender: employee.gender ? capitalize(employee.gender) : "",
      maritalStatus: employee.maritalStatus
        ? capitalize(employee.maritalStatus)
        : "",
      alternateContact: employee.alternateContact || "+91",
      blockedRemarks: employee.blockedRemarks || "",
      blockedBy: employee.blockedBy || "",
      isActive: employee.isActive ?? true,
    });
    setTempIsBlocked(employee.isBlocked);
    setTempBlockRemarks(employee.blockedRemarks || "");
    setTempIsApproved(employee.isApproved);
    setShowForm(true);
  };

  const openDialog = (id) => {
    setEmployeeToDelete(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/employee-registration/soft-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          employeeId: employeeToDelete.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update employee status");
      }

      const result = await response.json();
      console.log('Delete/Restore Response:', result);

      toast.success(employeeToDelete.isDeleted ? 
        "Employee enabled successfully" : 
        "Employee disabled successfully"
      );
      setDialogOpen(false);
      setEmployeeToDelete(null);
      await fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || "Failed to update employee status");
    }
  };

  const getDisplayValueWithTooltip = (value) => (
    <Tooltip title={value ? "" : "Incomplete field"}>
      <span>{value || "Not Provided"}</span>
    </Tooltip>
  );

  const documentTypes = {
    PHOTOS: [
      { label: "Candidate Photo", key: "candidate", path: "candidatePhotoPath" },
      { label: "Family Photo", key: "family", path: "familyPhotoPath", 
        description: employee.maritalStatus === 'Married' ? 
          "(Employee, Spouse & Children)" : 
          "(Employee, Father & Mother)" 
      }
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

  const renderDocumentField = (label, filePath, documentType, contact) => {
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPG, PNG, or PDF)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(
          `${baseUrl}/api/employee-registration/upload-document/${contact}?documentType=${documentType}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          }
        );

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        setEmployee(prev => ({
          ...prev,
          [documentType + 'FilePath']: data.data.FilePath
        }));

        toast.success(`${label} uploaded successfully`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${label}`);
      }
    };

    return (
      <Box sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: 1, 
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="body2" gutterBottom>{label}</Typography>
        
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          {!filePath ? (
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={<IoIosAddCircle />}
              sx={{
                width: '100%',
                borderStyle: 'dashed'
              }}
            >
              Upload File
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
              />
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<IoIosAddCircle />}
                component="label"
                sx={{ flexGrow: 1 }}
              >
                Change File
                <input
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                />
              </Button>
              <Tooltip title="View Document">
                <IconButton 
                  size="small"
                  onClick={() => handleView(contact, documentType)}
                  color="primary"
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Document">
                <IconButton
                  size="small"
                  onClick={() => handleDownload(contact, documentType)}
                  color="primary"
                >
                  <Download />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        
        {filePath && (
          <Box sx={{ 
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'success.main',
            fontSize: '0.75rem'
          }}>
            <Box sx={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              backgroundColor: 'success.main',
              animation: 'pulse 2s infinite'
            }} />
            File Uploaded Successfully
          </Box>
        )}
      </Box>
    );
  };

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded token payload:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Create date object at noon UTC
    const date = new Date(dateString + 'T12:00:00Z');
    return date.toLocaleDateString();
  };

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

  const getFilteredEmployees = (employees, filters, searchQuery) => {
    if (!Array.isArray(employees)) return [];
    
    return employees.filter(employee => {
      // Basic search filter
      const matchesSearchQuery =
        searchQuery === "" || // If no search query, show all
        (employee.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (employee.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (employee.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (employee.address?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      // Show deleted or non-deleted based on filter
      const matchesDeletedFilter = filters.showDeleted === employee.isDeleted;

      // Other filters only apply to non-deleted employees
      if (!filters.showDeleted) {
        const matchesBlockedFilter =
          filters.isBlocked === "" ||
          employee.isBlocked.toString() === filters.isBlocked;

        const matchesDataStatusFilter = (() => {
          if (filters.dataStatus === "complete") {
            return employee.firstName && employee.lastName && employee.email && employee.address;
          }
          if (filters.dataStatus === "incomplete") {
            return !employee.firstName || !employee.lastName || !employee.email || !employee.address;
          }
          return true;
        })();

        const matchesStatusFilter =
          !filters.status || employee.status === filters.status;

        return (
          matchesSearchQuery &&
          matchesDeletedFilter &&
          matchesBlockedFilter &&
          matchesDataStatusFilter &&
          matchesStatusFilter
        );
      }

      // For deleted employees, only apply search filter
      return matchesSearchQuery && matchesDeletedFilter;
    });
  };

  const filteredEmployees = getFilteredEmployees(employees, filters, searchQuery);

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!employee.contact) errors.contact = "Contact is required";
    if (employee.contact) {
      const contactWithoutPrefix = employee.contact.replace("+91", "");
      if (!/^\d{10}$/.test(contactWithoutPrefix)) {
        errors.contact = "Contact must be 10 digits after +91 prefix";
      }
    }

    // Email validation
    if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      errors.email = "Invalid email format";
    }

    // Aadhaar validation
    if (employee.aadhaarNumber && !/^\d{12}$/.test(employee.aadhaarNumber)) {
      errors.aadhaarNumber = "Aadhaar number must be 12 digits";
    }

    // PAN validation
    if (employee.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(employee.panNumber)) {
      errors.panNumber = "Invalid PAN format";
    }

    // IFSC validation
    if (employee.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(employee.ifscCode)) {
      errors.ifscCode = "Invalid IFSC code format";
    }

    // Bank account number validation
    if (employee.bankAccountNumber && !/^\d{9,18}$/.test(employee.bankAccountNumber)) {
      errors.bankAccountNumber = "Bank account number must be 9-18 digits";
    }

    return errors;
  };

  const copyPresentToPermanent = () => {
    setEmployee(prev => ({
      ...prev,
      permanentAddress: prev.presentAddress,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNextTab = () => {
    setActiveTab((prev) => Math.min(prev + 1, 5)); // 5 is the last tab index
  };

  const handlePreviousTab = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0)); // 0 is the first tab index
  };

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

  const formStyles = {
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

  const renderForm = () => {
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
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
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
                          {renderDocumentField(
                            <>
                              {doc.label}
                              {doc.description && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                  {doc.description}
                                </Typography>
                              )}
                            </>,
                            employee[doc.path],
                            doc.key,
                            employee.contact
                          )}
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
                    console.log('Button click - Current employee:', employee);
                    console.log('Button click - Assigned IDs:', assignedEmployees);
                    console.log('Button click - Is assigned?', assignedEmployees.some(id => id === employee.id));
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
                      <MdClear size={20} />
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

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 4,
                mt: 2 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: employee.isApproved ? 'success.main' : 'text.secondary'
                }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: employee.isApproved ? 'success.main' : 'text.secondary',
                    animation: employee.isApproved ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
                      '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
                    }
                  }} />
                  <Typography variant="body2">
                    {employee.isApproved ? 'Verified' : 'Not Verified'}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: employee.isBlocked ? 'error.main' : 'text.secondary'
                }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: employee.isBlocked ? 'error.main' : 'text.secondary'
                  }} />
                  <Typography variant="body2">
                    {employee.isBlocked ? 'Blocked' : 'Not Blocked'}
                  </Typography>
                  {employee.isBlocked && (
                    <Tooltip title="View Block Remarks">
                      <IconButton
                        size="small"
                        onClick={() => setBlockRemarksDialogOpen(true)}
                        sx={{ 
                          ml: 1,
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.lighter',
                          }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
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

  return (
    <Box sx={{ padding: 2 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: "center", 
          fontWeight: "bold",
          color: "primary.main",
          marginBottom: 4
        }}
      >
        Employee Management
      </Typography>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {isLoading ? (
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "200px" 
        }}>
          <CircularProgress />
        </Box>
      ) : showForm ? (
        renderForm()
      ) : (
        <>
          {/* Search and Filters Section */}
          <Box sx={{ 
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: 3,
            marginBottom: 3
          }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Search & Filters</Typography>
            <Grid container spacing={2}>
              {/* Search Field - Full Width */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search by Name, Email, or Address"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              
              {/* Status Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Status Filter</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </Box>
              </Grid>

              {/* Block Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Block Filter</InputLabel>
                  <Select
                    name="isBlocked"
                    value={filters.isBlocked}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Blocked</MenuItem>
                    <MenuItem value="false">Not Blocked</MenuItem>
                  </Select>
                </Box>
              </Grid>

              {/* Data Completion Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Data Completion Filter</InputLabel>
                  <Select
                    name="dataStatus"
                    value={filters.dataStatus}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="complete">Complete</MenuItem>
                    <MenuItem value="incomplete">Incomplete</MenuItem>
                  </Select>
                </Box>
              </Grid>

              {/* Show Deleted Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  padding: 2, 
                  borderRadius: 1,
                  height: '100%'
                }}>
                  <InputLabel sx={{ marginBottom: 1, fontWeight: 'bold' }}>Status</InputLabel>
                  <Select
                    name="showDeleted"
                    value={filters.showDeleted}
                    onChange={handleFilterChange}
                    fullWidth
                  >
                    <MenuItem value={false}>Active Employees</MenuItem>
                    <MenuItem value={true}>Disabled Employees</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Employees List Section */}
          <Box sx={{ 
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: 3
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
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>First Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Verification Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Active Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
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
                    filteredEmployees.map((employee, index) => (
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
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{employee.firstName || "N/A"}</TableCell>
                        <TableCell>{employee.lastName || "N/A"}</TableCell>
                        <TableCell>{employee.contact || "N/A"}</TableCell>
                        <TableCell>{employee.email || "N/A"}</TableCell>
                        <TableCell>
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
                                  gap: 0.5
                                }}
                              >
                                ✓ Verified by {employee.verifiedBy || "Unknown"}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography 
                              variant="body2" 
                              sx={{ color: 'text.secondary' }}
                            >
                              Not Verified
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: getStatusColor(employee.status),
                              fontWeight: 'medium'
                            }}
                          >
                            {employee.status || "Pending"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() => handleEdit(employee)}
                              sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.2s'
                                }
                              }}
                            >
                              <FaEdit sx={{ marginRight: 0.5 }} /> Edit
                            </Button>
                            <Button
                              onClick={() => {
                                setEmployeeToDelete(employee);
                                setDialogOpen(true);
                              }}
                              variant="contained"
                              color={employee.isDeleted ? "success" : "error"}
                              size="small"
                              disabled={employee.isBlocked || employee.isApproved}
                              sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  transition: 'transform 0.2s'
                                }
                              }}
                            >
                              <MdDelete sx={{ marginRight: 0.5 }} /> 
                              {employee.isDeleted ? "Enable" : "Disable"}
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      {/* Confirmation Dialogs */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEmployeeToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: employeeToDelete?.isDeleted ? 'success.main' : 'error.main',
          fontWeight: 600,
          pb: 1
        }}>
          {employeeToDelete?.isDeleted ? "Enable Employee" : "Disable Employee"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Are you sure you want to {employeeToDelete?.isDeleted ? "enable" : "disable"} this employee?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              setEmployeeToDelete(null);
            }}
            variant="outlined"
            sx={{ 
              borderRadius: '50px',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            sx={{ 
              borderRadius: '50px',
              px: 3,
              background: employeeToDelete?.isDeleted 
                ? 'linear-gradient(45deg, #00c853 30%, #69f0ae 90%)'
                : 'linear-gradient(45deg, #ff1744 30%, #ff4569 90%)'
            }}
          >
            {employeeToDelete?.isDeleted ? "Enable" : "Disable"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog 
        open={blockDialogOpen} 
        onClose={() => {
          setBlockDialogOpen(false);
          setTempBlockRemarks("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          pb: 1,
          color: tempIsBlocked ? 'error.main' : 'success.main',
          fontWeight: 600 
        }}>
          {tempIsBlocked ? "Block Employee" : "Unblock Employee"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tempIsBlocked 
              ? "Please provide a reason for blocking this employee." 
              : "Are you sure you want to unblock this employee?"}
          </Typography>
          {tempIsBlocked && (
            <TextField
              fullWidth
              label="Block Remarks"
              multiline
              rows={4}
              value={tempBlockRemarks}
              onChange={(e) => setTempBlockRemarks(e.target.value)}
              required
              error={tempIsBlocked && !tempBlockRemarks}
              helperText={tempIsBlocked && !tempBlockRemarks ? "Remarks are required for blocking" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => {
              setBlockDialogOpen(false);
              setTempBlockRemarks("");
            }}
            variant="contained"
            sx={{ 
              borderRadius: '50px',
              px: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog 
        open={blockRemarksDialogOpen} 
        onClose={() => setBlockRemarksDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: 'error.main',
          fontWeight: 600,
          borderBottom: '1px solid #eee',
          pb: 2
        }}>
          Block Remarks
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            p: 3,
            border: '1px solid #eee'
          }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {employee.blockedRemarks || "No remarks available"}
            </Typography>
            {employee.blockedBy && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.5,
                mt: 2,
                pt: 2,
                borderTop: '1px solid #eee'
              }}>
                <Typography variant="body2" color="text.secondary">
                  Blocked by: {employee.blockedBy}
                </Typography>
                {employee.blockedOn && (
                  <Typography variant="body2" color="text.secondary">
                    Blocked on: {new Date(employee.blockedOn).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => setBlockRemarksDialogOpen(false)}
            variant="contained"
            sx={{ 
              borderRadius: '50px',
              px: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeComponent;
