import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { IoIosAddCircle } from "react-icons/io";
import { Visibility as VisibilityIcon, GetApp as GetAppIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const baseUrl = process.env.REACT_APP_BASE_URL;

const DocumentUpload = ({ 
  label, 
  filePath, 
  documentType, 
  contact, 
  description, 
  onUploadSuccess 
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(filePath || null);

  const getBackendDocumentType = (documentType) => {
    const documentTypeMap = {
      'CANDIDATE_PHOTO': 'candidate',
      'PAN_CARD': 'pan',
      'AADHAAR_CARD': 'aadhar',
      'VOTER_ID': 'voterid',
      'TENTH_CERTIFICATE': 'tenth',
      'TWELFTH_CERTIFICATE': 'twelth',
      'DEGREE_CERTIFICATE': 'degree',
      'OFFER_LETTER': 'offer',
      'EXPERIENCE_LETTER': 'experience',
      'PAYSLIP': 'payslip',
      'FAMILY_PHOTO': 'family',
      'PASSBOOK': 'passbook'
    };
    return documentTypeMap[documentType] || documentType.toLowerCase();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType.toUpperCase());
        formData.append('contact', contact);

        const response = await fetch(`${baseUrl}/api/employee-registration/upload-document`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload document');
        }

        const data = await response.json();
        setDocumentUrl(data.filePath);
        setUploadSuccess(true);
        onUploadSuccess(data.filePath);
        toast.success('Document uploaded successfully');
      } catch (error) {
        console.error('Error uploading document:', error);
        toast.error(error.message || 'Failed to upload document');
      }
    }
  };

  const handleView = async () => {
    try {
      // Create the URL with a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const backendDocType = getBackendDocumentType(documentType);
      const url = `${baseUrl}/api/employee-registration/download-document?contact=${encodeURIComponent(
        contact
      )}&documentType=${encodeURIComponent(backendDocType)}&t=${timestamp}`;

      // Open URL directly in a new tab
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    } catch (error) {
      console.error("Error viewing document:", error);
      toast.error(error.message || "Failed to view the document");
    }
  };

  const handleDownload = async () => {
    try {
      const backendDocType = getBackendDocumentType(documentType);
      const response = await fetch(
        `${baseUrl}/api/employee-registration/download-document?contact=${encodeURIComponent(
          contact
        )}&documentType=${encodeURIComponent(backendDocType)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Document not found' : 'Failed to download document');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentType}_${contact}.${blob.type.includes('pdf') ? 'pdf' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error(error.message || "Failed to download the document");
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed rgba(61, 82, 160, 0.2)',
        borderRadius: '16px',
        p: 3,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s ease-in-out',
        height: '100%',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          borderColor: '#3D52A0',
          backgroundColor: 'rgba(61, 82, 160, 0.04)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ flex: '0 0 auto', mb: 2 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            color: '#3D52A0',
            mb: 1
          }}
        >
          {label}
        </Typography>
        {description && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              display: 'block',
              mb: 2
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <input
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.pdf"
        />
        <Button
          onClick={() => fileInputRef.current.click()}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            borderColor: '#3D52A0',
            color: '#3D52A0',
            '&:hover': {
              borderColor: '#2A3B7D',
              backgroundColor: 'rgba(61, 82, 160, 0.04)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Choose File
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {selectedFile ? selectedFile.name : (filePath ? 'File uploaded' : 'No file chosen')}
        </Typography>
        {uploadSuccess && (
          <Box sx={{ 
            mt: 2,
            p: 2,
            borderRadius: '12px',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            border: '1px solid rgba(5, 150, 105, 0.2)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(5, 150, 105, 0.4)',
              },
              '70%': {
                boxShadow: '0 0 0 10px rgba(5, 150, 105, 0)',
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(5, 150, 105, 0)',
              },
            },
          }}>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
              File uploaded successfully!
            </Typography>
          </Box>
        )}
      </Box>

      {/* View and Download Buttons */}
      {documentUrl && (
        <Box sx={{ mt: 'auto', pt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            onClick={handleView}
            variant="contained"
            startIcon={<VisibilityIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(61, 82, 160, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            View
          </Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            startIcon={<GetAppIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              padding: '10px 24px',
              background: 'linear-gradient(45deg, #059669, #34d399)',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #047857, #10b981)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Download
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DocumentUpload; 