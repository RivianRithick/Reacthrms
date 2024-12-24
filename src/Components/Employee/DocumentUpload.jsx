import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Paper
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
      const timestamp = new Date().getTime();
      const backendDocType = getBackendDocumentType(documentType);
      const url = `${baseUrl}/api/employee-registration/download-document?contact=${encodeURIComponent(
        contact
      )}&documentType=${encodeURIComponent(backendDocType)}&t=${timestamp}`;

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
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        p: 2,
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid',
        borderColor: documentUrl ? 'rgba(5, 150, 105, 0.2)' : 'rgba(0, 0, 0, 0.08)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          borderColor: documentUrl ? 'rgba(5, 150, 105, 0.4)' : 'rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '0.95rem',
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
              mt: 0.5,
              fontSize: '0.8rem',
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <input
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png,.pdf"
      />

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1, 
        alignItems: 'center',
        mt: 'auto',
        width: '100%'
      }}>
        {documentUrl ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              width: '100%',
            }}>
              <Tooltip title="View Document">
                <Button
                  onClick={handleView}
                  variant="contained"
                  size="small"
                  sx={{
                    flex: 1,
                    minWidth: 'auto',
                    borderRadius: '6px',
                    p: 1,
                    background: 'linear-gradient(45deg, #3D52A0, #7091E6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2A3B7D, #5F739C)',
                    },
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 18 }} />
                </Button>
              </Tooltip>
              <Tooltip title="Download Document">
                <Button
                  onClick={handleDownload}
                  variant="contained"
                  size="small"
                  sx={{
                    flex: 1,
                    minWidth: 'auto',
                    borderRadius: '6px',
                    p: 1,
                    background: 'linear-gradient(45deg, #059669, #34d399)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #047857, #10b981)',
                    },
                  }}
                >
                  <GetAppIcon sx={{ fontSize: 18 }} />
                </Button>
              </Tooltip>
            </Box>
            <Button
              onClick={() => fileInputRef.current.click()}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.7rem',
                py: 0.5,
                borderColor: 'rgba(0, 0, 0, 0.12)',
                color: 'text.secondary',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                },
              }}
            >
              Replace File
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => fileInputRef.current.click()}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              py: 1,
              borderColor: 'rgba(0, 0, 0, 0.12)',
              color: 'text.primary',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'primary.main',
              },
            }}
          >
            Choose File
          </Button>
        )}

        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.75rem',
            textAlign: 'center',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedFile ? selectedFile.name : (documentUrl ? 'File uploaded' : 'No file chosen')}
        </Typography>
      </Box>

      {uploadSuccess && (
        <Box sx={{ 
          position: 'absolute',
          top: 8,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#059669',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(0.95)',
              boxShadow: '0 0 0 0 rgba(5, 150, 105, 0.4)',
            },
            '70%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 6px rgba(5, 150, 105, 0)',
            },
            '100%': {
              transform: 'scale(0.95)',
              boxShadow: '0 0 0 0 rgba(5, 150, 105, 0)',
            },
          },
        }} />
      )}
    </Paper>
  );
};

export default DocumentUpload; 