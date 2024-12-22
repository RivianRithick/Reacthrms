import React from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { IoIosAddCircle } from "react-icons/io";
import { Visibility, Download } from "@mui/icons-material";
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
      onUploadSuccess(documentType + 'FilePath', data.data.FilePath);
      toast.success(`${label} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${label}`);
    }
  };

  const handleView = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/employee-registration/download-document?contact=${encodeURIComponent(
          contact
        )}&documentType=${documentType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Document not found' : 'Failed to view document');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing document:", error);
      toast.error(error.message || "Failed to view the document");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/employee-registration/download-document?contact=${encodeURIComponent(
          contact
        )}&documentType=${documentType}`,
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
    <Box sx={{ 
      border: '1px solid #e0e0e0', 
      borderRadius: 1, 
      p: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="body2" gutterBottom>
        {label}
        {description && (
          <Typography variant="caption" display="block" color="text.secondary">
            {description}
          </Typography>
        )}
      </Typography>
      
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
                onClick={handleView}
                color="primary"
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Document">
              <IconButton
                size="small"
                onClick={handleDownload}
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

export default DocumentUpload; 